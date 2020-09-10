import React, { useState } from 'react';
import { Form, Table, Input, Col, Button, notification, Modal } from 'antd';
import { useAntdTable } from 'ahooks';
import { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { PlusOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { formatListResult } from '@/common/request-util';
import { createTableColumns } from '@/component/table';
import { FormItem, FormItmeType } from '@/component/form/type';
import Forms from '@/component/form';
import { useStore } from '@/pages/common/costom-hooks';
import { formatPaginate } from '@/common/request-util';
import { RESPONSE_CODE, getDownloadPath, BASE_URL } from '@/common/config';
import invariant from 'invariant';
import { terminalFirmList } from '../constants';
import { changeStatus } from './constants';
import { useHistory } from 'react-router-dom';
export default () => {
  useStore([]);
  const history = useHistory();
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState([] as any[]); // 选中的列的key值列表
  const { tableProps, search }: any = useAntdTable(
    (paginatedParams: PaginatedParams[0], tableProps: any) => {
      return terminalFirmList({
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
      formName: 'code',
      placeholder: '厂商代码',
      formType: FormItmeType.Normal,
    },
    {
      placeholder: '厂商名称',
      formName: 'firmName',
      formType: FormItmeType.Normal,
    },
  ];

  const onDownload = async (id: any) => {
    try {
      const href = `${BASE_URL}/cpay-admin/terminal/firm/downloadPublicKey/${id}`;
      window.open(href, '_blank');
      notification.success({ message: '下载成功！' });
    } catch (error) {
      notification.warn({ message: error.message });
    }
  };

  const editFactory = async (type: string) => {
    try {
      console.log('selectedRowKeys:', selectedRowKeys);
      invariant(
        selectedRowKeys && selectedRowKeys.length === 1,
        '请选择一条记录'
      );
      const isOpen = type === 'open';
      const payload = {
        id: selectedRowKeys[0],
        status: isOpen ? 0 : 1,
      };
      const result = await changeStatus(payload);
      invariant(result.code === RESPONSE_CODE.success, result.msg || ' ');
      notification.success({ message: `${isOpen ? '启用' : '停用'}成功` });
      submit();
    } catch (error) {
      notification.warn({ message: error.message });
    }
  };

  const columns = createTableColumns([
    {
      title: '操作',
      render: (item: any) => (
        <div>
          <a onClick={() => onEdit(item)}>修改</a>
          {` | `}
          <a onClick={() => onDelete(item.id)}>删除</a>
        </div>
      ),
      fixed: 'left',
      width: 100,
    },
    {
      title: '厂商代码',
      dataIndex: 'code',
    },
    {
      title: '厂商名称',
      dataIndex: 'firmName',
    },
    {
      title: 'TUSN标识',
      dataIndex: 'tusnHeader',
    },
    {
      title: '公钥下载',
      dataIndex: 'id',
      render: (id) => {
        return <a onClick={() => onDownload(id)}>下载</a>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (status: any) => {
        return <span>{status === 0 ? '已启用' : '已停用'}</span>;
      },
    },
  ]);

  const extraButtons: any[] = [
    {
      title: '新增',
      type: 'primary',
      icon: <PlusOutlined />,
      onClick: () => {},
    },
    {
      title: '启用',
      type: 'primary',
      icon: <CheckOutlined />,
      onClick: () => editFactory('open'),
    },
    {
      title: '停用',
      type: 'primary',
      icon: <CloseOutlined />,
      onClick: () => editFactory(''),
    },
  ];

  const onAdd = async (values: any) => {
    try {
      submit();
    } catch (error) {
      notification.warn({ message: error.message });
    }
  };

  const rowSelection = {
    type: 'radio',
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  const onDelete = async (id: string) => {
    Modal.confirm({
      title: '提示',
      content: `确认要删除选中的组别么?`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          submit();
        } catch (error) {
          notification.warn({ message: error.message });
        }
      },
    });
  };

  const onEdit = async (item: any) => {
    console.log('edit');
    history.push(`/terminal/factory-edit?id=${item.id}`);
  };
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
        rowKey="id"
        rowSelection={rowSelection}
        columns={columns}
        {...tableProps}
      />
    </div>
  );
};
