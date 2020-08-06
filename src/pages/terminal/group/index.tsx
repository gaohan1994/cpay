import React from 'react';
import { Form, Table } from 'antd';
import { useAntdTable } from 'ahooks';
import { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { PlusOutlined } from '@ant-design/icons';
import { terminalGroupList } from './constants';
import { formatListResult } from '@/common/request-util';
import { createTableColumns } from '@/component/table';
import { FormItem, FormItmeType } from '@/component/form/type';
import Forms from '@/component/form';
import { useStore } from '@/pages/common/costom-hooks';
import { formatPaginate } from '@/common/request-util';

export default () => {
  useStore([]);
  const [form] = Form.useForm();
  const { tableProps, search }: any = useAntdTable(
    (paginatedParams: PaginatedParams[0], tableProps: any) => {
      return terminalGroupList({
        ...formatPaginate(paginatedParams),
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
      formName: 'deptId',
      formType: FormItmeType.TreeSelectCommon,
      span: 4,
    },
    {
      formName: 'name',
      formType: FormItmeType.Normal,
      placeholder: '组别名称',
    },
  ];

  const columns = createTableColumns([
    {
      title: '操作',
      render: () => (
        <div>
          <a>修改</a>
          {` | `}
          <a>删除</a>
        </div>
      ),
      fixed: 'left',
      width: 100,
    },
    {
      title: '所属机构',
      dataIndex: 'deptName',
    },
    {
      title: '组别名称',
      dataIndex: 'groupName',
      render: (key: any, item: any) => (
        <span>{!!item['groupName'] || '--'}</span>
      ),
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
  ]);

  const extraButtons: any[] = [
    {
      title: '新增',
      type: 'primary',
      icon: <PlusOutlined />,
    },
  ];

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
      <Table columns={columns} {...tableProps} />
    </div>
  );
};
