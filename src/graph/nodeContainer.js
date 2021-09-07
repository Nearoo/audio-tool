import { Card } from 'antd';
import { Component, createRef, useEffect, useState } from 'react';
import _ from 'lodash';
import { Handle } from './handles';
import { globalAudioGraph } from './audio';
import { globalBangGraph } from './bang';
import { thisExpression } from '@babel/types';
/** Contains the instances of all nodes, globally */
const globalAllNodes = new Set();
/** Returns list of all nodes as react-flow elements */
export const getAllNodesAsReactFlowElements = () => Array.from(globalAllNodes).map(node => node.getAsReactFlowElement());

/** Returns the node wrapped in the standard node container, with borders, handles etc. */
export const insideNodeContainer = ({Node}) => {
    return class extends Component {
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
            this.data = {};
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
                useData={(initialData, doClear) => {
                    // Returns an unique id for every callsite (not starting at 0, but unique anyway).
                    const [callSiteId] = useState(() => {
                        return this.useDataCallsiteIdCounter++;
                    });

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
                
                addBangOutputHandle={this.addBangOutHandle}/>;
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
            return <div style={outerStyle} key={this.id}>
                {this.state.handles.map(props => <Handle {...props} key={props.id} parentId={this.id} />)}
                <div style={titleStyle}>{this.state.title}</div>
                <div style={contentStyle} className="nodrag">{this.nodeComponent}</div>
            </div>
        }
    }
}