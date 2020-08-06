import React, { useState } from 'react';
import { Form, Table } from 'antd';
import { useAntdTable } from 'ahooks';
import { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { PlusOutlined, CopyOutlined } from '@ant-design/icons';
import { ButtonProps } from 'antd/lib/button';
import { terminalParamList } from './constants';
import { formatListResult } from '@/common/request-util';
import { createTableColumns } from '@/component/table';
import { FormItem, FormItmeType } from '@/component/form/type';
import Forms from '@/component/form';
import { useStore } from '@/pages/common/costom-hooks';

export default () => {
  useStore([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([] as any[]);

  const [form] = Form.useForm();
  const { tableProps, search }: any = useAntdTable(
    (paginatedParams: PaginatedParams, tableProps: any) => {
      return terminalParamList({ ...tableProps });
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
      title: '参数版本号',
      dataIndex: 'paramVersion',
    },
  ]);

  const extraButtons: any[] = [
    {
      title: '新增',
      type: 'primary',
      icon: <PlusOutlined />,
    },
    {
      title: '复制',
      type: 'primary',
      icon: <CopyOutlined />,
    },
  ];

  const onSelectChange = (keys: any[], selectedRows: any[]) => {
    console.log('selectedRowKeys:', keys);
    console.log('selectedRows:', selectedRows);
    setSelectedRowKeys(keys.concat(selectedRows));
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  console.log('rowSelection:', rowSelection);
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
      <Table rowSelection={rowSelection} columns={columns} {...tableProps} />
    </div>
  );
};
