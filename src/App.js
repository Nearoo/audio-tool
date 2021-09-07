import { Col, Layout, Row } from 'antd';
import { Content, Header } from 'antd/lib/layout/layout';
import Sider from 'antd/lib/layout/Sider';
import Title from 'antd/lib/skeleton/Title';
import Footer from 'rc-table/lib/Footer';
import { GraphView } from './views/GraphView';
import { PresetBrowser } from './views/presetBrowser';

import './App.css';
import 'antd/dist/antd.css';

function App() {
  return <Row>
    <Col span={18}><GraphView /></Col>
    <Col span={6}><PresetBrowser /></Col>
  </Row>
}

export default App;
