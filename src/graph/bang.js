

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
        this.triggererMap[nodeIdentifier] = new Set();
        const callback = (time) => this.triggererMap[nodeIdentifier].forEach(
            triggeree => this.triggereeMap[triggeree](time)
        );
        return callback;
    }


    registerInputNode = (nodeIdentifier, callback) => {
        const id = nodeIdentifier;
        this.triggereeMap[id] = callback;
    }

    deRegisterNode = (id) => {
        delete this.nodeMap[id];
    }

    connectNodes = (id1, id2) => {
        this.triggererMap[id1].add(id2);
    }

    disconnectNodes = (id1, id2) => {
        this.triggererMap[id1].remove(id2);
    }

    isBangNode = id => {
        return id in this.triggereeMap || id in this.triggererMap;
    };
}


export const globalBangGraph = new BangGraph();