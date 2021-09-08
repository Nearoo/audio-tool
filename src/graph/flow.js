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

    createNode = (type, position, data) => {
        const id = `node(${type})-${this.createUniqueId()}`;
        this.pushElement({type, id, position, data});
    }

    createEdge = (sourceNode, sourceHandle, targetNode, targetHandle, type) => {
        const id = `edge(${sourceHandle} >> ${targetHandle})`;
        this.pushElement({id, sourceHandle, targetHandle, source: sourceNode, target: targetNode, type});
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