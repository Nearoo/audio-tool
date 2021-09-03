import { Card } from 'antd';
import { Component } from 'react';
import _ from 'lodash';

export class Node extends Component {
    constructor(props){
        super(props);
        this.state = {};
    };

    getData = () => {
        return this.state.data;
    }

    setTitle = (title) => {
        this.props.setTitle(title);
    }

    render = () => {
        return <></>;
    }
}

Node.defaultProps = { 
    setTitle: () => {},
    addBangOutHandle: () => {},
    addBangInHandle: () => {},
    removeBangHandle: () => {},
    addAudioInHandle: () => {},
    removeAudioOutHandle: () => {}
}