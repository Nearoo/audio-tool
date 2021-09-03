import { useEffect } from 'react';
import { getBezierPath } from 'react-flow-renderer';
import { globalAudioGraph } from './audio';
import { globalBangGraph } from './bang';

const CustomPath = ({sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style, id}) => {
    const d = getBezierPath({sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition});
    return <path {...{d, style, id}} />
}

export const AudioEdge = ({selected, ...props}) => {
    useEffect(() => globalAudioGraph.connectNodes(props.sourceHandleId, props.targetHandleId), []);
    return <CustomPath {...props} style={{strokeWidth: 3, fill: "none", stroke: selected ? "#555" : "#cccc"}} />
    }


export const BangEdge = ({selected, ...props}) => {
    useEffect(() => globalBangGraph.connectNodes(props.sourceHandleId, props.targetHandleId), []);
    return <CustomPath {...props} style={{strokeWidth: 3, fill: "none", stroke: selected ? "#555" : "#cccc"}} />
}