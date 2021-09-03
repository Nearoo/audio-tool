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
        }

        createUniqueId = () => {
            this._idCounter = (this._idCounter ?? -1) + 1;
            return this._idCounter;
        }

        pushHandle = (id, kind, type, position) => {
            const handle = {id, kind, type, position};
            this.setState(state => ({handles: [...state.handles, handle]}));
        }

        getData = () => {
            return this.data;
        }

        registerAudioNode = (node, handleName) => {
            const nodeIdentifier = `audioNode(${this.id}//${handleName})`;
            globalAudioGraph.registerNode(node, nodeIdentifier);
            return nodeIdentifier;
        }

        addAudioInputHandle = (audioNode, handleName, position="top") => {
            const nodeIdentifier = this.registerAudioNode(audioNode, handleName);
            this.pushHandle(nodeIdentifier, "audio", "target", position);
        }

        addAudioOutputHandle = (audioNode, handleName, position="bottom" ) => {
            const nodeIdentifier = this.registerAudioNode(audioNode, handleName);
            this.pushHandle(nodeIdentifier, "audio", "source", position);
        }

        registerBangInputNode = (callback, handleName) => {
            const nodeIdentifier = `bangInputNode(${this.id}//${handleName})`;
            globalBangGraph.registerInputNode(nodeIdentifier, callback);
            return nodeIdentifier;
        }

        addBangInputHandle = (callback, handleName, position="left") => {
            const nodeIdentifier = this.registerBangInputNode(callback, handleName);
            this.pushHandle(nodeIdentifier, "bang", "target", position);
        }

        registerBangOutputNode = (handleName) => {
            const nodeIdentifier = `bangOutputNode(${this.id}//${handleName})`;
            const callback = globalBangGraph.registerOutputNode(nodeIdentifier);
            return [nodeIdentifier, callback];
        }

        addBangOutputHandle = (handleName, position="right") => {
            const [nodeIdentifier, callback] = this.registerBangOutputNode(handleName);
            this.pushHandle(nodeIdentifier, "bang", "source", position);
            return callback;
        }

        componentDidMount = () => {
            globalAllNodes.add(this);
            this.data = []
            this.nodeComponent = <Node 
                useTitle={title => useEffect(() => this.setState({title}), [title])}
                useData={(data, doClear) => {
                    const [state, setState] = useState(() => {
                        // TODO: Allow multiple useData callsites
                        if(this.props.data != undefined && !doClear){
                            this.data = this.props.data;
                        } else {
                            this.data = data;
                        }

                        return this.data;
                    })

                    const setData = data => {
                        if(data instanceof Function){
                            this.data = data(this.data);
                        } else
                            this.data = this.data;

                        setState(data);
                    }

                    return [state, setData];
                }}

                useAudioInputHandle={
                    (audioNode, handleName, position) => {
                        useEffect(() => this.addAudioInputHandle(audioNode, handleName, position), [])
                    }
                }

                useAudioOutputHandle={
                    (audioNode, handleName, position) => {
                        useEffect(() => this.addAudioOutputHandle(audioNode, handleName, position), [])
                    }
                }

                useBangInputHandle={
                    (callback, handleName, position) => {
                        useEffect(() => this.addBangInputHandle(callback, handleName, position), [])
                    }
                }

                useBangOutputHandle={
                    (handleName, position="right") => {
                        const [[nodeIdentifier, callback]] = useState(() => this.registerBangOutputNode(handleName));
                        // setState must be encapsulated in useEffect, that's why it's separated out
                        useEffect(() => this.pushHandle(nodeIdentifier, "bang", "source", position), []);
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
            return <div className="node-card" key={this.id}>
                {this.state.handles.map(props => <Handle {...props} key={props.id} parentId={this.id} />)}
                <div className="title">{this.state.title}</div>
                <div className="content nodrag">{this.nodeComponent}</div>
            </div>
        }
    }
}