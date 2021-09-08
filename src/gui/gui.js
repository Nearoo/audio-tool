
import { InputNumber } from "antd";

export const NumberInputer = (props) => 
    <InputNumber min={1} size="small" precision={0} step={1} {...props} style={{width: 50, ...props.style}}/>