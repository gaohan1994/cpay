/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-09-22 16:37:13 
 * @Last Modified by:   centerm.gaozhiying 
 * @Last Modified time: 2020-09-22 16:37:13 
 * 
 * @todo 日志操作详情页
 */
import React, { useEffect, useState } from 'react';
import { Descriptions, notification, Col, Row, Rate, Spin, Tag } from 'antd';
import { useQueryParam } from '@/common/request-util';
import { RESPONSE_CODE } from '@/common/config';
import { useStore } from '@/pages/common/costom-hooks';
import { getDictText } from '@/pages/common/util';
import { monitorOperLogDetails } from './constants/api';
import { getStatusColor } from '../common';

function Page() {
  // 请求dept数据
  const res = useStore(['sys_common_status']);
  const id = useQueryParam('id');
  const [detailArr, setDetailArr] = useState([] as any[]);
  const [loading, setLoading] = useState(false);

  /**
   * @todo 初始页面数据
   */
  useEffect(() => {
    getDetailCallback({ code: RESPONSE_CODE.success, data: {} });
  }, []);

  /**
  * @todo 获取完相应字典数据，设置详情值
  */
  useEffect(() => {
    setLoading(true);
    if (!res.loading) {
      if (id) {
        monitorOperLogDetails(id, getDetailCallback);
      } else {
        setLoading(false);
      }
    }
  }, [id, res.loading]);

  /**
   * @todo 从接口拿到应用详情后的回调方法
   * @param result
   */
  const getDetailCallback = (result: any) => {
    setLoading(false);
    if (result && result.code === RESPONSE_CODE.success) {
      let detail = result.data;
      let arr: any[] = [];
      arr.push({ label: '系统模块', value: detail.title });
      arr.push({ label: '登录信息', value: `${detail.operName}/${detail.deptName}/${detail.operIp}/${detail.operLocation}` });
      arr.push({ label: '请求地址', value: detail.operUrl });
      arr.push({ label: '操作方法', value: detail.method });
      arr.push({ label: '请求参数', value: JSON.stringify(detail.params || {}) });
      arr.push({
        label: '状态',
        value: getDictText(`${detail.status}`, 'sys_common_status'),
        render: (item: any) => item !== '--' ? <Tag color={getStatusColor(item)}>{item}</Tag> : '--'
      });
      setDetailArr(arr);
    } else {
      notification.warn(result.msg || '获取详情失败，请刷新页面重试');
    }
  };

  return (
    <Spin spinning={loading}>
      <div style={{ paddingLeft: '30px', paddingTop: '10px', width: '60vw' }}>
        <Descriptions bordered column={1} title="操作日志详情">
          {detailArr.length > 0 &&
            detailArr.map((item: any) => {
              return (
                <Descriptions.Item
                  label={<div style={{ width: '100px' }}>{item.label}</div>}
                >
                  <div style={{ width: 'calc(60vw - 200px)' }}>
                    {item.render ? item.render(item.value) : item.value || '--'}
                  </div>
                </Descriptions.Item>
              );
            })}
        </Descriptions>
      </div>
    </Spin>
  );
}

export default Page;
