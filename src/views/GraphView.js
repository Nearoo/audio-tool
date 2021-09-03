import { Button, Card, Col, Input, Row } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import _ from 'lodash';
import { Component } from 'react';
import ReactFlow, { Background, Controls, MiniMap, ReactFlowProvider } from 'react-flow-renderer';
import { globalAudioGraph } from '../graph/audio';
import { globalBangGraph } from '../graph/bang';
import { AudioEdge, BangEdge } from '../graph/edges';
import { getAllNodesAsReactFlowElements, insideNodeContainer } from '../graph/nodeContainer';
import { AudioOut } from '../nodes/audioOut';
import { Comment } from '../nodes/comment';
import { Sampler } from '../nodes/sampler';
import { Sequencer } from '../nodes/sequencer';
import { UrBang } from '../nodes/urBang';


// Some default nodes, with default positions added to them
const defaultGraph = [
  {
      id: "urbang",
      type: "urbang"
  },
].map(el => ({...el, position: {...(el.position ?? {x: 100, y: 100})}}));

const nodes = {
    sequencer: Sequencer,
    comment: Comment,
    urbang: UrBang,
    sampler: Sampler,
    audioout: AudioOut,
}

const edgeTypes = {
    audio: AudioEdge,
    bang: BangEdge
}



export class GraphView extends Component {
    // key in localStorage in which the graph is stored
    localStorageKey = "graph";

    constructor(props){
        super(props)
        this.state = {
            elements: props.elements,
        }

        this.reactFlowInstance = null;
        this.audioGraph = globalAudioGraph;
        this.bangGraph = globalBangGraph;

        this.nodeTypes = _.mapValues(nodes, node => insideNodeContainer({
            Node: node
        }));

        this.edgeTypes = edgeTypes
    }

    componentDidMount = () => {
        this.loadGraph();
        this.idCounter = this.idCounter ?? 0;
    }

    getUniqueId = () => {
        return this.state.elements.length+1;
    }

    addElement = element => {
        this.setState(state => ({elements: [...state.elements, element]}));
    }

    removeElement = element => {
        this.setState(state => ({elements: _.without(state.elements, [element])}));
    }

    addEdge = (params) => {
        const {source, sourceHandle, target, targetHandle} = params;
        const id = `edge(${source}//${sourceHandle} >> ${target}//${targetHandle})`;
        this.addElement({...params, id});
    }

    findEdge = ({source, target}) => {
        return this.state.elements.find(({source_, target_}) => source_ === source && target_ === target);
    }

    removeEdge = ({source, target}) => {
        const edge = this.findEdge({source, target});
        this.removeElement(edge);
    }

    addNode = ({type, position, data}) => {
        const id = `n(${type}, )`
        const setData = data => {
            this.setNode(id, {data});
        }
        this.addElement({id, type, position, data: {...data, setData}});
    }

    findNode = id => {
        return this.state.elements.find(({id_}) =>id_ === id);
    }

    setNode = (id, params) => {
        const nodeOld = this.findNode(id);
        this.removeNode(id);
        this.addNode({id, ...nodeOld, ...params});
    }

    removeNode = ({id}) => {
        const node = this.findNode(id);
        this.removeElement(node);
    }

    onReactFlowLoad = (flow) => {
        this.reactFlowInstance = flow;
    }

    getGraphAsReactFlowObject = () => {
        // We collect "data" from Node, and node position from react flow-instance
        const nodesWithData = getAllNodesAsReactFlowElements();
        const nodesWithPosition = this.reactFlowInstance.getElements();

        const findPosition = id => nodesWithPosition.find(n => n.id === id).position;
        const findData = id => nodesWithData.find(n => n.id === id)?.data;
        const nodesWithDataAndPosition = nodesWithPosition.map(n => ({...n,
                                                        position: findPosition(n.id),
                                                        data: findData(n.id)
                                                    }));
        return nodesWithDataAndPosition;
    }

    saveGraph = () => {
        const elements = this.getGraphAsReactFlowObject();
        localStorage.setItem(this.localStorageKey, JSON.stringify(elements));
    }

    loadGraph = () => {
        const elements = JSON.parse(localStorage.getItem(this.localStorageKey)) ?? defaultGraph;
        this.setState({elements});
    }

    clearSaved = () => {
        localStorage.removeItem(this.localStorageKey);
    }

    addNodeOfType = (type, position={x:100, y:100}) => {
        if(type in this.nodeTypes){
            const id = `${type}(${this.getUniqueId()})`;
            const newNode = {
                id,
                type,
                position
            }

            this.setState(state => ({elements: [...state.elements, newNode]}));
        } else {
            console.error("No node of type", type);
        }
    }

    onConnectHandles = (params) => {
        const {sourceHandle, targetHandle} = params;
        if(this.audioGraph.isAudioNode(sourceHandle) && this.audioGraph.isAudioNode(targetHandle)){
            this.addEdge({...params, type: "audio"});
        } else if (this.bangGraph.isBangNode(sourceHandle) && this.bangGraph.isBangNode(targetHandle)){
            this.addEdge({...params, type: "bang"});
        } else {
            console.log("Can't connect handles ", sourceHandle, "and", targetHandle, "of different types");
            console.log("AudioGraph:", this.audioGraph)
        }
    }

    render = () => {
        return <Card style={{margin: 10}}>
            <div style={{height: 900}}>
                <Input.Group><Row gutter={5}>
                <Col><Button onClick={() => this.saveGraph()}>Save</Button></Col>
                <Col><Button onClick={() => this.clearSaved()}>Clear</Button></Col>
                <Col><Input placeholder="Add new element..." onPressEnter={e => this.addNodeOfType(e.target.value)} /></Col>
                </Row></Input.Group>
                <ReactFlowProvider>
                    <ReactFlow
                        elements={this.state.elements}
                        nodeTypes={this.nodeTypes}
                        edgeTypes={this.edgeTypes}
                        onLoad={this.onReactFlowLoad}
                        onConnect={this.onConnectHandles}>
                        <Background variant="dots" gap={24} size={0.5} />
                        <MiniMap />
                        <Controls />
                    </ReactFlow>
                </ReactFlowProvider>
                <Modal><p>Some Input</p></Modal>
            </div>
        </Card>
    }
}