/**
 * Stores the "time resolution" in terms of pulses per second.
 * Stored in two fields:
 * * bpm: beats per minute
 * * ppb: pulses per beat
 */
export class TimeResolution{
    constructor(bpm, ppb){
        this.bpm = bpm;
        this.ppb = ppb;

        this.pulsePerSecond = ppb*bpm/60;
        this.secondPerPulse = 1/this.pulsePerSecond;
    }
}

/** 
 * Utility class to convert to & from different time formats,
 * as well as comibining and comparing different times.
 * 
 * All combination and comparison operations assume the same TimeResultion.
 * 
 * Stores time in terms of pulses, hence requires TimeResolution as an argument.
*/
export class Time {
    constructor(pulse, res){
        this.pulse = pulse;
        this.res = res;
    }

    static fromSeconds = (seconds, res) => {
        const remainder = seconds % res.secondPerPulse;
        const pulse = Math.floor(seconds * res.pulsePerSecond) + (remainder ? 1 : 0)
        return new Time(pulse, res);
    }

    toSeconds = () => {
        return this.pulse/this.res.pulsePerSecond;
    }

    static fromPulse = (pulse, res) => {
        return new Time(pulse, res);
    }

    toPulse = () => {
        return this.pulse;
    }

    static fromBarNotation = (notation, res) => {
        let pulse = 0;
        notation.split(":").forEach((v, i) =>{
            const pulserPerPart = Math.floor(res.ppb*4/(1<<(i*2)));
            pulse += Number(v)*pulserPerPart;
        });
        return new Time(pulse, res);
    }

    add = time => {
        return new Time(this.pulse + time.pulse, this.res);
    }

    subtract = time => {
        return new Time(this.pulse - time.pulse, this.res);
    }

    multiply = factor => {
        return new Time(this.pulse * factor, this.res);
    }

    isBefore = time => {
        return this.toSeconds() < time.toSeconds();
    }

    isAfter = time => {
        return this.toSeconds() > time.toSeconds();
    }

        
    isOnOrBefore = time => {
        return !this.isAfter(time);
    }

    isOnOrAfter = time => {
        return !this.isBefore(time);
    }

    isNever = () => {
        return this.pulse === Number.POSITIVE_INFINITY;
    }
}

/**
 * Takes a scheduler instead of a TimeResolution as an argument,
 * from which time resolution is then taken.
 * 
 * Also allows scheduling of events on the scheduler for a schduler-time t using
 * * t.schedule(callback, data); and
 * * t.schedulerLater(callback, data, deltaTime);
 */
export class SchedulerTime extends Time {
    constructor(pulse, scheduler){
        super(pulse, scheduler.getResolution());
        this.scheduler = scheduler;
    }

    static fromTime = (time, scheduler) => {
        return new SchedulerTime(time.toPulse(), scheduler);
    }

    static fromSeconds = (seconds, scheduler) => {
        const time = Time.fromSeconds(seconds, scheduler.getResolution());
        return SchedulerTime.fromTime(time, scheduler);
    }

    static fromBarNotation = (notation, scheduler) => {
        const time = Time.fromBarNotation(notation, scheduler.getResolution());
        return SchedulerTime.fromTime(time, scheduler);
    }

    static fromPulse = (pulse, scheduler) =>{
        const time = Time.fromPulse(pulse, scheduler.getResolution());
        return SchedulerTime.fromTime(time, scheduler);
    }

    schedule = (callback, data) => {
        return this.scheduler.schedule(callback, this, data);
    }

    scheduleLater = (callback, time, data) => {
        return this.add(time).schedule(callback, data);
    }

    scheduleDraw = callback => {
        this.scheduler.scheduleDraw(callback, this);
    }

    // To-Do: Implement s.t. we don't need to rewrite add & multiply
    add = time => {
        return new SchedulerTime(this.pulse + time.pulse, this.scheduler);
    }

    multiply = factor => {
        return new SchedulerTime(this.pulse * factor, this.scheduler);
    }

    subtract = time => {
        return new SchedulerTime(this.pulse - time.pulse, this.scheduler);
    }

    mod = time => {
        return new SchedulerTime(this.pulse % time.pulse, this.scheduler);
    }

    toString = () => {
        if(this.pulse === Number.POSITIVE_INFINITY)
            return "time(Infinity)";
        else
            return `time(pulse=${this.pulse})`;
    }

    justBefore = () => {
        return new SchedulerTime(this.pulse-1, this.scheduler);
    }

    justAfter = () => {
        return new SchedulerTime(this.pulse+1, this.scheduler);
    }

}