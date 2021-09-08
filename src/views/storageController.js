import { Button, Col, Input, Row } from 'antd';
import { useCallback, useContext, useEffect } from "react";
import { FlowGraphContext } from "../graph/flow";
import { defaultGraph } from "./defaultGraph";

export const StorageController  = () => {
    const flowGraph = useContext(FlowGraphContext);

    const saveGraph = useCallback(() => {
        localStorage.setItem("graph", JSON.stringify(flowGraph.elements));
    }, [flowGraph.elements]);

    const loadGraph = useCallback(() => {
        flowGraph.setElements(JSON.parse(localStorage.getItem("graph")) ?? defaultGraph);
    }, [flowGraph]);

    const resetGraph = useCallback(() => {
        flowGraph.setElements(defaultGraph);
    }, [flowGraph]);

    useEffect(() => loadGraph(), []);
    return <Input.Group style={{padding: 5}}>
        <Row gutter={5}>
            <Col>
                <Button onClick={() => saveGraph()}>Save</Button>
            </Col>
            <Col>
                <Button onClick={() => loadGraph()}>Load</Button>
            </Col>
            <Col>
                <Button onClick={() => resetGraph()}>Reset</Button>
            </Col>
        </Row>
    </Input.Group>
}