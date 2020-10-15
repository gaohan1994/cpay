import React, { useState } from 'react';
import { Form, Table, notification, Modal } from 'antd';
import invariant from 'invariant';
import { useAntdTable } from 'ahooks';
import { LogoutOutlined } from '@ant-design/icons';
import { ButtonProps } from 'antd/lib/button';
import { terminalSysdetailList, terminalSysdetailExport } from './constants';
import { formatListResult, formatPaginate } from '@/common/request-util';
import { createTableColumns, getStandardPagination } from '@/component/table';
import { FormItem, FormItmeType } from '@/component/form/type';
import Forms from '@/component/form';
import { RESPONSE_CODE, BASE_URL, getDownloadPath } from '@/common/config';

export default () => {
  const [fetchField, setFetchField] = useState({} as any);

  const [form] = Form.useForm();
  const { tableProps, search }: any = useAntdTable(
    (paginatedParams: any, fetchProps: any) => {
      console.log('tableProps', fetchProps);
      return terminalSysdetailList({
        ...formatPaginate(paginatedParams),
        ...fetchProps,
      } as any);
    },
    {
      form,
      formatResult: formatListResult,
    }
  );
  const { submit, reset } = search;

  const exportList = async () => {
    Modal.confirm({
      title: '确认要导出终端系统信息？',
      onOk: async () => {
        try {
          const result = await terminalSysdetailExport({} as any);
          invariant(result.code === RESPONSE_CODE.success, result.msg || ' ');

          const href = getDownloadPath(result.data);
          // window.open(href, '_blank');
          notification.success({ message: '导出成功' });
        } catch (error) {
          notification.warn({ message: error.message });
        }
      },
      okText: '确定',
      cancelText: '取消',
    });
  };

  const forms: FormItem[] = [
    {
      formType: FormItmeType.Normal,
      placeholder: '终端序列号',
      formName: 'tusn',
    },
    {
      formType: FormItmeType.Normal,
      placeholder: '系统版本',
      formName: 'osVersion',
    },
    {
      formType: FormItmeType.Normal,
      placeholder: '安全模块版本',
      formName: 'safeModelVersion',
    },
    {
      formType: FormItmeType.Normal,
      placeholder: 'Android版本',
      formName: 'androidVersion',
    },
    {
      formType: FormItmeType.Normal,
      placeholder: '运维SDK版本',
      formName: 'tmsSdk',
    },
    {
      formType: FormItmeType.Normal,
      placeholder: '收单SDK版本',
      formName: 'paySdk',
    },
    {
      formType: FormItmeType.Normal,
      placeholder: 'EMV版本',
      formName: 'emvVersion',
    },
    {
      formType: FormItmeType.Normal,
      placeholder: '收单应用包名',
      formName: 'payAppCode',
    },
    {
      formType: FormItmeType.Normal,
      placeholder: '收单应用名称',
      formName: 'payAppName',
    },
    {
      formType: FormItmeType.Normal,
      placeholder: '收单内部版本',
      formName: 'payAppVersion',
    },
    {
      formType: FormItmeType.Normal,
      placeholder: '收单外部版本',
      formName: 'payAppVersionOutside',
    },
    {
      formType: FormItmeType.Normal,
      placeholder: 'POS管家内部版本',
      formName: 'tmsAppVersion',
    },
    {
      formType: FormItmeType.Normal,
      placeholder: 'POS管家外部版本',
      formName: 'tmsAppVersionOutside',
    },
    {
      formType: FormItmeType.Normal,
      placeholder: '网络类型',
      formName: 'networkType',
    },
  ];

  const columns = createTableColumns([
    {
      title: '终端序列号',
      dataIndex: 'tusn',
      width: 250,
    },
    {
      title: '系统版本',
      dataIndex: 'osVersion',
    },
    {
      title: '安全模块版本',
      width: 240,
      dataIndex: 'safeModelVersion',
    },
    {
      title: 'Android版本',
      dataIndex: 'androidVersion',
    },
    {
      title: '运维SDK版本',
      dataIndex: 'tmsSdk',
    },
    {
      title: '收单SDK版本',
      dataIndex: 'paySdk',
    },
    {
      title: 'EMV版本',
      dataIndex: 'emvVersion',
    },
    {
      title: '收单应用包名',
      dataIndex: 'payAppCode',
    },
    {
      title: '收单应用名称',
      dataIndex: 'payAppName',
    },
    {
      title: '收单内部版本',
      dataIndex: 'payAppVersion',
    },
    {
      title: '收单外部版本',
      dataIndex: 'payAppVersionOutside',
    },
    {
      title: 'POS管家内部版本',
      dataIndex: 'tmsAppVersion',
    },
    {
      title: 'POS管家外部版本',
      dataIndex: 'tmsAppVersionOutside',
    },
    {
      title: '网络类型',
      dataIndex: 'networkType',
      render: (item: any) => {
        const net = Number(item);
        return <span>{net === 0 ? '公网' : net === 1 ? '专网' : '未知'}</span>;
      },
    },
  ]);

  const extraButtons: ButtonProps[] = [
    {
      title: '导出',
      icon: <LogoutOutlined />,
      type: 'primary',
      onClick: exportList,
    },
  ];
  console.log('tableProps:', tableProps);
  return (
    <div>
      <Forms
        form={form}
        forms={forms}
        formButtonProps={{
          reset,
          submit,
          extraButtons,
        }}
      />
      <Table
        style={{ overflowX: 'auto' }}
        columns={columns}
        {...tableProps}
        pagination={getStandardPagination(tableProps.pagination)}
        scroll={{ x: 3200 }}
      />
    </div>
  );
};
