import { SaveOutlined } from '@ant-design/icons';
import { Badge } from 'antd';
import _ from 'lodash';
import { Component, useEffect, useMemo, useState } from 'react';
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
            
            // Used to assign unique ids to every useData callsite
            this.useDataCallsiteIdCounter = 0;
            // this.data[callsiteId] = data for that useData at callsite callsiteId
            this.data = this.props.data ?? {};
        }

        createUniqueId = () => {
            this._idCounter = (this._idCounter ?? -1) + 1;
            return this._idCounter;
        }

        pushHandle = (id, kind, type, position) => {
            const handle = {id, kind, type, position};
            this.setState(state => ({handles: [...state.handles, handle]}));
        }

        pullHandle = id => {
            this.setState(state => ({handles: _.reject(state.handles, {id})}));
            this.context.deleteEdgesConnectedToHandle(id);
        }

        getData = () => {
            return this.data;
        }

        toAudioNodeIdentifier = handleName =>
            `audioNode(${this.id}//${handleName})`;
        
        toBangInputNodeIdentifier = handleName => 
            `bangInputNode(${this.id}//${handleName})`;
        
        toBangOutputNodeIdentifier = handleName => 
            `bangOutputNode(${this.id}//${handleName})`

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
            this.nodeComponent = <Node 
                useTitle={title => useEffect(() => this.setState({title}), [title])}
                useData={(initialData, dataId, doClear) => {
                    // Returns an unique id for every callsite (not starting at 0, but unique anyway).
                    const [callSiteId] = useState(() => (dataId === undefined) ? this.useDataCallsiteIdCounter++ : dataId);

                    // state = the saved data, if it exists, or the initial data
                    const [state, setState] = useState(() => {
                        const alreadyStored = callSiteId in (this.props.data ?? {}) && !doClear;
                        return alreadyStored ? this.props.data[callSiteId] : initialData;
                    });

                    // Set this.data the first time
                    useEffect(() => {this.data[callSiteId] = state}, []);

                    // setData performs both this.data = data and setState(data)
                    const setData = data => {
                        // Set this.data
                        if(data instanceof Function){
                            this.data[callSiteId] = data(this.data[callSiteId]);
                        } else {
                            this.data[callSiteId] = data;
                        }
                        setState(data);
                    }

                    return [state, setData];
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
                        const handleNames = useMemo(() => [...Array(numHandles).keys()].map(i => `${handleNamePrefix}-${i}`), [numHandles]);
                        const nodeIdentifiers = useMemo(() => handleNames.map(handleName => this.toBangOutputNodeIdentifier(handleName)), [handleNames]);
                        const callbacks = useMemo(() => nodeIdentifiers.map(identifier => globalBangGraph.getTriggerCallbackForOutputNode(identifier)), [nodeIdentifiers]);
                        useEffect(() => {
                            nodeIdentifiers.map(identifier => globalBangGraph.registerOutputNode(identifier));
                            nodeIdentifiers.map(nodeIdentifier => this.pushHandle(nodeIdentifier, "bang", "source", position));
                            return () => {
                                nodeIdentifiers.map(nodeIdentifier => globalBangGraph.deregisterOutputNode(nodeIdentifier));
                                nodeIdentifiers.map(nodeIdentifier => this.pullHandle(nodeIdentifier))}}, [nodeIdentifiers]);
                        return callbacks;
                    }
                }
                />
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
            const outerStyle = {
                border: `1px solid ${this.props.selected ? "black" : "lightgrey"}`,
                minWidth: "30px",
                minHeight: "30px",
                fontSize: "smaller",
                borderRadius: "2px",
                boxShadow: "0px 0px 1px lightgrey",
                backgroundColor: "white",
                margin: "4px"
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

            const savePresetBadge = <span style={{paddingLeft: 5}}><Badge count={<SaveOutlined />} onClick={() => console.log(this.data)}/></span>

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
                <div style={titleStyle}>{this.state.title}{savePresetBadge}</div>
                <div style={contentStyle} className="nodrag">{this.nodeComponent}</div>
            </div>
        }
    }
}