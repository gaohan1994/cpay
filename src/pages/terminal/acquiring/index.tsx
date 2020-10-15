import React, { useState } from 'react';
import { Form, Table, notification, Modal } from 'antd';
import { useAntdTable } from 'ahooks';
import invariant from 'invariant';
import { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { PlusOutlined, LogoutOutlined, CloseOutlined } from '@ant-design/icons';
import {
  terminalAcquiringList,
  terminalAcquiringRemove,
  terminalAcquiringExport,
} from './constants';
import { formatListResult } from '@/common/request-util';
import { createTableColumns, getStandardPagination } from '@/component/table';
import { FormItem, FormItmeType } from '@/component/form/type';
import Forms from '@/component/form';
import { useStore } from '@/pages/common/costom-hooks';
import history from '@/common/history-util';
import { RESPONSE_CODE, getDownloadPath } from '@/common/config';

export default () => {
  useStore([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([] as any[]);

  const [form] = Form.useForm();
  const { tableProps, search }: any = useAntdTable(
    (paginatedParams: PaginatedParams, tableProps: any) => {
      return terminalAcquiringList({ ...tableProps });
    },
    {
      form,
      formatResult: formatListResult,
    }
  );
  const { submit, reset } = search;

  const onAdd = () => {
    history.push(`/terminal/acquiring/detail`);
  };

  const onEdit = (item: any) => {
    history.push(`/terminal/acquiring/detail?id=${item.id}`);
  };

  const onExport = async () => {
    try {
      const result = await terminalAcquiringExport({} as any);
      invariant(result.code === RESPONSE_CODE.success, result.msg || ' ');

      const href = getDownloadPath(result.data);
      // window.open(href, '_blank');
      notification.success({ message: '导出成功' });
    } catch (error) {
      notification.warn({ message: error.message });
    }
  };

  const onDelete = async () => {
    try {
      invariant(selectedRowKeys.length > 0, '请选择要删除的参数');

      Modal.confirm({
        title: '提示',
        content: `确认要删除当前机构的参数吗?`,
        okText: '确定',
        cancelText: '取消',
        onOk: async () => {
          try {
            const result = await terminalAcquiringRemove({
              ids: selectedRowKeys.join(','),
            });
            setSelectedRowKeys([]);
            invariant(result.code === RESPONSE_CODE.success, result.msg || ' ');
            notification.success({ message: '删除成功!' });
            submit();
          } catch (error) {
            notification.warn({ message: error.message });
          }
        },
      });
    } catch (error) {
      notification.warn({ message: error.message });
    }
  };

  const forms: FormItem[] = [
    {
      formName: 'paramCode',
      formType: FormItmeType.Normal,
      placeholder: '参数编号',
    },
    {
      formName: 'paramName',
      formType: FormItmeType.Normal,
      placeholder: '参数名称',
    },
  ];

  const columns = createTableColumns([
    {
      title: '操作',
      render: (item) => (
        <div>
          <a onClick={() => onEdit(item)}>修改</a>
        </div>
      ),
      fixed: 'left',
      width: 60,
    },
    {
      title: '应用类型',
      dataIndex: 'applicableAppType',
    },
    {
      title: '参数编号',
      dataIndex: 'paramCode',
    },
    {
      title: '参数名称',
      dataIndex: 'paramName',
    },
    {
      title: '参数类型',
      dataIndex: 'paramType',
    },
    {
      title: '长度',
      dataIndex: 'paramLength',
    },
    {
      title: '枚举值',
      dataIndex: 'enumValue',
    },
    {
      title: '小数位数',
      dataIndex: 'decimalPlaces',
    },
  ]);

  const rowSelection = {
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
      title: '导出',
      icon: <LogoutOutlined />,
      type: 'primary',
      onClick: onExport,
    },
    {
      title: '删除',
      type: 'primary',
      icon: <CloseOutlined />,
      onClick: () => onDelete(),
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
