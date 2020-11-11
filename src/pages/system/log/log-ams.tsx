import React, { useState } from 'react';
import { Form, Table, Spin } from 'antd';
import { useAntdTable } from 'ahooks';
import { formatListResult, formatPaginate } from '@/common/request-util';
import Forms from '@/component/form';
import { FormItem, FormItmeType } from '@/component/form/type';
import { createTableColumns, getStandardPagination } from '@/component/table';
import { amsAccessList } from './constants/api';

export default () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [form] = Form.useForm();
  const { tableProps, search }: any = useAntdTable(
    (paginatedParams, tableProps) => amsAccessList({ ...tableProps, ...formatPaginate(paginatedParams) }),
    { form, formatResult: formatListResult }
  );
  const { reset, submit } = search;

  const forms: FormItem[] = [
    {
      formName: 'termSeq',
      placeholder: '终端序列号',
      formType: FormItmeType.Normal,
    },
  ];

  const columns = createTableColumns([
    {
      title: '终端序列号',
      dataIndex: 'termSeq',
    },
    {
      title: '报文头时间戳',
      dataIndex: 'timestamp',
    },
    {
      title: '报文头随机数',
      dataIndex: 'random',
    },
    {
      title: '请求报文rul',
      dataIndex: 'url',
    },
    {
      title: '请求数据长度',
      dataIndex: 'requestLength',
    },
    {
      title: '响应数据长度',
      dataIndex: 'reponseLength',
    },
    {
      title: '执行结果',
      dataIndex: 'result',
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
