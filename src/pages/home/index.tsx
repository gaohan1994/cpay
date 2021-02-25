import React, { useState, useEffect, useRef } from 'react';
import './index.scss';
import { Row, Col, Card, Spin, notification, Divider, Popover } from 'antd';
import { systemMains, getDownloadJobList } from './constants/api';
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
import { RESPONSE_CODE } from '@/common/config';

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
  const [downloadJobList, setDownloadJobList] = useState<any[]>([])
  const [chartHeight, setChartHeight] = useState(0);

  useEffect(() => {
    console.log('containerRef.current', containerRef.current.clientHeight);
    setChartHeight(containerRef.current.clientHeight);
  }, [containerRef.current]);

  useEffect(() => {
    setLoading(true);
    systemMains()
      .then((result) => {
        if (result.code !== RESPONSE_CODE.success) {
          notification.warn(result?.msg || ' ');
          return;
        }
        callback(result);
      }).catch((err) => {
        notification.warn(err?.msg);
      });
    getDownloadJobList()
      .then((result) => {
        if(result.code !== RESPONSE_CODE.success) {
          notification.warn(result?.msg || '')
          return
        }
        setDownloadJobList(result.data || {})
      })
      .catch((err) => {
        notification.warn(err?.msg);
      });
  }, []);

  useEffect(() => {
    const ele = document.getElementById('home-statistic')
    if(!ele) {
      return
    }
    setTimeout(() => {
      let myChart = echarts.getInstanceByDom(ele as any);
      if (myChart === undefined) {
        myChart = echarts.init(ele as any);
      }
      myChart.setOption(bar_option(data));
      window.addEventListener('resize', function () {
        myChart.resize();
      })
    }, 0);
  }, [data]);


  useEffect(() => {
    const ele = document.getElementById('home-statistic-line')
    if(!ele) {
      return
    }
    setTimeout(() => {
      let myChart = echarts.getInstanceByDom(ele as any);
      if (myChart === undefined) {
        myChart = echarts.init(ele as any);
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

  const onUploadDetail = (job: any) => {
    history.push(`/upload/update/operation?id=${job.id}&jobName=${job.jobName}`)
  }

  const onPublishClick = () => {
    history.push(`/application/publish`);
  }

  return <div className='home-container'>
    <Spin spinning={loading} wrapperClassName='home-container-loading' >
      <Row className='home-row'>
        <Container>
          <div style={{ width: '100%', height: '100%', paddingLeft: -8 }} ref={containerRef} id='home-statistic-line' />
        </Container>
        <Container>
          <div style={{ width: '100%', height: '100%' }} ref={containerRef} id='home-statistic' />
        </Container>
      </Row>
      <Row className='home-row'>
        <Container>
          <div style={{padding: '0 6px'}}>
            <div className='home-card-row home-card-title'>
              <span >更新任务</span>
              <a onClick={() => onUploadmore()}>更多+</a>
            </div>
            {downloadJobList && downloadJobList.map((job) => {
              const total = job.successCount + job.failureCount + job.executingCount + job.executeCount
              return (
                <div key={job.id} className='home-card-row' onClick={() => onUploadDetail(job)}>
                  <Popover
                    placement="right" 
                    content={`任务共${total}条，成功${job.successCount}条，失败${job.failureCount}条，待执行${job.executeCount}条，执行中${job.executingCount}条`}
                  >
                    <a className='home-card-row-content'> {job.jobName} </a>
                  </Popover>
                  <span>{`${total}/${job.successCount}/${job.failureCount}/${job.executeCount}/${job.executingCount}`}</span>
                </div>
              )
            })}
          </div>
        </Container>
        <Container>
          <div style={{padding: '0 6px'}}>
            <div className='home-card-row home-card-title'>
              <span>信息公告</span>
            </div>
            <Divider style={{margin: '0 0 8px'}}/>
            <div>
              <div className='home-card-row home-card-title'>
                <span>待办事宜</span>
                <a>更多+</a>
              </div>
              <div>
                {data.toBeAuditedAppCount && (
                  <div className='home-card-row' onClick={() => onPublishClick()}>
                    <a className='home-card-row-content'>{`有${data.toBeAuditedAppCount}条应用未发布`}</a>
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
