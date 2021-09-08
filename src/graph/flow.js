import _ from 'lodash';
import React, { Component } from 'react';

export const FlowGraphContext = React.createContext({});

export class FlowGraphProvider extends Component {
    localStorageKey = "graph";

    constructor(props){
        super(props);
        this.state = {
            elements: [],
            setElements: elements => this.setState({elements}),

            reactFlowInstance: null,
            setReactFlowInstance: reactFlowInstance => this.setState({reactFlowInstance}),

            createNode: this.createNode,
            setNodeData: this.setNodeData,
            getNodeData: this.getNodeData,
            createEdge: this.createEdge,
            deleteElement: this.pullElement,
            deleteEdgesConnectedToHandle: this.deleteEdgesConnectedToHandle
        }
    }

    createUniqueId = () => {
        return this.state.elements.length + 1;
    }

    pushElement = element => {
        this.setState(state => ({elements: [...state.elements, element]}));
    }

    pullElement = element => {
        this.pullElementById(element.id);
    }

    pullElementById = id => {
        this.setState(state => ({elements: _.reject(state.elements, {id})}));
    }

    pullElementByPredicate = pred => {
        this.setState(state => ({elements: _.filter(state.elements, el => !pred(el))}));
    }

    replaceElementById = (id, element) => {
        this.setState(state => ({elements: state.elements.map(element_ => element_.id === id ? element : element_)}));
    }

    getElementById = id => {
        return this.state.elements.find(element => element.id === id);
    }

    createNode = (type, position, data={}) => {
        const id = `node(${type})-${this.createUniqueId()}`;
        this.pushElement({type, id, position, data});
    }

    createEdge = (sourceNode, sourceHandle, targetNode, targetHandle, type) => {
        const id = `edge(${sourceHandle} >> ${targetHandle})`;
        this.pushElement({id, sourceHandle, targetHandle, source: sourceNode, target: targetNode, type});
    }

    setNodeData = (id, data) => {
        const node = this.getElementById(id);
        this.replaceElementById(id, {...node, data});
    }

    getNodeData = id => {
        const node = this.getElementById(id);
        return node.data;
    }

    deleteEdgesConnectedToHandle = handleId => {
        this.pullElementByPredicate(el => el.sourceHandle === handleId || el.targetHandle === handleId);
    }

    render = () => {
        return <FlowGraphContext.Provider value={this.state}>
            {this.props.children}
        </FlowGraphContext.Provider>
    }

}