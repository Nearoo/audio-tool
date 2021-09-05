
import FastPriorityQueue from 'fastpriorityqueue';
import { useEffect } from 'react';
import * as Tone from 'tone';
import { Emitter } from 'tone';
import { assert } from 'tone/build/esm/core/util/Debug';
import { SchedulerTime, TimeResolution, Time } from './time';


export class PreciseScheduler extends Emitter{
    constructor({
        ppb = 64, // pulse per beat, i.e. time resolution
        bpm = 120, // beats per minute, i.e. speed
        lookAhead = 12, // ms to schedule in advance
    }={} ){
        super();
        // Event: {time, id}
        this.eventQueue = new FastPriorityQueue((ev1, ev2) => ev1.time.isBefore(ev2.time));
        this.resolution = new TimeResolution(bpm, ppb);
        this.dispatchTimeoutID = null;

        this.p = pulse => SchedulerTime.fromPulse(pulse, this)
        this.s = seconds => SchedulerTime.fromSeconds(seconds, this)
        this.b = barNot => SchedulerTime.fromBarNotation(barNot, this)

        // {id: callback}
        this.callbackRegister = {}
        // {id: data}
        this.dataRegister = {}
        // counter to get unique event ids
        this.lastScheduledEventId = 0

        this.doStop = false;

        this.lookAhead = this.s(lookAhead*0.001);
    }

    isRunning = () => {
        return !this.doStop;
    }

    getResolution = () => this.resolution;

    getNewEventId = () => {
        this.lastScheduledEventId += 1;
        return this.lastScheduledEventId;
    }

    _rescheduleDispatch = () => {
        clearTimeout(this.dispatchTimeoutID);
        if(!this.doStop)
            this.dispatchTimeoutID = setTimeout(this.dispatch, this.lookAhead.toSeconds()/2);
        else
            this.dispatchTimeoutID = null;
    }

    clear = () =>{
        while(!this.eventQueue.isEmpty()) this.eventQueue.poll();
    }

    stop = () => {
        this.doStop = true;
        this.clear();
        this.emit("stop");
    }

    start = () => {
        this.doStop = false;
        this.emit("start");
        this.dispatch();
    }

    dispatch = () =>{
        const now = this.now();
        while(
            !this.doStop &&
            !this.eventQueue.isEmpty() && 
            this.eventQueue.peek().time.isBefore(now.add(this.lookAhead))
            ){
                const {time, id} = this.eventQueue.poll();
                const schedTime = time.isBefore(now) ? now : time;
                const callback = this.callbackRegister[id];
                const data = this.dataRegister[id];

                console.debug(`[${now.toSeconds()}, ${now.toPulse()}] Dispatching event with id ${id} scheduled for pulse [${schedTime.toPulse()}]`)
                callback(schedTime, data);
                this._cleanUp(id);
        }
        this._rescheduleDispatch();
    }

    schedule = (callback, t, data) =>{
        assert(t instanceof Time, "Scheduling time must be Time object.");
        const id = this.getNewEventId();
        this.eventQueue.add({time: t, id});
        this.callbackRegister[id] = callback;
        this.dataRegister[id] = data;
        console.debug(`Scheduled event with id ${id} at pulse  ${t.toPulse()}`)
        return id;
    }

    unschedule = eventId => {
        if(!(eventId) in this.callbackRegister)
            console.warn("Removed inexistant event with id ", eventId);
        this.eventQueue.removeOne(ev => ev.id === eventId);
        this._cleanUp(eventId);
    }

    /* Removes all data associated with the eventId. Doesn't touch eventQueue. */
    _cleanUp = eventId => {
        delete this.callbackRegister[eventId];
        delete this.dataRegister[eventId];
    }

    replaceScheduledCallback = (id, callback) => {
        assert(id in this.callbackRegister, "Tried replacing data of inexistant event");
        this.callbackRegister[id] = callback;
    }

    replaceEventData = (id, data) => {
        assert(id in this.dataRegister, "Tried replacing data of inexistant event");
        this.dataRegister[id] = data;
    }

    now = () => {
        return this.s(Tone.getContext().now());
    }

    scheduleDraw = (callback, time) => {
        Tone.Draw.schedule(callback, time.toSeconds());
    }

}

export const globalScheduler = new PreciseScheduler();

export const {b, s, p} = globalScheduler;

export const useOnGlobalSchedulerStart = callback => {
    useEffect(() => globalScheduler.on("start", callback), []);
}

export const useOnGlobalSchedulerStop = callback => {
    useEffect(() => globalScheduler.on("stop", callback), []);
}