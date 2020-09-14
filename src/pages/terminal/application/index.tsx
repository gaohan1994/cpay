import React, { useState } from 'react';
import { Form, Table, notification, Modal } from 'antd';
import invariant from 'invariant';
import { useAntdTable } from 'ahooks';
import { LogoutOutlined } from '@ant-design/icons';
import { ButtonProps } from 'antd/lib/button';
import { terminalAppList, terminalAppExport } from './constants';
import { formatListResult, formatPaginate } from '@/common/request-util';
import { createTableColumns, getStandardPagination } from '@/component/table';
import { FormItem, FormItmeType } from '@/component/form/type';
import Forms from '@/component/form';
import { RESPONSE_CODE, getDownloadPath } from '@/common/config';

export default () => {
  const [fetchField, setFetchField] = useState({} as any);

  const [form] = Form.useForm();
  const { tableProps, search }: any = useAntdTable(
    (paginatedParams: any, tableProps: any) => {
      setFetchField(tableProps);
      return terminalAppList({
        // ...formatPaginate(paginatedParams),
        ...tableProps,
      });
    },
    {
      form,
      formatResult: formatListResult,
    }
  );
  const { submit, reset } = search;

  const forms: FormItem[] = [
    {
      placeholder: '终端序列号',
      formName: 'tusn',
      formType: FormItmeType.Normal,
    },
    {
      placeholder: '应用包名',
      formName: 'appCode',
      formType: FormItmeType.Normal,
    },
    {
      placeholder: '应用名称',
      formName: 'appName',
      formType: FormItmeType.Normal,
    },
    {
      placeholder: '应用版本',
      formName: 'versionCode',
      formType: FormItmeType.Normal,
    },
    {
      placeholder: '外部版本',
      formName: 'versionName',
      formType: FormItmeType.Normal,
    },
  ].map((item): any => {
    return {
      ...item,
      span: 3,
    };
  });

  const exportList = async () => {
    Modal.confirm({
      title: '确认要导出终端应用信息？',
      onOk: async () => {
        try {
          console.log('fetchField:', fetchField);
          const result = await terminalAppExport(fetchField);
          invariant(result.code === RESPONSE_CODE.success, result.msg || ' ');

          const href = getDownloadPath(result.data);
          window.open(href, '_blank');
          notification.success({ message: '导出成功' });
        } catch (error) {
          notification.warn({ message: error.message });
        }
      },
      okText: '确定',
      cancelText: '取消',
    });
  };

  const columns = createTableColumns([
    {
      title: '终端序列号',
      dataIndex: 'tusn',
    },
    {
      title: '应用包名',
      dataIndex: 'appCode',
    },
    {
      title: '应用名称',
      dataIndex: 'appName',
    },
    {
      title: '应用版本',
      dataIndex: 'versionName',
    },
    {
      title: '内部版本',
      dataIndex: 'versionCode',
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
      />
    </div>
  );
};
