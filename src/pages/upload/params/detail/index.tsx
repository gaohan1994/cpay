/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-09-01 14:44:18 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-09-10 13:37:26
 * 
 * @todo 软件更新任务详情
 */
import React, { useEffect, useState } from 'react';
import { useQueryParam } from '@/common/request-util';
import { Spin, Descriptions, Table } from 'antd';
import { issueJobDetail } from '../../constants/api';
import { useDetail } from '@/pages/common/costom-hooks/use-detail';
import { createTableColumns } from '@/component/table';
import { useStore } from '@/pages/common/costom-hooks';
import { getDictText } from '@/pages/common/util';

/**
 * @todo 根据keys的值，获取对象中对应的数据
 * @param obj 
 * @param keys 
 */
const getObjectValue = (obj: any, keys: string[]) => {
  let value: any = {};
  for (let i = 0; i < keys.length; i++) {
    if (i === 0) {
      value = obj[keys[i]];
    } else {
      value = value[keys[i]];
    }
    if (typeof value !== 'undefined') {
      if (i === keys.length - 1) {
        return value;
      }
      continue;
    }
    return '--';
  }
  return '--';
}

export default function Page() {
  const id = useQueryParam('id');
  const res = useStore(['driver_type', 'job_action', 'release_type',
    'buss_type', 'unionpay_connection', 'dcc_sup_flag',
    'terminal_type', 'activate_type', 'is_group_update', 'zz_flag','acquiring_param_belong_app',
    'acquiring_param_template_type'
  ]);

  const [loading, setLoading] = useState(false);
  const [detailArr, setDetailArr] = useState([] as any[]);
  const { detail } = useDetail(id, issueJobDetail, setLoading);

  const getIssueParamsJobOutputValue = (key: string) => {
    return getObjectValue(detail, ['issueParamJobOutput', key]);
  }

  const getTerminalParamTemplate = (key: string) => {
    return getObjectValue(detail, ['terminalParamTemplate', key])
  }

  const getCommonValue = (key: string) => {
    return getObjectValue(detail, [key]);
  }

  useEffect(() => {
    const arr: any[] = [];
    const terminalInfo: any = [];
    terminalInfo.push({ label: "任务名称", value: getIssueParamsJobOutputValue('jobName') });
    terminalInfo.push({ label: "终端厂商", value: getCommonValue('firmName') });
    terminalInfo.push({ label: "终端型号", value: getIssueParamsJobOutputValue('terminalTypes') });
    terminalInfo.push({ label: "终端类型", value: getActivateTypeNames(getIssueParamsJobOutputValue('activateTypes')) });
    terminalInfo.push({ label: "银联间直连", value: getDictText(getIssueParamsJobOutputValue('cupConnMode'), 'unionpay_connection') });
    terminalInfo.push({ label: "业务类型", value: getDictText(getIssueParamsJobOutputValue('bussType'), 'buss_type') });
    terminalInfo.push({ label: "DCC交易指定类型", value: getDictText(getIssueParamsJobOutputValue('dccSupFlag'), 'dcc_sup_flag') });
    terminalInfo.push({ label: "增值终端", value: getDictText(getIssueParamsJobOutputValue('zzFlag'), 'zz_flag') });
    arr.push({ key: '终端信息', value: terminalInfo });
    const paramsInfo: any = []
    paramsInfo.push({ label: "参数模板编号", value: getTerminalParamTemplate('id')})
    paramsInfo.push({ label: "参数模板名称", value: getTerminalParamTemplate('templateName')})
    paramsInfo.push({ label: "适用机构", value: getTerminalParamTemplate('deptName')})
    paramsInfo.push({ label: "模板类型", value: getDictText(getTerminalParamTemplate('templateType'), 'acquiring_param_template_type')})
    paramsInfo.push({ label: "适应应用名称", value: getDictText(getTerminalParamTemplate('applicableAppType'), 'acquiring_param_belong_app')})
    arr.push({ key: '参数模板信息', value: paramsInfo});
    const validTimeInfo: any[] = [];
    validTimeInfo.push({ label: "有效起始日期", value: getIssueParamsJobOutputValue('validStartTime') });
    validTimeInfo.push({ label: "有效截止日期", value: getIssueParamsJobOutputValue('validEndTime') });
    arr.push({ key: '任务有效期', value: validTimeInfo });
    const updateTypeInfo: any[] = [];
    updateTypeInfo.push({ label: "更新通知方式", value: getIssueParamsJobOutputValue('showNotify') === 0 ? '静默安装' : '非静默安装' });
    updateTypeInfo.push({ label: "更新实时性", value: getIssueParamsJobOutputValue('isRealTime') === 0 ? '实时更新' : '空闲更新' });
    arr.push({ key: '更新方式', value: updateTypeInfo });
    const releaseTypeInfo: any[] = [];
    releaseTypeInfo.push({ label: "发布类型", value: getDictText(getIssueParamsJobOutputValue('releaseType'), 'release_type') });
    releaseTypeInfo.push({ label: "机构名称", value: getIssueParamsJobOutputValue('deptName') });
    releaseTypeInfo.push({ label: "升级范围", value: getDictText(getIssueParamsJobOutputValue('activateType'), 'activate_type') });
    releaseTypeInfo.push({ label: "组别过滤方式", value: getDictText(getIssueParamsJobOutputValue('isGroupUpdate'), 'is_group_update') });
    if (getIssueParamsJobOutputValue('isGroupUpdate') !== 0) {
      releaseTypeInfo.push({ label: "终端组别", value: getIssueParamsJobOutputValue('groupNames') });
    }
    if (getIssueParamsJobOutputValue('releaseType') === 0) {
      releaseTypeInfo.push({ label: "终端集合", value: getCommonValue('tusnList').join('，') });
    }
    arr.push({ key: '发布类型', value: releaseTypeInfo });
    setDetailArr(arr);
  }, [detail, res.loading]);

  /**
   * @todo 获取操作类型名称集合
   * @param activateTypes 
   */
  const getActivateTypeNames = (activateTypes: string) => {
    const arr = activateTypes.split(',');
    const strArr: string[] = [];
    for (let i = 0; i < arr.length; i++) {
      strArr.push(getDictText(arr[i], 'terminal_type'));
    }
    return strArr.join(',')
  }

  

  return (
    <Spin spinning={loading}>
      {detailArr.map((item: any, idx) => {
        const key = (item.key);;
        if (Array.isArray(item.value) && item.value.length > 0) {
          return (
            <Descriptions key={key} bordered title={`【${key}】`} column={2} style={{ marginBottom: 30 }}>
              {
                item.value.map((ele: any) => {
                  return (
                    <Descriptions.Item
                      key={ele.label}
                      label={<div style={{ width: 100 }}>{ele.label}</div>}
                    >
                      <div style={{ width: 200 }}>{ele.value}</div>
                    </Descriptions.Item>
                  )
                })
              }
            </Descriptions>
          )
        } else {
          return <div key={key} />
        }
      })}
    </Spin>
  )
}