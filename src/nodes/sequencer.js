import { Checkbox, Space } from "antd";
import _ from 'lodash';
import { useCallback, useEffect, useState } from "react";
import { NumberInputer } from "../gui/gui";
import { b, useOnGlobalSchedulerStop } from '../scheduler/scheduler';
import { StepSequencer } from "../scheduler/sequencers";

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



export const Sequencer = ({useData, useBangInputHandle, useBangOutputHandles, useTitle}) => {
    useTitle("Sequencer");

    const [noCols, setNoCols] = useData(16, "no-cols");
    const [noRows, setNoRows] = useData(2, "no-rows");
    // bangGrid[col][row]
    const [bangGrid, setBangGrid] = useData(
        Array(noCols).fill().map(() => Array(noRows).fill(false)), "bang-grid"
    )

    useEffect(() => {
        setBangGrid(bangGrid => {
            const currentCols = bangGrid.length;
            const currentRows = bangGrid[0].length;
            let newBangGrid = [...bangGrid];
            if(currentCols < noCols){
                const newCols = Array(noCols-currentCols).fill().map(() => Array(currentRows).fill(false));
                newBangGrid = [...bangGrid, ...newCols];
            } else if (currentCols > noCols){
                newBangGrid = newBangGrid.slice(0, noCols);
            }

            if(currentRows < noRows){
                newBangGrid = newBangGrid.map(col => {
                    const newRows = Array(noRows - currentRows).fill(false);
                    return [...col, ...newRows];
                })
            } else if (currentRows > noRows){
                newBangGrid = newBangGrid.map(col => {
                    return col.slice(0, noRows);
                })

            }
            return newBangGrid;

        })
    }, [noCols, noRows])

    const flipRowCol = (rowI, colI) =>
        setBangGrid(grid => grid.map((col, colI_) => colI_ !== colI ? col : col.map((row, rowI_) => rowI_ !== rowI ? row : !row))); 
    const [stepCursor, setStepCursor] = useState(-1);
    const bangOutCallbacks = useBangOutputHandles(noRows, "seq-out");

    const [stepSeq] = useState(() => new StepSequencer((() => {}), b("0:0:1")));
    const stepSeqCallback = useCallback((time, col, i) => {
        col.map((value, row) => {
            if(value)
                bangOutCallbacks[row](time);
        });
        time.scheduleDraw(() => setStepCursor(i));
    }, [bangOutCallbacks]);

    useBangInputHandle((time) => stepSeq.start(time), "sequencer-start");
    useEffect(() => stepSeq.setValues(bangGrid), [bangGrid]);
    useEffect(() => stepSeq.setCallback(stepSeqCallback), [stepSeqCallback]);

    const [doLoop, setDoLoop] = useData(true, "do-loop");
    useEffect(() => stepSeq.setDoLoop(doLoop), [doLoop]);

    useOnGlobalSchedulerStop(() => setStepCursor(-1));
    const bangGridT = _.zip(...bangGrid);
    return <>
            <Space direction="horizontal" style={{paddingLeft: 2}}>
                <NumberInputer defaultValue={noRows} onChange={v => setNoRows(v)} /> x
                <NumberInputer defaultValue={noCols} onChange={v => setNoCols(v)} />
                <Checkbox checked={doLoop} onChange={e => setDoLoop(e.target.checked)}/>Loop
            </Space>
            {bangGridT.map((row, rowI) =>
                        <div key={rowI}>
                            {row.map((value, colI) =>
                                <TogglableBox isToggled={value} toggle={() => flipRowCol(rowI, colI)} key={colI} isActive={stepCursor===colI}/>
                                )}
                        </div>)
            }
            </>

}