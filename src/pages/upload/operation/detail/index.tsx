/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-08-13 11:15:48 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-08-20 11:28:51
 * 
 * @todo 日志提取任务详情页
 */
import React, { useState, useEffect } from 'react';
import { Spin, Descriptions, notification } from 'antd';
import { useQueryParam } from '@/common/request-util';
import { taskOperationJobDetail } from '../../constants/api';
import { RESPONSE_CODE } from '@/common/config';
import { ITaskOperationJobDetail } from '../../types';
import { useStore } from '@/pages/common/costom-hooks';
import { getDictText } from '@/pages/common/util';

const initDetailArr = [
  { label: "任务名称", value: '' },
  { label: "操作指令", value: '' },
  { label: "终端厂商", value: '' },
  { label: "终端型号", value: '' },
  { label: "发布类型", value: '' },
  { label: "终端集合", value: '' },
]

function Page() {
  const res = useStore(['terminal_operator_command', 'release_type']);

  const [loading, setLoading] = useState(false);
  const [detailArr, setDetailArr] = useState(initDetailArr as any[]);
  const id = useQueryParam('id');

  useEffect(() => {
    setLoading(true);
    if (!res.loading) {
      if (id) {
        taskOperationJobDetail(id, getDetailCallback);
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
      let detail: ITaskOperationJobDetail = result.data;
      let arr: any[] = [];
      arr.push({ label: "任务名称", value: detail.jobName });
      arr.push({ label: "操作指令", value: getDictText(detail.operatorCommand, 'terminal_operator_command') });
      arr.push({ label: "终端厂商", value: detail.firmName });
      arr.push({ label: "终端型号", value: detail.typeName });
      arr.push({ label: "发布类型", value: getDictText(`${detail.releaseType}`, 'release_type') });
      if (detail.releaseType === 0) {
        arr.push({ label: "终端集合", value: detail.tusns });
      } else {
        arr.push({ label: "机构名称", value: detail.deptName });
        arr.push({ label: "组别过滤方式", value: detail.isGroupUpdate === 0 ? '无' : detail.isGroupUpdate === 1 ? '指定' : '排除' });
        arr.push({ label: "终端组别", value: detail.groupIds });
      }
      setDetailArr(arr);
    } else {
      notification.warn(result && result.msg || '获取详情失败，请刷新页面重试');
    }
  }

  return (
    <Spin spinning={loading}>
      <div style={{ paddingLeft: '30px', paddingTop: '10px', width: '60vw' }}>
        <Descriptions bordered column={1} title="远程运维详情" >
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