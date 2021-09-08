import _ from 'lodash';
import { insideNodeContainer } from '../graph/nodeContainer';
import { AudioOut } from '../nodes/audioOut';
import { Comment } from '../nodes/comment';
import { Sampler } from '../nodes/sampler';
import { Sequencer } from '../nodes/sequencer';
import { UrBang } from '../nodes/urBang';



let nodeTypes = {
    sequencer: Sequencer,
    comment: Comment,
    urbang: UrBang,
    sampler: Sampler,
    audioout: AudioOut,
}

// Put nodes inside container
nodeTypes = _.mapValues(nodeTypes, node => insideNodeContainer(node));

export { nodeTypes };
