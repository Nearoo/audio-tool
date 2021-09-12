# Audio Tool

A node-based DAW, built on react, using [tone.js](https://tonejs.github.io/) and [react-flow](https://reactflow.dev/). [Try it out!](https://nearoo.github.io/audio-tool/)

![screenshot](https://i.imgur.com/JvHx7cG.jpg)

Usage:
* to add a node, rightclick anywhere on the background, enter e.g. `sampler` or `sequencer` ([all node types so far](https://github.com/Nearoo/audio-tool/blob/main/src/views/nodeTypes.js))
* drag a list item from the right into the graph view to create sampler nodes with audio files loaded in them
* if you can't hear anything, press the speaker on the audio out node (web browsers require explicit user action to start the audio context)

