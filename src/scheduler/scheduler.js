import { cyanBright } from 'chalk';
import { toPlainObject } from 'lodash';
import PriorityQueue from 'priorityqueuejs';
import { useEffect, useState } from 'react';
import * as Tone from 'tone';
import { Emitter } from 'tone';
import { assert } from 'tone/build/esm/core/util/Debug';



/*
All time is always in pulse.

Events are stored as {eventId: callback} in eventRegister.
The eventQueue only stores object of the form {pulse, eventId},
and retreives the callback when the event is dispatched.

This is to simplify rapid callback change for an event id
that is usual for react components.
*/


export class Time {
    constructor(pulse, scheduler){
        this.pulse = pulse;
        this.scheduler = scheduler;
    }

    static fromSeconds = (seconds, scheduler) => {
        const {ppb, bpm} = scheduler;
        const pulsePerSecond = ppb*bpm/60;
        const secondPerPulse = 1/pulsePerSecond;

        const remainder = seconds % secondPerPulse;
        const pulse = Math.floor(seconds*pulsePerSecond) + (remainder ? 1 : 0)
        return new Time(pulse, scheduler);
    }

    toSeconds = () => {
        const {ppb, bpm} = this.scheduler;
        const pulsePerSecond = ppb*bpm/60;
        return this.pulse/pulsePerSecond;
    }

    static fromPulse = (pulse, scheduler) => {
        return new Time(pulse, scheduler);
    }

    toPulse = () => {
        return this.pulse;
    }

    static fromBarNotation = (notation, scheduler) => {
        let pulse = 0;
        notation.split(":").forEach((v, i) =>{
            const pulserPerPart = Math.floor(scheduler.ppb*4/(1<<(i*2)));
            pulse += Number(v)*pulserPerPart;
        });
        return new Time(pulse, scheduler);
    }

    add = time => {
        return new Time(this.pulse + time.pulse, this.scheduler);
    }

    multiply = factor => {
        return new Time(this.pulse * factor, this.scheduler);
    }

    schedule = callback => {
        return this.scheduler.schedule(callback, this);
    }

    scheduleLater = (callback, time) => {
        return this.add(time).schedule(callback);
    }

    isBefore = time => {
        return this.toSeconds() < time.toSeconds();
    }

    isAfter = time => {
        return this.toSeconds() > time.toSeconds();
    }


}

export class DynamicTransport extends Emitter{
    constructor({
        ppb = 64, // pulse per beat, i.e. time resolution
        bpm = 120, // beats per minute, i.e. speed
        lookAhead = 12, // ms to schedule in advance
    }={} ){
        super();
        // Event: {time, evenId}
        this.eventQueue = new PriorityQueue((ev1, ev2) => ev2.time.toPulse() - ev1.time.toPulse());
        this.bpm = bpm
        this.ppb = ppb

        this.pulsePerSecond = this.ppb*this.bpm/60;
        this.secondPerPulse = 1/this.pulsePerSecond;
        this.dispatchTimeoutID = null;

        this.p = pulse => Time.fromPulse(pulse, this)
        this.s = seconds => Time.fromSeconds(seconds, this)
        this.b = barNot => Time.fromBarNotation(barNot, this)


        this.callbackRegister = {}
        this.lastScheduledEventId = 0

        this.doStop = false;
        this.lastDispatchPulse = 0;
        this.transportStartTime = 0;

        this.lookAhead = lookAhead;
        this.lookAheadPulse = this.s(this.lookAhead*0.001).toPulse();
    }

    isRunning = () => {
        return !this.doStop;
    }

    getNewEventId = () => {
        this.lastScheduledEventId += 1;
        return this.lastScheduledEventId;
    }

    _rescheduleDispatch = () => {
        clearTimeout(this.dispatchTimeoutID);
        if(!this.doStop)
            this.dispatchTimeoutID = setTimeout(this.dispatch, this.lookAhead-1);
        else
            this.dispatchTimeoutID = null;
    }

    clear = () =>{
        while(!this.eventQueue.isEmpty()) this.eventQueue.deq();
    }

    stop = () => {
        this.doStop = true;
        this.clear();
        this.lastDispatchPulse = 0;
        this.emit("stop");
    }

    start = () => {
        this.doStop = false;
        this.emit("start");
        this.dispatch();
    }

    dispatch = () =>{
        const now = this.s(Tone.getContext().now())
        while(
            !this.doStop &&
            !this.eventQueue.isEmpty() && 
            this.eventQueue.peek().time.toPulse() < now.toPulse() + this.lookAheadPulse
            ){
                const {time, eventId} = this.eventQueue.deq();
                const schedTime = time.toSeconds() < now.toSeconds() ? now : time;
                const callback = this.callbackRegister[eventId];
                console.debug(`[${now.toSeconds()}, ${now.toPulse()}] Dispatching event with id ${eventId} scheduled for pulse [${schedTime.toPulse()}]`)
                callback(schedTime);
                delete this.callbackRegister[eventId];
        }
        this._rescheduleDispatch();
    }

    schedule = (callback, t) =>{
        assert(t instanceof Time, "Scheduling time must be Time object.");
        const eventId = this.getNewEventId();
        this.eventQueue.enq({time: t, eventId});
        this.callbackRegister[eventId] = callback;
        console.debug(`Scheduled event with id ${eventId} at pulse  ${t.toPulse()}`)
        return eventId;
    }

    unschedule = eventId => {
        // TODO: Remove event from eventQueue. Extend eventQueue with del.
        this.callbackRegister[eventId] = () => {};
    }

    replaceScheduledCallback = (callback, id) => {
        if(id in this.callbackRegister)
            this.callbackRegister[id] = callback;
        else
            console.warn("Attempted replacing callback for inexistend event with id", id);
    }

    now = () => {
        return this.s(Tone.getContext().now());
    }

    scheduleDraw = (callback, time) => {
        Tone.Draw.schedule(callback, time.toSeconds());
    }

}

export const globalScheduler = new DynamicTransport();

export const p = pulse => Time.fromPulse(pulse, globalScheduler),
             s = seconds => Time.fromSeconds(seconds, globalScheduler),
             b = barNot => Time.fromBarNotation(barNot, globalScheduler)

export const useOnGlobalSchedulerStart = callback => {
    useEffect(() => globalScheduler.on("start", callback), []);
}

export const useOnGlobalSchedulerStop = callback => {
    useEffect(() => globalScheduler.on("stop", callback), []);
}