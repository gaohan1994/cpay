import React, { useState } from 'react';
import { Form, Table, notification, Modal, Divider } from 'antd';
import { useAntdTable } from 'ahooks';
import invariant from 'invariant';
import { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { PlusOutlined, CopyOutlined } from '@ant-design/icons';
import { ButtonProps } from 'antd/lib/button';
import { terminalParamList, terminalParamRemove } from './constants';
import { formatListResult, formatPaginate } from '@/common/request-util';
import { createTableColumns, getStandardPagination } from '@/component/table';
import { FormItem, FormItmeType } from '@/component/form/type';
import Forms from '@/component/form';
import { useStore } from '@/pages/common/costom-hooks';
import history from '@/common/history-util';
import { DetailType } from './types';
import { RESPONSE_CODE } from '@/common/config';

export default () => {
  useStore([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([] as any[]);

  const [form] = Form.useForm();
  const { tableProps, search }: any = useAntdTable(
    (paginatedParams: PaginatedParams[0], tableProps: any) => {
      return terminalParamList({ ...tableProps, ...formatPaginate(paginatedParams)});
    },
    {
      form,
      formatResult: formatListResult,
    }
  );
  const { submit, reset } = search;

  const onCopy = () => {
    try {
      invariant(selectedRowKeys.length === 1, '请选择一条记录');
      history.push(
        `/terminal/params/detail?id=${selectedRowKeys[0]}&type=${DetailType.COPY}`
      );
    } catch (error) {
      notification.warn({ message: error.message });
    }
  };

  const onAdd = () => {
    history.push(`/terminal/params/detail?type=${DetailType.ADD}`);
  };

  const onEdit = (item: any) => {
    history.push(
      `/terminal/params/detail?id=${item.id}&type=${DetailType.EDIT}`
    );
  };

  const onDelete = async (item: any) => {
    setSelectedRowKeys([item.id]);
    Modal.confirm({
      title: '提示',
      content: `确认要删除当前机构的参数吗?`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          const result = await terminalParamRemove(item.id);
          invariant(result.code === RESPONSE_CODE.success, result.msg || ' ');
          notification.success({ message: '删除成功!' });
          submit();
        } catch (error) {
          notification.warn({ message: error.message });
        }
      },
    });
  };

  const forms: FormItem[] = [
    {
      formName: 'deptId',
      formType: FormItmeType.TreeSelectCommon,
    },
  ];

  const columns = createTableColumns([
    {
      title: '操作',
      render: (item) => (
        <div>
          <a onClick={() => onEdit(item)}>修改</a>
          <Divider type='vertical' />
          <a onClick={() => onDelete(item)}>删除</a>
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
    },
    {
      title: '参数版本号',
      dataIndex: 'paramVersion',
    },
  ]);

  const rowSelection = {
    type: 'radio',
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  const extraButtons: any[] = [
    {
      title: '新增',
      type: 'primary',
      icon: <PlusOutlined />,
      onClick: onAdd,
    },
    {
      title: '复制',
      type: 'primary',
      icon: <CopyOutlined />,
      onClick: onCopy,
    },
  ];

  const formButtons = {
    reset: () => {
      reset();
      setSelectedRowKeys([]);
    },
    submit: () => {
      setSelectedRowKeys([]);
      submit();
    },
    extraButtons,
  };
  return (
    <div>
      <Forms form={form} forms={forms} formButtonProps={formButtons} />
      <Table
        rowKey="id"
        rowSelection={rowSelection}
        columns={columns}
        {...tableProps}
        pagination={getStandardPagination(tableProps.pagination)}
      />
    </div>
  );
};
