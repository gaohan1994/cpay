/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-08-13 11:15:48 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-08-13 11:20:03
 * 
 * @todo 日志提取任务详情页
 */
import React, { useState, useEffect } from 'react';
import { Spin, Descriptions } from 'antd';
import { useHistory } from 'react-router-dom';
import { formatSearch } from '@/common/request-util';

function Page() {
  const [loading, setLoading] = useState(false);
  const [detailArr, setDetailArr] = useState([]);
  const history = useHistory();

  useEffect(() => {
    const { search } = history.location;
    const field = formatSearch(search);
    // setLoading(true);
    if (field.id) {
      // appInfoDetail(field.id, getDetailCallback);
    }
  }, [history.location.search]);

  return (
    <Spin spinning={loading}>
      <div style={{ paddingLeft: '30px', paddingTop: '10px', width: '60vw' }}>
        <Descriptions bordered column={1} title="日志提取任务详情" >
          {
            detailArr.length > 0 && detailArr.map((item: any) => {
              return (
                <Descriptions.Item
                  label={<div style={{ width: '100px' }}>{item.label}</div>}
                >
                  <div style={{ width: 'calc(60vw - 200px)' }}>
                    {
                      item.render ? item.render(item.value) : item.value
                    }
                  </div>
                </Descriptions.Item>
              )
            })
          }
        </Descriptions>
      </div>
    </Spin>
  )
}

export default Page;