import { Input } from 'antd';
import React, { useCallback, useContext, useState } from 'react';
import ReactFlow, { Background, Controls, MiniMap, ReactFlowProvider } from 'react-flow-renderer';
import { globalAudioGraph } from '../graph/audio';
import { globalBangGraph } from '../graph/bang';
import { FlowGraphContext } from '../graph/flow';
import { edgeTypes } from './edgeTypes';
import { nodeTypes } from './nodeTypes';


const AddNodePopup = ({x, y, dissapear, visible}) => {
    const flowGraph = useContext(FlowGraphContext);
    const popup = <div style={{
        left: x + "px",
        top: y + "px",
        position: "absolute"
        }}>
            <Input placeholder="Add new element..."
                onPressEnter={event => {
                    const type = event.target.value;
                    flowGraph.createNode(type, {x, y});
                    event.target.blur();
                }}
                autoFocus
                onBlur={() => dissapear()} />
        </div>
    return visible ? popup : <></>;
}

export const GraphView = ({props}) => {
    const flowGraph = useContext(FlowGraphContext);
    //const bangGraph = useContext(BangGraphContext); // TODO
    //const audioGraph = useContext(AudioGraphContext); // TODO

    const onConnectHandles = useCallback(({source, sourceHandle, target, targetHandle}) => {
        if(globalAudioGraph.isAudioNode(sourceHandle) && globalAudioGraph.isAudioNode(targetHandle)){
            flowGraph.createEdge(source, sourceHandle, target, targetHandle, "audio");
        } else if (globalBangGraph.isBangNode(sourceHandle) && globalBangGraph.isBangNode(targetHandle)){
            flowGraph.createEdge(source, sourceHandle, target, targetHandle, "bang");
        } else {
            console.log("Can't connect handles ", sourceHandle, "and", targetHandle, "of different types");
        }

    }, [flowGraph]);

    const onElementsRemove = useCallback(elements => {
        elements.map(element => flowGraph.deleteElement(element));
    })

    const onDragOver = useCallback(event => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move"
    }, []);

    const onDrop = useCallback(event => {
        event.preventDefault();
        const {type, data} = JSON.parse(event.dataTransfer.getData("audio-tool/node-preset"));
        const position = flowGraph.reactFlowInstance.project({
            x: event.clientX,
            y: event.clientY
        });

        flowGraph.createNode(type, position, data);
    }, [flowGraph])

    const [{visible, x, y}, setPopupState] = useState({visible: false});
    const onPaneContextMenu = useCallback(event => {
        event.preventDefault();
        event.stopPropagation();
        setPopupState({visible: true, x: event.pageX-20, y: event.pageY-25});
    }, [])

    return <ReactFlowProvider>
                <ReactFlow
                    elements={flowGraph.elements}
                    nodeTypes={nodeTypes}
                    edgeTypes={edgeTypes}
                    onLoad={flowGraph.setReactFlowInstance}
                    onConnect={onConnectHandles}
                    deleteKeyCode={"Delete"}
                    onElementsRemove={onElementsRemove}
                    onDragOver={onDragOver}
                    onDrop={onDrop}
                    onPaneContextMenu={onPaneContextMenu}
                    >
                    <Background variant="dots" gap={24} size={0.5} />
                    <MiniMap />
                    <Controls />
                </ReactFlow>
                <AddNodePopup visible={visible} x={x} y={y} dissapear={() => setPopupState({visible: false})} />
            </ReactFlowProvider>
}