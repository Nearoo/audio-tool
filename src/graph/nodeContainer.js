import { SaveOutlined } from '@ant-design/icons';
import { Badge } from 'antd';
import _ from 'lodash';
import { Component, useCallback, useEffect, useMemo, useState } from 'react';
import { usePreviousCurrentEffect } from '../common/hooks';
import { globalAudioGraph } from './audio';
import { globalBangGraph } from './bang';
import { FlowGraphContext } from './flow';
import { Handle } from './handles';
/** Contains the instances of all nodes, globally */
const globalAllNodes = new Set();
/** Returns list of all nodes as react-flow elements */
export const getAllNodesAsReactFlowElements = () => Array.from(globalAllNodes).map(node => node.getAsReactFlowElement());

/** Returns the node wrapped in the standard node container, with borders, handles, hooks, etc. */
export const insideNodeContainer = (Node, onHandleRemove) => {
    return class extends Component {
        static contextType = FlowGraphContext;
        constructor(props){
            super(props);
            this.id = props.id;
            this.type = props.type;
            this.state = {
                title: "",
                handles: [],
            }
            
        }

        pushHandle = (id, kind, type, position) => {
            const handle = {id, kind, type, position};
            this.setState(state => ({handles: [...state.handles, handle]}));
        }

        pullHandle = id => {
            this.setState(state => ({handles: _.reject(state.handles, {id})}));
            this.context.deleteEdgesConnectedToHandle(id);
        }

        toAudioNodeIdentifier = handleName =>
            `audioHandle(name='${handleName}', node='${this.id}')`;
        
        toBangInputNodeIdentifier = handleName => 
            `bangInputHandle(name='${handleName}', node='${this.id}')`;
        
        toBangOutputNodeIdentifier = handleName => 
            `bangOutputHandle(name='${handleName}', node='${this.id}')`

        addAudioInputHandle = (audioNode, handleName, position="top") => {
            const nodeIdentifier = this.toAudioNodeIdentifier(handleName);
            globalAudioGraph.registerNode(audioNode, nodeIdentifier);
            this.pushHandle(nodeIdentifier, "audio", "target", position);
            return nodeIdentifier;
        }

        removeAudioInputHandle = handleName => {
            const nodeIdentifier = this.toAudioNodeIdentifier(handleName);
            globalAudioGraph.deregisterNode(nodeIdentifier);
            this.pullHandle(nodeIdentifier);
        }

        addAudioOutputHandle = (audioNode, handleName, position="bottom" ) => {
            const nodeIdentifier = this.toAudioNodeIdentifier(handleName);
            globalAudioGraph.registerNode(audioNode, nodeIdentifier);
            this.pushHandle(nodeIdentifier, "audio", "source", position);
            return nodeIdentifier;
        }

        removeAudioOutputHandle = handleName => {
            const nodeIdentifier = this.toAudioNodeIdentifier(handleName);
            globalAudioGraph.deregisterNode(nodeIdentifier);
            this.pullHandle(nodeIdentifier);
        }

        addBangInputHandle = (callback, handleName, position="left") => {
            const nodeIdentifier = this.toBangInputNodeIdentifier(handleName);
            globalBangGraph.registerInputNode(nodeIdentifier, callback);
            this.pushHandle(nodeIdentifier, "bang", "target", position);
            return nodeIdentifier;
        }

        removeBangInputHandle = handleName => {
            const nodeIdentifier = this.toBangInputNodeIdentifier(handleName);
            globalBangGraph.deregisterInputNode(nodeIdentifier);
            this.pullHandle(nodeIdentifier);
        }

        addBangOutputHandle = (handleName, position="right") => {
            const nodeIdentifier = this.toBangOutputNodeIdentifier(handleName);
            const callback = globalBangGraph.registerOutputNode(nodeIdentifier);
            this.pushHandle(nodeIdentifier, "bang", "source", position);
            return [nodeIdentifier, callback];
        }

        removeBangOutputHandle = handleName => {
            const nodeIdentifier = this.toBangInputNodeIdentifier(handleName);
            globalBangGraph.deregisterOutputNode(nodeIdentifier);
            this.pullHandle(nodeIdentifier);
        }

        componentDidMount = () => {
            globalAllNodes.add(this);
        }

        componentWillUnmount = () => {
           globalAllNodes.delete(this);
        }

        getAsReactFlowElement = () => {
            return {
                data: this.getData(),
                id: this.id,
                type: this.type
            };
        }

        render(){
            const node = <Node 
                key={this.id}

                useTitle={title => useEffect(() => this.setState({title}), [title])}

                useData={(initialData, dataId, doClear) => {
                    const data = (this.props.data ?? {})[dataId] ?? initialData;
                    const [r, setR] = useState(false);
                    const forceRerender = () => setR(!r);
                    const setData = dataOrF => {
                        const newData = dataOrF instanceof Function ? dataOrF(data) : dataOrF;
                        this.context.setNodeData(this.id, {...this.props.data, [dataId]: newData});
                        forceRerender();

                    };
                    return [data, setData];
                }}

                useAudioInputHandle={
                    (audioNode, handleName, position) => {
                        useEffect(() => {this.addAudioInputHandle(audioNode, handleName, position);
                            return () => this.removeAudioInputHandle(handleName)}, []);
                    }
                }

                useAudioOutputHandle={
                    (audioNode, handleName, position) => {
                        useEffect(() => {this.addAudioOutputHandle(audioNode, handleName, position);
                            return () => {this.removeAudioOutputHandle(handleName)}}, []);
                    }
                }

                useBangInputHandle={
                    (callback, handleName, position) => {
                        useEffect(() => {this.addBangInputHandle(callback, handleName, position);
                            return () => {this.removeBangInputHandle(handleName)}}, []);
                    }
                }

                useBangOutputHandle={
                    (handleName, position="right") => {
                        const [nodeIdentifier] = useState(() => this.toBangOutputNodeIdentifier(handleName));
                        const [callback] = useState(() => globalBangGraph.registerOutputNode(nodeIdentifier));
                        useEffect(() => {this.pushHandle(nodeIdentifier, "bang", "source", position);
                            return () => globalBangGraph.deregisterOutputNode(nodeIdentifier)}, []);
                        return callback;
                    }
                }

                useBangOutputHandles={
                    (numHandles, handleNamePrefix="bang-handle", position="right") => {
                        // Get identifier for every node
                        const toHandleName = useCallback(i => `${handleNamePrefix}-${i}`, []);
                        const toNodeIdentifier = useCallback(i => this.toBangOutputNodeIdentifier(toHandleName(i)), []);
                        const getNodeIdentifiers = useCallback(numHandles => [...Array(numHandles).keys()].map(i => toNodeIdentifier(i)), []);
                        const callbacks = useMemo(() => getNodeIdentifiers(numHandles).map(identifier => globalBangGraph.getTriggerCallbackForOutputNode(identifier)), [numHandles]);

                        usePreviousCurrentEffect((previousNum, currentNum) => {
                            // Calculate ids of added / removed node identifiers
                            const allNodeIdentifiers = getNodeIdentifiers(Math.max(previousNum, currentNum));
                            const addedNodeIdentifiers = allNodeIdentifiers.slice(previousNum);
                            const removedNodeIdentnfiers = allNodeIdentifiers.slice(currentNum);
                            // Add all new nodeIdentifiers
                            addedNodeIdentifiers.map(nodeIdentifier => {
                                globalBangGraph.registerOutputNode(nodeIdentifier);
                                this.pushHandle(nodeIdentifier, "bang", "source", position)
                            });
                            // Remove all nodeIdentifiers no longer present
                            removedNodeIdentnfiers.map(nodeIdentifier => {
                                globalBangGraph.deregisterOutputNode(nodeIdentifier);
                                this.pullHandle(nodeIdentifier);
                            });
                        }, numHandles, 0);
                        return callbacks;
                    }
                }
                />

            const outerStyle = {
                border: `1px solid ${this.props.selected ? "black" : "lightgrey"}`,
                minWidth: "30px",
                minHeight: "30px",
                fontSize: "smaller",
                borderRadius: "2px",
                boxShadow: "0px 0px 1px lightgrey",
                backgroundColor: "white",
                margin: "10px"
            }

            const titleStyle = {
                backgroundColor: "rgb(235, 235, 235)",
                fontSize: "x-small",
                padding: "2px",
                paddingLeft: "6px",
                minHeight: "7px"
            }

            const contentStyle = {
                padding: "3px",
                cursor: "pointer"
            }

            const minOffset = 40;
            const offsetStep = 22;
            const offsets = {
                left: minOffset,
                right: minOffset
            }
            const getOffsetForHandleOfSide = side => {
                const offset = offsets[side];
                offsets[side] += offsetStep;
                return `${offset}px`;
            }
            
            return <div style={outerStyle} key={this.id}>
                {this.state.handles.map(props => <Handle {...props} key={props.id} parentId={this.id} style={{top: getOffsetForHandleOfSide(props.position)}} />)}
                <div style={titleStyle}>{this.state.title}</div>
                <div style={contentStyle} className="nodrag">{node}</div>
            </div>
        }
    }
}