import { AudioOut } from '../nodes/audioOut';
import { Comment } from '../nodes/comment';
import { Sampler } from '../nodes/sampler';
import { Sequencer } from '../nodes/sequencer';
import { UrBang } from '../nodes/urBang';


export const nodeTypes = {
    sequencer: Sequencer,
    comment: Comment,
    urbang: UrBang,
    sampler: Sampler,
    audioout: AudioOut,
}
