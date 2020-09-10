/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-08-13 11:15:48 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-09-10 15:20:58
 * 
 * @todo 日志提取任务详情页
 */
import React, { useState, useEffect } from 'react';
import { Spin, Descriptions, notification } from 'antd';
import { useQueryParam } from '@/common/request-util';
import { taskUploadJobDetail } from '../../constants/api';
import { RESPONSE_CODE } from '@/common/config';
import { TaskUploadJobDetail } from '../../types';
import { useStore } from '@/pages/common/costom-hooks';
import { getDictText } from '@/pages/common/util';

const initDetailArr = [
  { label: "任务名称", value: '' },
  { label: "日志提取方式", value: '' },
  { label: "文件路径", value: '' },
  { label: "终端厂商", value: '' },
  { label: "终端型号", value: '' },
  { label: "有效期起始日期", value: '' },
  { label: "有效期截止日期", value: '' },
  { label: "提取开始日期", value: '' },
  { label: "提取结束日期", value: '' },
  { label: "终端集合", value: '' },
]

function Page() {
  const res = useStore(['log_upload_type']);

  const [loading, setLoading] = useState(false);
  const [detailArr, setDetailArr] = useState(initDetailArr as any[]);
  const id = useQueryParam('id');

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
        taskUploadJobDetail(id, getDetailCallback);
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
      let detail: TaskUploadJobDetail = result.data;
      let arr: any[] = [];
      arr.push({ label: "任务名称", value: detail.jobName });
      arr.push({ label: "日志提取方式", value: getDictText(detail.type, 'log_upload_type') });
      if (detail.type === '0') {
        arr.push({ label: "应用包名", value: detail.appCode });
      } else if (detail.type === '1') {
        arr.push({ label: "文件路径", value: detail.appCode });
      }
      arr.push({ label: "终端厂商", value: detail.firmName });
      arr.push({ label: "终端型号", value: detail.terminalType });
      arr.push({ label: "有效期起始日期", value: detail.validStartTime });
      arr.push({ label: "有效期截止日期", value: detail.validEndTime });
      arr.push({ label: "提取开始日期", value: detail.logBeginTime });
      arr.push({ label: "提取结束日期", value: detail.logEndTime });
      arr.push({ label: "终端集合", value: detail.tusns && detail.tusns.split(',').join(' ') });
      setDetailArr(arr);
    } else {
      notification.warn(result.msg || '获取详情失败，请刷新页面重试');
    }
  }

  return (
    <Spin spinning={loading}>
      <div style={{ paddingLeft: '30px', paddingTop: '10px', width: '60vw' }}>
        <Descriptions bordered column={1} title="日志提取任务详情" >
          {
            detailArr.length > 0 && detailArr.map((item: any) => {
              return (
                <Descriptions.Item
                  key={item.label}
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