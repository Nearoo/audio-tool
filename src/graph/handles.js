import { useEffect, useState, useCallback, useMemo } from 'react';
import { Handle as FlowHandle, useUpdateNodeInternals } from 'react-flow-renderer';

import { globalBangGraph } from './bang';

const BaseHandle = props =>{
    return <FlowHandle {...props} style={{...props.style, width: 20, height: 20, zIndex: -1, ...props.style}} />
}

const posToBorderRadius = {
    top: "100% 100% 0 0",
    left: "100% 0 0 100%",
    right: "0 100% 100% 0",
    bottom: "0 0 100% 100%"
}
const AudioHandle = (props) => 
    <BaseHandle {...props} style={{borderRadius: posToBorderRadius[props.position], backgroundColor: "lightblue"}} />


const SourceBangHandle = (props) => {
    const [isBanging, setBanging] = useState(false);
    const bang = useCallback((time) => time.scheduleDraw(() => {setBanging(true); setTimeout(() => setBanging(false), 100)}), []);
    const bangReciverNodeId = useMemo(() =>  `bangReceiverForHandleFlashing(${props.id})`, []);

    useEffect(() => {globalBangGraph.registerInputNode(bangReciverNodeId, bang);
        return () => globalBangGraph.deregisterInputNode(bangReciverNodeId)}, []);
    useEffect(() => {globalBangGraph.connectNodes(props.id, bangReciverNodeId);
        return () => globalBangGraph.disconnectNodes(props.id, bangReciverNodeId)}, [])
    return <BaseHandle {...props} style={{borderRadius: 0, backgroundColor: isBanging ? "orange" : "grey", border: 0, ...props.style}} />
}

const TargetBangHandle = (props) => {
    return <BaseHandle {...props} style={{borderRadius: 0, backgroundColor: "lightgrey", border: 0, ...props.style}} />
}

const BangHandle = (props) => {
    if(props.type === "source")
        return <SourceBangHandle {...props} />
    else
        return <TargetBangHandle {...props} />
}

    

const handleKinds = {
    audio: AudioHandle,
    bang: BangHandle
}

/** Returns a handle from handleKinds according to "kind" prop. Pass parentId if handle is created dynamically. */
export const Handle = ({kind, parentId, ...props}) => {

    // Required to make react-flow update internal state on dynamic handle creation
    const updateNodeInternals = useUpdateNodeInternals();
    useEffect(() => updateNodeInternals(parentId), [props.style]);

    if(!(kind in handleKinds)){
        throw `Unknown handle kind ${kind}`
    } else {
        const SelectedHandle = handleKinds[kind];
        return <SelectedHandle {...props} />
    }
}

