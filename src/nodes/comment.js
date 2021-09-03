import { Input } from 'antd';

export const Comment = ({useData}) => {
    const [data, setData] = useData("Hello");
    return <Input.TextArea
            autoSize={{minRows: 1, maxRows: 5}}
            bordered={false}
            value={data}
            placeholder={"Add comment..."}
            onChange={v => setData(v.target.value)} />;
}