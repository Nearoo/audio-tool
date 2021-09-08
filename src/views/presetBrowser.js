
import { Collapse, List } from 'antd';
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
                                ev.dataTransfer.setData("audio-tool/node-preset", JSON.stringify({type: typeName, data: item.data}));
                                ev.dataTransfer.effectAllowed = "move";
                                }}>
                            {item.name}
                        </List.Item>} />
            </Collapse.Panel>
        )}
    </Collapse>
}