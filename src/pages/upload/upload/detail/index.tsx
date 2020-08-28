import React, { useEffect, useState } from 'react';
import { useQueryParam } from '@/common/request-util';
import { Spin, notification, Divider, Descriptions, Table } from 'antd';
import { RESPONSE_CODE } from '@/common/config';
import { taskDownloadJobDetail } from '../constants/api';
import { useDetail } from '@/pages/common/costom-hooks/use-detail';
import { createTableColumns } from '@/component/table';
import { useStore } from '@/pages/common/costom-hooks';
import { UseDictRenderHelper } from '@/component/table/render';
import { getDictText } from '../../common/util';
import { useSelectorHook } from '@/common/redux-util';

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
  useStore(['driver_type', 'download_task_type', 'release_type',
    'buss_type', 'unionpay_connection', 'dcc_sup_flag',
    'terminal_type', 'activate_type', 'is_group_update', 'zz_flag'
  ]);
  const dictList = useSelectorHook((state) => state.common.dictList);

  const [loading, setLoading] = useState(false);
  const [detailArr, setDetailArr] = useState([] as any[]);
  const { detail } = useDetail(id, taskDownloadJobDetail, setLoading);

  const getDownloadJobOutputValue = (key: string) => {
    return getObjectValue(detail, ['downloadJobOutput', key]);
  }

  const getCommonValue = (key: string) => {
    return getObjectValue(detail, [key]);
  }

  useEffect(() => {
    const arr: any[] = [];
    const terminalInfo: any = [];
    terminalInfo.push({ label: "任务名称", value: getDownloadJobOutputValue('jobName') });
    terminalInfo.push({ label: "终端厂商", value: getCommonValue('firmName') });
    terminalInfo.push({ label: "终端型号", value: getDownloadJobOutputValue('terminalTypes') });
    terminalInfo.push({ label: "终端类型", value: getActivateTypeNames(getDownloadJobOutputValue('activateTypes')) });
    terminalInfo.push({ label: "银联间直连", value: getDictText(getDownloadJobOutputValue('cupConnMode'), 'unionpay_connection') });
    terminalInfo.push({ label: "业务类型", value: getDictText(getDownloadJobOutputValue('bussType'), 'buss_type') });
    terminalInfo.push({ label: "DCC交易指定类型", value: getDictText(getDownloadJobOutputValue('dccSupFlag'), 'dcc_sup_flag') });
    terminalInfo.push({ label: "增值终端", value: getDictText(getDownloadJobOutputValue('zzFlag'), 'zz_flag') });
    arr.push({ key: '终端信息', value: terminalInfo });
    arr.push({ key: '软件信息', value: getDownloadJobOutputValue('downloadJobAppList') });
    const validTimeInfo: any[] = [];
    validTimeInfo.push({ label: "有效起始日期", value: getDownloadJobOutputValue('validStartTime') });
    validTimeInfo.push({ label: "有效截止日期", value: getDownloadJobOutputValue('validEndTime') });
    arr.push({ key: '任务有效期', value: validTimeInfo });
    const updateTypeInfo: any[] = [];
    updateTypeInfo.push({ label: "更新通知方式", value: getDownloadJobOutputValue('showNotify') === 0 ? '静默安装' : '非静默安装' });
    updateTypeInfo.push({ label: "更新实时性", value: getDownloadJobOutputValue('isRealTime') === 0 ? '实时更新' : '空闲更新' });
    arr.push({ key: '更新方式', value: updateTypeInfo });
    const releaseTypeInfo: any[] = [];
    releaseTypeInfo.push({ label: "发布类型", value: getDictText(getDownloadJobOutputValue('releaseType'), 'release_type') });
    releaseTypeInfo.push({ label: "机构名称", value: getDownloadJobOutputValue('deptName') });
    releaseTypeInfo.push({ label: "升级范围", value: getDictText(getDownloadJobOutputValue('activateType'), 'activate_type') });
    releaseTypeInfo.push({ label: "组别过滤方式", value: getDictText(getDownloadJobOutputValue('isGroupUpdate'), 'is_group_update') });
    if (getDownloadJobOutputValue('isGroupUpdate') !== 0) {
      releaseTypeInfo.push({ label: "终端组别", value: getDownloadJobOutputValue('groupNames') });
    }
    if (getDownloadJobOutputValue('releaseType') === 0) {
      releaseTypeInfo.push({ label: "终端集合", value: getDownloadJobOutputValue('tusns') });
    }
    arr.push({ key: '发布类型', value: releaseTypeInfo });
    setDetailArr(arr);
  }, [detail, dictList]);

  const getActivateTypeNames = (activateTypes: string) => {
    const arr = activateTypes.split(',');
    const strArr: string[] = [];
    console.log('test ttt', arr);
    for (let i = 0; i < arr.length; i++) {
      strArr.push(getDictText(arr[i], 'terminal_type'));
    }
    return strArr.join(',')
  }


  const columns: any[] = createTableColumns([
    {
      title: '软件包名',
      dataIndex: 'appCode',
    },
    {
      title: '软件名称',
      dataIndex: 'appName',
    },
    {
      title: '软件内部版本',
      dataIndex: 'versionCode',
    },
    {
      title: '应用版本',
      dataIndex: 'versionName',
    },
    {
      title: '成功',
      dataIndex: 'status',
      render: (item: any) => (<div style={{ color: '#468847' }}>{item || 0}</div>)
    },
    {
      title: '失败',
      dataIndex: 'status',
      render: (item: any) => (<div style={{ color: '#ce3739' }}>{item || 0}</div>)
    },
    {
      title: '待执行',
      dataIndex: 'status',
      render: (item: any) => (<div style={{ color: '#8FBC8F' }}>{item || 0}</div>)
    },
    {
      title: '执行中',
      dataIndex: 'status',
      render: (item: any) => (<div style={{ color: '#32CD32' }}>{item || 0}</div>)
    },
    {
      title: '支持终端类型',
      dataIndex: 'terminalTypes',
    },
    {
      title: '软件类型',
      dataIndex: 'appType',
      dictType: 'driver_type'
    },
    {
      title: '操作类型',
      dataIndex: 'actionType',
      dictType: 'download_task_type',
    },
    {
      title: '依赖软件',
      dataIndex: 'dependAppNames',
    },
  ]);

  return (
    <Spin spinning={loading}>
      {detailArr.map((item: any, idx) => {
        const key = (item.key);;
        if (Array.isArray(item.value) && item.value.length > 0) {
          if (key === '软件信息') {
            return (
              <div key={key} style={{ marginBottom: 30 }}>
                <div className={'ant-descriptions-title'}>{`【${key}】`}</div>
                <Table rowKey="id" bordered columns={columns} dataSource={item.value} pagination={false} scroll={{ x: 1400 }} />
              </div>
            )
          }
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