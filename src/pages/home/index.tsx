import React, { useState, useEffect, useRef } from 'react';
import './index.scss';
import { Row, Col, Card, Spin } from 'antd';
import { systemMains } from './constants/api';
import { IHomeData } from './constants/type';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/component/title';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/toolbox';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/dataZoom';
import { useHistory } from 'react-router-dom'
import { bar_option } from './chart/bar';
import { line_option } from './chart/line'
import moment from 'moment'

const Container = (props: any) => {
  return (
    <Col xs={24} sm={24} md={12} lg={12} xl={12} className='home-row-col'>
      <Card className='home-card'>
        {props.children}
      </Card>
    </Col>
  )
}

function App() {
  const history = useHistory();
  const containerRef: any = useRef(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({} as IHomeData);
  const [chartHeight, setChartHeight] = useState(0);

  useEffect(() => {
    console.log('containerRef.current', containerRef.current.clientHeight);
    setChartHeight(containerRef.current.clientHeight);
  }, [containerRef.current]);

  useEffect(() => {
    setLoading(true);
    systemMains(callback);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      let myChart = echarts.getInstanceByDom(document.getElementById('home-statistic') as any);
      if (myChart === undefined) {
        myChart = echarts.init(document.getElementById('home-statistic') as any);
      }
      myChart.setOption(bar_option(data));
      window.addEventListener('resize', function () {
        myChart.resize();
      })
    }, 0);
  }, [data]);


  useEffect(() => {
    setTimeout(() => {
      let myChart = echarts.getInstanceByDom(document.getElementById('home-statistic-line') as any);
      if (myChart === undefined) {
        myChart = echarts.init(document.getElementById('home-statistic-line') as any);
      }
      myChart.setOption(line_option(data));
      window.addEventListener('resize', function () {
        myChart.resize();
      })
    }, 0);
  }, [data]);

  const callback = (result: any) => {
    setLoading(false);
    setData(result.data);
  }

  const onUploadmore = () => {
    history.push(`/report/downloadJob`);
  }

  const onPublishClick = () => {
    history.push(`/application/publish`);
  }

  return <div className='home-container'>
    <Spin spinning={loading} wrapperClassName='home-container-loading' >
      <Row className='home-row'>
        <Container>
          <div style={{ width: '100%', height: '100%' }} ref={containerRef} id='home-statistic-line' />
        </Container>
        <Container>
          <div style={{ width: '100%', height: '100%' }} ref={containerRef} id='home-statistic' />
        </Container>
      </Row>
      <Row className='home-row'>
        <Container>
          <div>
            <div>
              <span>更新任务</span>
              <span onClick={() => onUploadmore()}>更多+</span>
            </div>
            {data && data.downloadJobList && data.downloadJobList.map((job) => {
              return (
                <div key={job.id} className='home-card-row'>
                  <span>{job.jobName}</span>
                  <span>{`${job.successCount + job.failureCount + job.executingCount + job.executeCount}/${job.successCount}/${job.failureCount}/${job.executingCount}/${job.executeCount}`}</span>
                </div>
              )
            })}
          </div>
        </Container>
        <Container>
          <div>
            <div>
              信息公告
            </div>

            <div>
              <div>
                <span>待办事宜</span>
                <span>更多+</span>
              </div>
              <div>
                {data.toBeAuditedAppCount && (
                  <div className='home-card-row' onClick={() => onPublishClick()}>
                    <span>{`有${data.toBeAuditedAppCount}条应用未发布`}</span>
                    <span>{moment().format('YYYY-MM-DD')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Container>
      </Row>
    </Spin>
  </div>
}

export default App;
