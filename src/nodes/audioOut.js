import { Button } from 'antd';
import { useState } from 'react';
import * as Tone from 'tone';

export const AudioOut = ({useAudioInputHandle}) => {
    useAudioInputHandle(Tone.getDestination(), "master-out");
    const [isOn, setOn] = useState(false);
    return <Button onClick={() => {Tone.start(); setOn(true)}} type={isOn ? "text" : "default"}>{isOn ? "🔊" : "🔇"}</Button>;
}