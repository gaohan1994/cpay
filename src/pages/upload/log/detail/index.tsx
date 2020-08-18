/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-08-13 11:15:48 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-08-13 11:20:03
 * 
 * @todo 日志提取任务详情页
 */
import React, { useState, useEffect } from 'react';
import { Spin, Descriptions, notification } from 'antd';
import { useHistory } from 'react-router-dom';
import { formatSearch } from '@/common/request-util';
import { taskUploadJobDetail } from '../../constants/api';
import { RESPONSE_CODE } from '@/common/config';
import { TaskUploadJobDetail } from '../../types';
import { useStore } from '@/pages/common/costom-hooks';
import { useSelectorHook } from '@/common/redux-util';

function Page() {
  useStore(['log_upload_type']);
  const common = useSelectorHook((state) => state.common);

  const [loading, setLoading] = useState(false);
  const [detailArr, setDetailArr] = useState([] as any[]);
  const history = useHistory();

  useEffect(() => {
    const { search } = history.location;
    const field = formatSearch(search);
    // setLoading(true);
    if (field.id) {
      taskUploadJobDetail(field.id, getDetailCallback);
    }
  }, [history.location.search]);

  /**
   * @todo 监听应用状态对应的字典列表的改变，获取相应状态对应的 文字
   */
  useEffect(() => {
    for (let i = 0; i < detailArr.length; i++) {
      if (detailArr[i].label === "日志提取方式") {
        let newDetailArr = [...detailArr];
        newDetailArr[i] = { label: "日志提取方式", value: getTypeText(detailArr[i].value) }
        setDetailArr(newDetailArr);
      }
    }
  }, [common.dictList]);

  /**
   * @todo 获取应用状态对应的文字
   * @param status 应用状态
   */
  const getTypeText = (type: string) => {
    let data: any = common.dictList && common.dictList.log_upload_type && common.dictList.log_upload_type.data
      ? common.dictList.log_upload_type.data : [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].dictValue) {
        return data[i].dictLabel || type;
      }
    }
    return type;
  }

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
      arr.push({ label: "日志提取方式", value: getTypeText(detail.type) });
      arr.push({ label: "终端厂商", value: detail.firmName });
      arr.push({ label: "终端型号", value: detail.terminalType });
      arr.push({ label: "有效期起始日期", value: detail.validStartTime });
      arr.push({ label: "有效期截止日期", value: detail.validEndTime });
      arr.push({ label: "提取开始日期", value: detail.logBeginTime });
      arr.push({ label: "提取结束日期", value: detail.logEndTime });
      arr.push({ label: "终端集合", value: detail.tusns });
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