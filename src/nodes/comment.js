import { Input } from 'antd';

export const Comment = ({useData}) => {
    const [data, setData] = useData("Hello");
    const [data2, setData2] = useData("There");
    return <><Input.TextArea
            autoSize={{minRows: 1, maxRows: 5}}
            bordered={false}
            value={data}
            placeholder={"Add comment..."}
            onChange={v => setData(v.target.value)} />
            <Input.TextArea
            autoSize={{minRows: 1, maxRows: 5}}
            bordered={false}
            value={data2}
            placeholder={"Add comment..."}
            onChange={v => setData2(v.target.value)} /></>;
}