

export class AudioGraph {
    constructor(){
        /** Maps id -> audio node */
        this.nodeMap = {};
    }

    registerNode = (node, nodeIdentifier) => {
        this.nodeMap[nodeIdentifier] = node;
    }

    deregisterNode = (id) => {
        delete this.nodeMap[id];
    }

    connectNodes = (id1, id2) => {
        this.nodeMap[id1].connect(this.nodeMap[id2]);
    }

    disconnectNodes = (id1, id2) => {
        this.nodeMap[id1]?.disconnect(this.nodeMap[id2]);
    }

    isAudioNode = id => {
        return id in this.nodeMap
    };

    areConnected = (id1, id2) => {
        return this.nodeMap[id1].is
    }
}


export const globalAudioGraph = new AudioGraph();