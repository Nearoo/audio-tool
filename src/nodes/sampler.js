import { useEffect, useState } from 'react'
import { Player } from 'tone';
import { Button, Checkbox } from "antd";
import { useOnGlobalSchedulerStop } from '../scheduler/scheduler';

export const Sampler = ({useTitle, useAudioOutputHandle, useBangInputHandle, useData}) => {
    useTitle("Sampler");
    const [player] = useState(() => new Player("https://tonejs.github.io/audio/berklee/gong_1.mp3"));
    useAudioOutputHandle(player.output, "audio-out");
    useBangInputHandle(time => player.start(time.toSeconds()), "player-start");

    const [{doLoop}, setData] = useData({doLoop: false});
    useEffect(() => player.set({loop: doLoop}), [doLoop]);
    

    useOnGlobalSchedulerStop(() => player.stop());

    return <>
    <Checkbox onChange={(e) => setData({doLoop: e.target.checked})} checked={doLoop}>Loop</Checkbox>
    <Button onClick={() => player.start()}>Play</Button>
    </>
}