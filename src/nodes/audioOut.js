import * as Tone from 'tone';

export const AudioOut = ({useAudioInputHandle}) => {
    useAudioInputHandle(Tone.getDestination(), "master-out");
    return <h1>🔉</h1>;
}