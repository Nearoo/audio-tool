import { useEffect, useState } from 'react';
import { getBezierPath } from 'react-flow-renderer';
import { globalScheduler } from '../scheduler/scheduler';
import { globalAudioGraph } from './audio';
import { globalBangGraph } from './bang';


const CustomPath = ({sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style, id}) => {
    const d = getBezierPath({sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition});
    return <path {...{d, style, id}} />
}

export const AudioEdge = ({selected, ...props}) => {
    useEffect(() => {globalAudioGraph.connectNodes(props.sourceHandleId, props.targetHandleId);
        return () => globalAudioGraph.disconnectNodes(props.sourceHandleId, props.targetHandleId)}, []);
    return <CustomPath {...props} style={{strokeWidth: 3, fill: "none", stroke: selected ? "#555" : "#cccc"}} />
    }


export const BangEdge = ({selected, ...props}) => {
    // Connect input & output
    useEffect(() => {globalBangGraph.connectNodes(props.sourceHandleId, props.targetHandleId);
            return () => globalBangGraph.disconnectNodes(props.sourceHandleId, props.targetHandleId)}, []);

    // make edge flash on bang
    const [flash, setFlash] = useState(false);
    const doFlash = (time) => globalScheduler.scheduleDraw(() => {setFlash(true); setTimeout(() => setFlash(false), 100)}, time);
    const edgeIdentifier = `edge(${props.sourceHandleId}-${props.targetHandleId})`;
    useEffect(() => {globalBangGraph.registerInputNode(edgeIdentifier, doFlash);
        return () => globalBangGraph.deregisterInputNode(edgeIdentifier)}, []);
    useEffect(() => {globalBangGraph.connectNodes(props.sourceHandleId, edgeIdentifier);
        return () => globalBangGraph.disconnectNodes(props.sourceHandleId, edgeIdentifier)}, [])
    const color = flash ? "orange" : (selected ? "#555" : "#ccc");
    
    return <CustomPath {...props} style={{strokeWidth: 3, fill: "none", stroke: color}} />
}