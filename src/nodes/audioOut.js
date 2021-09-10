import { Button } from 'antd';
import { useState } from 'react';
import { useUpdateNodeInternals } from 'react-flow-renderer';
import * as Tone from 'tone';

export const AudioOut = ({useAudioInputHandle, useTitle}) => {
    useTitle("Master");
    useAudioInputHandle(Tone.getDestination(), "master-in");
    const [isOn, setOn] = useState(false);
    return <Button onClick={() => {Tone.start(); setOn(true)}} type={isOn ? "text" : "default"}>🔊</Button>;
}