import React, { useState, useEffect } from 'react';
import './index.scss';
import { Row, Col, Card, Spin } from 'antd';
import { systemMains } from './constants/api';
import { IHomeData } from './constants/type';

function App() {

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({} as IHomeData)

  useEffect(() => {
    setLoading(true);
    systemMains(callback)
  }, []);

  const callback = (result: any) => {
    setLoading(false);
    setData(result.data);
  }


  return <div className='home-container'>
    <Spin spinning={loading} wrapperClassName='home-container-loading' >
      <Row className='home-row'>
        <Col xs={24} sm={24} md={12} lg={12} xl={12} className='home-row-col'>
          <Card className='home-card'>

          </Card>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} xl={12} className='home-row-col'>
          <Card className='home-card'>

          </Card>
        </Col>
      </Row>
      <Row className='home-row'>
        <Col xs={24} sm={24} md={12} lg={12} xl={12} className='home-row-col'>
          <Card className='home-card'>

          </Card>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} xl={12} className='home-row-col'>
          <Card className='home-card'>

          </Card>
        </Col>
      </Row>
    </Spin>
  </div>
}

export default App;
