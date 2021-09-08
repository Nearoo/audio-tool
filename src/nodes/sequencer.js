import { useCallback, useEffect, useState } from "react";
import { TickSignal } from "tone/build/esm/core/clock/TickSignal";
import { b, globalScheduler, useOnGlobalSchedulerStop } from '../scheduler/scheduler';
import { StepSequencer, Transport } from "../scheduler/sequencers";
import _ from 'lodash';

const TogglableBox = ({isToggled, toggle, isActive}) =>
    <div style={{
        width: 20,
        height: 20,
        border: `4px solid ${isActive ? "orange" : "transparent"}`,
        backgroundColor: isToggled ? "#555"  : "#bbb",
        margin: 2,
        padding: 0,
        display: "inline-block",
        borderRadius: "1px"
    }} 
    onClick={toggle}/>



export const Sequencer = ({useData, useBangInputHandle, useBangOutputHandle, useBangOutputHandles}) => {

    const [noCols, setNoCols] = useData(16, "no-cols");
    const [noRows, setNoRows] = useData(4, "no-rows");
    // bangGrid[col][row]
    const [bangGrid, setBangGrid] = useData(
        Array(noCols).fill().map(() => Array(noRows).fill(false)), "bang-grid", true
    )

    const flipRowCol = (rowI, colI) =>
        setBangGrid(grid => grid.map((col, colI_) => colI_ !== colI ? col : col.map((row, rowI_) => rowI_ !== rowI ? row : !row))); 
    const [stepCursor, setStepCursor] = useState(-1);
    const bangOutCallbacks = useBangOutputHandles(bangGrid[0].map((row, rowi) => `bang-out-${rowi}`));

    const [stepSeq] = useState(() => new StepSequencer((time, v, i) =>{
        v.map((value, row) => {
            if(value)
                bangOutCallbacks[row](time);
        });
        time.scheduleDraw(() => setStepCursor(i));
    }, b("0:0:1")));

    useBangInputHandle((time) => stepSeq.start(time), "sequencer-start");
    useEffect(() => stepSeq.setValues(bangGrid), [bangGrid]);

    useOnGlobalSchedulerStop(() => setStepCursor(-1));
    const bangGridT = _.zip(...bangGrid);
    return bangGridT.map((row, rowI) =>
                        <div key={rowI}>
                            {row.map((value, colI) =>
                                <TogglableBox isToggled={value} toggle={() => flipRowCol(rowI, colI)} key={colI} isActive={stepCursor===colI}/>
                                )}
                        </div>)

}