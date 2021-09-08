import { Col, Layout, Row } from 'antd';
import { Content, Header } from 'antd/lib/layout/layout';
import Sider from 'antd/lib/layout/Sider';
import Title from 'antd/lib/skeleton/Title';
import Footer from 'rc-table/lib/Footer';
import { PresetBrowser } from './views/presetBrowser';

import './App.css';
import 'antd/dist/antd.css';
import { GraphView } from './views/graphView';
import { StorageController } from './views/storageController';
import { FlowGraphProvider } from './graph/flow';

function App() {
  return <Row>
    <Col span={18} style={{height: "900px"}}>
      <FlowGraphProvider>
        <StorageController />
        <GraphView />
      </FlowGraphProvider>
    </Col>
    <Col span={6}>
      <PresetBrowser />
    </Col>
  </Row>
}

export default App;
