

export class BangGraph {
    constructor(){
        /** Maps id -> trigger callback */
        this.triggereeMap = {};
        /** Maps id -> trigeree id sets */
        this.triggererMap = {};
    }

    registerOutputNode = (nodeIdentifier) => {
        if(!(nodeIdentifier in this.triggererMap)){
            this.triggererMap[nodeIdentifier] = new Set();
        }
        return this.getTriggerCallbackForOutputNode(nodeIdentifier);
    }

    getTriggerCallbackForOutputNode = nodeIdentifier => {
        const callback = (time, data) => (this.triggererMap[nodeIdentifier] ?? new Set()).forEach(
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