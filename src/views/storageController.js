import { Button, Col, Input, Row } from 'antd';
import { useCallback, useContext, useEffect } from "react";
import { FlowGraphContext } from "../graph/flow";
import { defaultFlowConfiguration } from "./defaultGraph";

export const StorageController  = () => {
    const flowGraph = useContext(FlowGraphContext);

    const setGraphConfig = useCallback(flowConfig => {
        flowGraph.setElements(flowConfig.elements);
        const transform = {x: flowConfig.position[0], y: flowConfig.position[1]+100, zoom: flowConfig.zoom};
        flowGraph.reactFlowInstance?.setTransform(transform);
    }, [flowGraph]);

    const getGraphConfig = useCallback(() =>
        flowGraph.reactFlowInstance.toObject());

    const saveGraph = useCallback(() => {
        localStorage.setItem("graph", JSON.stringify(getGraphConfig()));
    }, [flowGraph]);

    const loadGraph = useCallback(() => {
        const config = JSON.parse(localStorage.getItem("graph") ?? defaultFlowConfiguration);
        setGraphConfig(config);
    }, [flowGraph]);

    const resetGraph = useCallback(() => {
        setGraphConfig(defaultFlowConfiguration);
    }, [flowGraph]);

    useEffect(() => flowGraph.reactFlowInstance && loadGraph(), [flowGraph.reactFlowInstance]);
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