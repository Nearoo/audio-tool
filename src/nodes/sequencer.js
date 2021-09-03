import { useCallback, useEffect, useState } from "react";
import { b } from '../scheduler/scheduler';
import { StepSequencer } from "../scheduler/sequencers";

const TogglableBox = ({isToggled, toggle}) =>
    <div style={{
        width: 20,
        height: 20,
        backgroundColor: isToggled ? "#555"  : "#bbb",
        margin: 2,
        padding: 0,
        display: "inline-block",
        borderRadius: "1px"
    }} 
    onClick={toggle}/>


export const Sequencer = ({useData, useBangInputHandle, useBangOutputHandle}) => {
    const length = 8;

    const outBangCallback = useBangOutputHandle("sequencer-out");
    const [stepSeq] = useState(() => new StepSequencer((time, v, i) => v ? outBangCallback(time) : null, b("0:0:2")));
    useBangInputHandle((time) => stepSeq.start(time), "sequencer-start");

    const [data, setData] = useData({toggles: Array(length).fill(false)});
    const toggleIth = useCallback(i => setData(data => ({toggles: data.toggles.map((v, j) => i == j ? !v : v)})), []);
    useEffect(() => stepSeq.setValues(data.toggles), [data.toggles]);

    return data.toggles.map((v, i) => <TogglableBox isToggled={v} toggle={() => toggleIth(i)} key={i}/>)

}