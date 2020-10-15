import React from 'react';
import { Form, Table } from 'antd';
import { useAntdTable } from 'ahooks';
import { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { advertInfoList } from '../constants/api';
import { formatListResult } from '@/common/request-util';
import { useStore } from '@/pages/common/costom-hooks';
import Forms from '@/component/form';
import { FormItem, FormItmeType } from '@/component/form/type';
import { createTableColumns, getStandardPagination } from '@/component/table';
import history from '@/common/history-util';

type Props = {};

function Page(props: Props) {
  // 请求dept数据
  useStore(['advert_file_type', 'advert_type']);
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

  const onClick = (item: any) => {
    history.push(`/advertisement/review/detail?id=${item.id}`);
  };

  const columns = createTableColumns([
    {
      title: '操作',
      render: (key, item) => <a onClick={() => onClick(item)}>审核</a>,
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
      dataIndex: 'groupName',
      placeHolder: '无',
    },
    {
      title: '广告类型',
      dataIndex: 'type',
      dictType: 'advert_type',
    },
    {
      title: '广告文件类型',
      dataIndex: 'adFileType',
      dictType: 'advert_file_type',
    },
    {
      title: '有效起始时间',
      dataIndex: 'startTime',
    },
    {
      title: '审核状态',
      dataIndex: 'status',
      dictType: 'advert_status',
    },
  ]);

  const forms: FormItem[] = [
    {
      formName: 'deptId',
      formType: FormItmeType.TreeSelectCommon,
    },
    {
      formName: 'adName',
      placeholder: '广告名称',
      formType: FormItmeType.Normal,
    },
    {
      formName: 'adFileType',
      formType: FormItmeType.SelectCommon,
      dictList: 'advert_file_type',
    },
    {
      formName: 'adType',
      formType: FormItmeType.SelectCommon,
      dictList: 'advert_type',
    },
  ];

  return (
    <div>
      <Forms
        form={form}
        forms={forms}
        formButtonProps={{
          submit,
          reset,
        }}
      />
      <Table
        rowKey="id"
        columns={columns}
        {...tableProps}
        pagination={getStandardPagination(tableProps.pagination)}
      />
    </div>
  );
}
export default Page;
