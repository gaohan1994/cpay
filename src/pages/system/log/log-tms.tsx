import React, { useState } from 'react';
import { Form, Table, Spin } from 'antd';
import { useAntdTable } from 'ahooks';
import { formatListResult, formatPaginate } from '@/common/request-util';
import Forms from '@/component/form';
import { FormItem, FormItmeType } from '@/component/form/type';
import { createTableColumns, getStandardPagination } from '@/component/table';
import { tmsAccessList } from './constants/api';

export default () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [form] = Form.useForm();
  const { tableProps, search }: any = useAntdTable(
    (paginatedParams, tableProps) => tmsAccessList({ ...tableProps, ...formatPaginate(paginatedParams) }),
    { form, formatResult: formatListResult }
  );
  const { reset, submit } = search;

  const forms: FormItem[] = [
    {
      formName: 'termSeq',
      placeholder: '终端序列号',
      formType: FormItmeType.Normal,
    },
    {
      formName: 'messageCode',
      placeholder: '消息码',
      formType: FormItmeType.Normal,
    },
  ];

  const columns = createTableColumns([
    {
      title: '终端序列号',
      dataIndex: 'termSeq',
    },
    {
      title: '时间戳',
      dataIndex: 'timestamp',
    },
    {
      title: '随机数',
      dataIndex: 'random',
    },
    {
      title: '消息码',
      dataIndex: 'messageCode',
    },
    {
      title: '请求字节数',
      dataIndex: 'requestLength',
    },
    {
      title: '响应字节数',
      dataIndex: 'reponseLength',
    },
    {
      title: '状态',
      dataIndex: 'state',
    },
  ]);

  return (
    <Spin spinning={loading}>
      <Forms form={form} forms={forms} formButtonProps={{ reset, submit }} />
      <Table
        rowKey={'id'}
        columns={columns}
        {...tableProps}
        pagination={getStandardPagination(tableProps.pagination)}
      />
    </Spin>
  );
};
