import React, { useEffect } from 'react';
import { Form, Table } from 'antd';
import { useAntdTable, useMount } from 'ahooks';
import { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { advertInfoList } from '../constants/api';
import { formatListResult } from '@/common/request-util';

import AdvertisementForm from '../component/form';
import { useStore } from '@/pages/common/costom-hooks';

type Props = {};

function Page(props: Props) {
  // 请求dept数据
  useStore('advert');
  const [form] = Form.useForm();

  const { tableProps, search }: any = useAntdTable(
    (paginatedParams: PaginatedParams, tableProps: any) =>
      advertInfoList({ ...paginatedParams, ...tableProps }),
    {
      form,
      formatResult: formatListResult,
    }
  );

  const { submit, reset } = search;
  const columns = [
    {
      title: '操作',
      render: () => <a>审核</a>,
      fixed: 'left',
    },
    {
      title: '广告名称',
      dataIndex: 'adName',
    },
    {
      title: '所属机构',
      dataIndex: 'deptName',
    },
    {
      title: '组别名称',
      dataIndex: 'groupId',
    },
    {
      title: '广告类型',
      dataIndex: 'adFileType',
    },
    {
      title: '广告文件类型',
      dataIndex: 'adFileType',
    },
    {
      title: '有效起始时间',
      dataIndex: 'createTime',
    },
    {
      title: '审核状态',
      dataIndex: 'status',
    },
  ].map((item) => {
    return {
      ...item,
      key: item.title,
    };
  });

  return (
    <div>
      <AdvertisementForm form={form} submit={submit} reset={reset} />
      <Table columns={columns} {...tableProps} />
    </div>
  );
}
export default Page;
