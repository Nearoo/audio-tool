import { useEffect, useImperativeHandle, useRef, useState } from 'react'
import { Player } from 'tone';
import { Button, Checkbox, Col, Input, Row } from "antd";
import { s, useOnGlobalSchedulerStop } from '../scheduler/scheduler';
import { useNew } from '../common/hooks';

export const Sampler = ({useTitle, useAudioOutputHandle, useBangInputHandle, useData}) => {
    useTitle("Sampler");
    const player = useNew(Player)();
    // For debugging purposes, keep track of last playback time, throw silently if it's non-increasing
    const lastPlaybackRef = useRef();
    const startPlayer = time => {
        const lastPb = lastPlaybackRef.current ?? s(-1);
        if(lastPb.isOnOrAfter(time))
            console.error(`Tried scheduling player playback in non-increasing fashion. Last playback: ${lastPb}, current playback: ${time}`)
        else{
            lastPlaybackRef.current = time;
            player.start(time.toSeconds());
        }           
    }
    useAudioOutputHandle(player.output, "audio-out");
    useBangInputHandle(time =>startPlayer(time), "player-start");

    const [loop, setLoop] = useData(false, "loop");
    const [fpath, setFPath] = useData("808/Clap", "path");

    useEffect(() => player.set({loop}), [loop]);

    const [playerReady, setPlayerReady] = useState(false);
    useEffect(() => {
        setPlayerReady(false);
        const path = `sounds/drums/${fpath}.wav`; 
        player.load(path).then(() => setPlayerReady(true));
    }, [fpath]);

    useOnGlobalSchedulerStop(() => player.stop());
    return <>
    <Col style={{width: "120px"}}>
        <Input onPressEnter={e => setFPath(e.target.value)} defaultValue={fpath} />
    </Col>
    <Checkbox onChange={(e) => setLoop(e.target.checked)} checked={loop}>Loop</Checkbox>
    <Button onClick={() => player.start()} disabled={!playerReady}>Play</Button>
    </>
}