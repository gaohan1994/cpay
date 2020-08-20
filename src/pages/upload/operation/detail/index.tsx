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
import { useHistory } from 'react-router-dom';
import { formatSearch } from '@/common/request-util';
import { taskUploadJobDetail, taskOperationJobDetail } from '../../constants/api';
import { RESPONSE_CODE } from '@/common/config';
import { TaskUploadJobDetail, ITaskOperationJobDetail } from '../../types';
import { useStore } from '@/pages/common/costom-hooks';
import { useSelectorHook } from '@/common/redux-util';
import numeral from 'numeral';

function Page() {
  useStore(['terminal_operator_command', 'release_type']);
  const common = useSelectorHook((state) => state.common);

  const [loading, setLoading] = useState(false);
  const [detailArr, setDetailArr] = useState([] as any[]);
  const history = useHistory();

  useEffect(() => {
    const { search } = history.location;
    const field = formatSearch(search);
    // setLoading(true);
    if (field.id) {
      taskOperationJobDetail(field.id, getDetailCallback);
    }
  }, [history.location.search]);

  /**
   * @todo 监听应用状态对应的字典列表的改变，获取相应状态对应的 文字
   */
  useEffect(() => {
    let newDetailArr = [...detailArr];
    for (let i = 0; i < detailArr.length; i++) {
      if (detailArr[i].label === "操作指令") {
        newDetailArr[i] = { label: "操作指令", value: getCommandText(detailArr[i].value) }
      } else {
        if (detailArr[i].label === "发布类型") {
          newDetailArr[i] = { label: "发布类型", value: getReleaseTypeText(detailArr[i].value) }
        }
      }
    }
    setDetailArr(newDetailArr);
  }, [common.dictList]);

  /**
   * @todo 获取应用状态对应的文字
   * @param status 应用状态
   */
  const getCommandText = (command: string) => {
    let data: any = common.dictList && common.dictList.terminal_operator_command && common.dictList.terminal_operator_command.data
      ? common.dictList.terminal_operator_command.data : [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].dictValue === command) {
        return data[i].dictLabel;
      }
    }
    return command;
  }

  const getReleaseTypeText = (type: number) => {
    let data: any = common.dictList && common.dictList.release_type && common.dictList.release_type.data
      ? common.dictList.release_type.data : [];
    for (let i = 0; i < data.length; i++) {
      if (numeral(data[i].dictValue).value() === type) {
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
      let detail: ITaskOperationJobDetail = result.data;
      let arr: any[] = [];
      arr.push({ label: "任务名称", value: detail.jobName });
      arr.push({ label: "操作指令", value: getCommandText(detail.operatorCommand) });
      arr.push({ label: "终端厂商", value: detail.firmName });
      arr.push({ label: "终端型号", value: detail.typeName });
      arr.push({ label: "发布类型", value: getReleaseTypeText(detail.releaseType) });
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