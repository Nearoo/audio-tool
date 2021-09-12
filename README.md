# Audio Tool

A node-based DAW, built on react, using [tone.js](https://tonejs.github.io/) and [react-flow](https://reactflow.dev/).

Try it out [here](https://nearoo.github.io/audio-tool/):
* rightclick anywhere to add new nodes. Currently, only one node benefits from being added this way: `sequencer`. See all node types [here](https://github.com/Nearoo/audio-tool/blob/main/src/views/nodeTypes.js#L10)
* on the right side, drag different samples for playback
* make sure you pressed the speaker on the master-out node so the audio context is started (websites can only play audio when a user started the audio context by clicking something)

![screenshot](https://i.imgur.com/jCHlFLV.png)
