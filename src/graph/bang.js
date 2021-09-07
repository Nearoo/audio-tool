

export class BangGraph {
    constructor(){
        /** Maps id -> trigger callback */
        this.triggereeMap = {};
        /** Maps id -> trigeree id sets */
        this.triggererMap = {};
        this.idCounter = 0;
    }

    createUniqueId = () => {
        this.idCounter += 1;
        return this.idCounter;
    }

    registerOutputNode = (nodeIdentifier) => {
        if(!(nodeIdentifier in this.triggererMap)){
            this.triggererMap[nodeIdentifier] = new Set();
        }
        const callback = (time, data) => this.triggererMap[nodeIdentifier].forEach(
            triggeree => this.triggereeMap[triggeree](time, data)
        );
        return callback;
    }

    deregisterOutputNode = nodeIdentifier => {
        this.triggererMap[nodeIdentifier].forEach(inputNode =>
            this.disconnectNodes(nodeIdentifier, inputNode));
        delete this.triggererMap[nodeIdentifier];
    }

    registerInputNode = (nodeIdentifier, callback) => {
        const id = nodeIdentifier;
        this.triggereeMap[id] = callback;
    }

    deregisterInputNode = (id) => {
        delete this.triggereeMap[id];
    }

    connectNodes = (id1, id2) => {
        this.triggererMap[id1].add(id2);
    }

    disconnectNodes = (id1, id2) => {
        this.triggererMap[id1]?.delete(id2);
    }

    isBangNode = id => {
        return id in this.triggereeMap || id in this.triggererMap;
    };
}


export const globalBangGraph = new BangGraph();