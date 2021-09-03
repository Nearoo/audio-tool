import { globalScheduler, s } from "./scheduler";
export class RepeatedCallback{
    constructor(callback, interval){
        this.callback = callback;
        this.interval = interval;

        this.runUntil = s(0);
    }

    isRunning = () => {
        return globalScheduler.now().isBefore(this.runUntil);
    }

    runningCallback = time => {
        if(time.isBefore(this.runUntil)){
            this.callback(time);
            time.scheduleLater(this.runningCallback, this.interval);
        }
    }

    start = time => {
        if(!this.isRunning()){
            time.schedule(this.runningCallback);
            this.runUntil = s(Number.POSITIVE_INFINITY);
        }
    }

    stop = time => {
        this.runUntil = time;

        /*  
        Note:
        How can we schedule stop and start in the future?
        Might need to have some state associated with each "run".
        Might need to add priority to events: "stop" sequencer should always be _after_ trigger notes.

        Might add data to scheduled callbacks! And allow change of data of future callbacks in scheduler.
        Then, each callback passes "stop time" to next callback.
        Calling "stop" will set data of next callback.

        runningCallback = time, stoptime => if time.isBefore(stoptime): time.callback(time, stoptime);
                                                                        time.scheduleLater(this.runningCallback, this.interval, stoptime);
        stop = time => globalScheduler.changeCallbackData(this.lastScheduledEventId, time);
        start = time => time.schedule(this.runningCallback, never);

        This would enable to stop / start scheduling. It would only allow each "stop" to be stopped ONCE though.

        What if we hade multiple "stop" events. Then each callback would now that it should stop iff its last event was before, and this after/at a stop event. 
        But then we need to know if an event is the "first" event, and when is not. Might pass again the "lastScheduledTime" as an argument from event to event. 

        This would be the most intuitive approach. Documentation
        * start and stop repeated callbacks.
        * scheduling start at the time the repeated callback is already running is equivalent to calling stop and start at this time.
        * calling stop and start with the same time will behave as though first stop, then start was called, irrespective of actual order, i.e. it will always restart.
        */
    }

    setCallback = callback => {
        this.callback = callback;
    }
}


export class StepSequencer {
    constructor(callback, interval, values){
        this.repeatedCallback = new RepeatedCallback(this.runningCallback, interval);
        this.values = values
        this.callback = callback

        this.currentIndex = 0;
        globalScheduler.on("stop", () => this.currentIndex=0);
    }

    runningCallback = (t) => {
        this.callback(t, this.values[this.currentIndex], this.currentIndex);
        this.currentIndex += 1;
        this.currentIndex %= this.values.length;
    }

    setValues = values => {
        this.values = values;
    }

    start = time => {
        this.repeatedCallback.start(time);
    }

    stop = time => {
        this.currentIndex = 0;
        this.repeatedCallback.stop(time);
    }

    pause = time => {
        this.repeatedCallback.stop(time);
    }
    

    
}
