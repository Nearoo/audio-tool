
let presets = {
    sampler: []
}

// Populate presets with samples
const collectedNames = ['Clap', 'Cow', 'Hihat1_closed', 'Hihat3_closed', 'Hihat_open', 'Kick', 'Snare', 'Snare3', 'Snare5', 'Clap2', 'Crash', 'Hihat2_closed', 'Hihat4_closed', 'Hihat_open_2', 'Kick2', 'Snare2', 'Snare4']
collectedNames.forEach(presetName =>
    presets.sampler.push({name: `808 ${presetName}`, data: {2: false, 3: `808/${presetName}`}})
)

export { presets }