
import { nodeTypes } from './nodeTypes';
import { insideNodeContainer } from '../graph/nodeContainer';
import { Card, Collapse, List } from 'antd';
import Title from 'antd/lib/skeleton/Title';

import { presets } from './presets';

export const PresetBrowser = (props) => {
    return <Collapse style={{margin: 10}}>
        {Object.keys(presets).map(
            typeName => <Collapse.Panel header={typeName} key={typeName}>
                <List size="small"

                    bordered
                    dataSource={presets[typeName]}
                    renderItem={item =>
                        <List.Item
                            key={item.name}
                            draggable
                            onDragStart={ev => {
                                ev.dataTransfer.setData("app/audio-tool/preset-dnd", JSON.stringify({type: typeName, data: item.data}));
                                ev.dataTransfer.effectAllowed = "move";
                                }}>
                            {item.name}
                        </List.Item>} />
            </Collapse.Panel>
        )}
    </Collapse>
}