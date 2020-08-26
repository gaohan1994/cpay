import React, { useEffect, useState } from 'react';
import { useQueryParam } from '@/common/request-util';
import { Spin, notification } from 'antd';
import { RESPONSE_CODE } from '@/common/config';
import { taskDownloadJobDetail } from '../constants/api';

export default function Page() {
  const id = useQueryParam('id');

  const [loading, setLoading] = useState(false);
  const [detailArr, setDetailArr] = useState([] as any[]);

  useEffect(() => {
    // setLoading(true);
    if (id) {
      taskDownloadJobDetail(id, getDetailCallback);
    }
  }, [id]);

  /**
  * @todo 从接口拿到应用详情后的回调方法
  * @param result 
  */
  const getDetailCallback = (result: any) => {
    setLoading(false);
    if (result && result.code === RESPONSE_CODE.success) {
      let detail: any = result.data;
      let arr: any[] = [];
      arr.push({ label: "任务名称", value: detail.jobName });
      arr.push({ label: "终端厂商", value: detail.firmName });
      arr.push({ label: "终端型号", value: detail.typeName });
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

    </Spin>
  )
}