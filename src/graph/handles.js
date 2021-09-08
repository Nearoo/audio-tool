import { Component, useEffect } from 'react';
import { Handle as FlowHandle, useUpdateNodeInternals, updateNo } from 'react-flow-renderer';

const BaseHandle = props =>{
    return <FlowHandle {...props} style={{...props.style, width: 15, height: 15, ...props.style}} />
}
    
const AudioHandle = (props) => 
    <BaseHandle {...props} style={{borderRadius: "100%", backgroundColor: "orange"}} />

const BangHandle = (props) => 
    <BaseHandle {...props} style={{borderRadius: 0, backgroundColor: "grey", border: 0, ...props.style}} />

const handleKinds = {
    audio: AudioHandle,
    bang: BangHandle
}

/** Returns a handle from handleKinds according to "kind" prop. Pass parentId if handle is created dynamically. */
export const Handle = ({kind, parentId, ...props}) => {

    // Required to make react-flow update internal state on dynamic handle creation
    const updateNodeInternals = useUpdateNodeInternals();
    useEffect(() => updateNodeInternals(parentId), []);

    if(!(kind in handleKinds)){
        throw `Unknown handle kind ${kind}`
    } else {
        const SelectedHandle = handleKinds[kind];
        return <SelectedHandle {...props} />
    }
}

