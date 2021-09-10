import { globalScheduler, never, p, s } from "./scheduler";
import { TimeResolution } from "./time";
import FastPriorityQueue from "fastpriorityqueue";
import { TransportTime } from "tone";
import { TickSignal } from "tone/build/esm/core/clock/TickSignal";
import { theWindow } from "tone/build/esm/core/context/AudioContext";
import { assert } from "tone/build/esm/core/util/Debug";
import { tsImportEqualsDeclaration } from "@babel/types";


/**
 * Transport can be used to have a "fixed" timeline with events that are kept even if the
 * global scheduler is stopped.
 * 
 * It can be started or stopped. Note that start & stop do NOT behave as though they were on the 
 * timeline; instead, they're "ephemeral". Stop immediately clears all events after the provided time;
 * "start" immediately clears & schedules all events.
 * 
 * If start / stop need to behave as though they were on a timleine, they need to be put on
 * a separate, different transport that schedules them.
 * 
 * It can be looped by a "loopInterval", which will schedule a new "start" event ever interval time.
 * 
 * It's analogous to a MIDI file which can be scheduled to start & stop. at any point on the global scheduler
 * (only that data associated with every MIDI event is arbitrary).
 * 
 * TODO: * Add ability to play back with "offset".
 * TODO: * Make events scheduled beyond interval not be triggered
 */
export class Transport {
    constructor(
        loopInterval,
    ){
        this.tpEvents = {} // {tpid: {callback, tptime, data}}
        this.tp2glEvents = {} // {tpid: {glid, gltime}}

        this.interval = loopInterval ?? never;
        // Keeps id of next control event, so it can be unscheduled if needed.
        this.nextControlEventId = null;
        this.glStartTime = never;

        globalScheduler.on("stop", () => this.stop(s(0)));
    }
    getUniqueEventId = () => {
        this.eventIdCounter = (this.eventIdCounter ?? 0) + 1;
        return this.eventIdCounter;
    }


    schedule = (tpid) => {
        assert(!(this.isScheduled(tpid)), "Tried scheduling already schedueld event");
        // Calculate global time
        const {tptime, callback, data} = this.tpEvents[tpid];
        const gltime = tptime.add(this.glStartTime);
        // Create callback that also deregisters this event
        const deregisterAndCall = (time, data) => {
            delete this.tp2glEvents[tpid];
            callback(time, data);
        }
        const glid = gltime.schedule(deregisterAndCall, data);
        // Register this event
        this.tp2glEvents[tpid] = {glid, gltime};
    }

    start = time => {
        this.glStartTime = time;
        // Reschedule all events
        Object.keys(this.tpEvents).forEach(tpid => {
            if(this.isScheduled(tpid))
                this.unschedule(tpid);
            this.schedule(tpid);
        });
        
        // Unschedule other control event
        if(this.nextControlEventId)
            globalScheduler.unschedule(this.nextControlEventId);

        // Schedule start if interval < infinity
        if(this.interval.isBefore(never))
            this.nextControlEventId = time.add(this.interval).schedule(this.start);
    }

    stop = time => {
        // Unschedule next control event
        if(this.nextControlEventId)
            globalScheduler.unschedule(this.nextControlEventId);

        // Unschedule all events after stop event
        Object.entries(this.tp2glEvents).forEach(([tpid, {gltime}]) => {
            if(gltime.isAfter(time) && this.isScheduled(tpid)){
                this.unschedule(tpid)
            }
        });
    }

    isRunning = () => {
        return this.glStartTime.isBefore(globalScheduler.now());
    }

    isScheduled = tpid => {
        return tpid in this.tp2glEvents;
    }

    addEvent = (tptime, callback, data) => {
        const tpid = this.getUniqueEventId();
        this.tpEvents[tpid] = {callback, data, tptime};
        // Check if transport is currently running & event hasn't yet passed
        if(this.isRunning() && this.getTpNow().isOnOrBefore(tptime)){
            // If so, then schedule this event.
            this.schedule(tpid);
        }
    }

    removeEvent = tpid => {
        if(this.isScheduled(tpid)){
            this.unschedule(tpid);
        }
        delete this.tpEvents[tpid];
    }

    removeAllEvents = () => {
        Object.keys(this.tpEvents).forEach(tpid => this.removeEvent(tpid));
    }

    setEventData = (tpid, data) => {
        if(this.isScheduled(tpid)){
            const {glid} = this.tp2glEvents[tpid];
            globalScheduler.replaceEventData(glid, data);
        }

        this.tpEvents[tpid] = {...this.tpEvents[tpid], data};
    }

    setEventCallback = (tpid, callback) => {
        if(this.isScheduled(tpid)){
            const {glid} = this.tp2glEvents[tpid];
            globalScheduler.replaceEventCallback(glid, callback);
        }

        this.tpEvents[tpid] = {...this.tpEvents[tpid], callback};
    }

    setLoopInterval = interval => {
        this.interval = interval;
        // Remove next control event (assumed to be "start") // TODO
        if(this.nextControlEventId){
            globalScheduler.unschedule(this.nextControlEventId);
        }

        // If the loop interval is finite and we're running
        if(this.interval.isBefore(never) && this.isRunning()){
            const glnow = globalScheduler.now();
            const tpnow = this.getTpNow(glnow);
            // Set glStartTime to last start before current transport cursor
            const startToNow = glnow.subtract(this.glStartTime);
            const lastStartTime = glnow.subtract(startToNow.mod(interval));
            this.glStartTime = lastStartTime;
            // Reschedule all events
            Object.keys(this.tp2glEvents).forEach(tpid => this.unschedule(tpid));
            Object.entries(this.tpEvents).forEach(([tpid, {tptime}]) => {
                if(tptime.isOnOrAfter(tpnow))
                    this.schedule(tpid);
            })
            // Schedule next start
            this.nextControlEventId = lastStartTime.add(interval).schedule(this.start);
        }
    }

    getTpNow = (glnow=globalScheduler.now()) => {
        return glnow.subtract(this.glStartTime);
    }
    
    unschedule = tpid => {
        const {glid} = this.tp2glEvents[tpid];
        globalScheduler.unschedule(glid);
        delete this.tp2glEvents[tpid];
    }


}

export class StepSequencer{
    constructor(callback, interval, values=[], doLoop=true){
        this.callback = callback;
        this.interval = interval;
        this.values = values;
        this.doLoop = doLoop;

        this.transport = new Transport();

        // Update transport by setting all values also through setters
        this.setInterval(interval);
        this.setDoLoop(doLoop);
        this.setCallback(callback);
        this.setValues(values);
    }

    debug = msg => {
        console.debug(`[StepSequencer]{${globalScheduler.now().toPulse()}} ${msg}`);
    }

    setValues = values => {
        this.debug("Set new values");
        this.values = values;
        this.transport.removeAllEvents();
        
        const callbackUnpackingIndex = (time, {v, i}) => this.callback(time, v, i);
        this.values.forEach((v, i) => 
            this.transport.addEvent(this.interval.multiply(i), callbackUnpackingIndex, {v, i})
        );
        this.setInterval(this.interval);
    }

    setCallback = callback => {
        this.callback = callback;
    }

    setInterval = interval => {
        this.interval = interval;
        if(this.doLoop)
            this.transport.setLoopInterval(this.interval.multiply((Math.max(1, this.values.length))));
        else
            this.transport.setLoopInterval(never);
    }

    setDoLoop = doLoop => {
        this.doLoop = doLoop;
        this.setInterval(this.interval);
    }

    

    start = time => this.transport.start(time);
    stop = time => this.transport.stop(time);
}