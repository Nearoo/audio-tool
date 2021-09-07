import { useEffect, useImperativeHandle, useState } from 'react'
import { Player } from 'tone';
import { Button, Checkbox, Input } from "antd";
import { useOnGlobalSchedulerStop } from '../scheduler/scheduler';

export const Sampler = ({useTitle, useAudioOutputHandle, useBangInputHandle, useData}) => {
    useTitle("Sampler");
    const [player] = useState(() => new Player());
    useAudioOutputHandle(player.output, "audio-out");
    useBangInputHandle(time =>player.start(time.toSeconds()), "player-start");

    const [loop, setLoop] = useData(false);
    const [fpath, setFPath] = useData("808/Clap");

    useEffect(() => player.set({loop}), [loop]);

    const [playerReady, setPlayerReady] = useState(false);
    useEffect(() => {
        setPlayerReady(false);
        const path = `sounds/drums/${fpath}.wav`; 
        player.load(path).then(() => setPlayerReady(true));
    }, [fpath]);

    useOnGlobalSchedulerStop(() => player.stop());

    return <>
    <Input onPressEnter={e => setFPath(e.target.value)} defaultValue={fpath} style={{innerWidth:"300px"}}/>
    <Checkbox onChange={(e) => setLoop(e.target.checked)} checked={loop}>Loop</Checkbox>
    <Button onClick={() => player.start()} disabled={!playerReady}>Play</Button>
    </>
}