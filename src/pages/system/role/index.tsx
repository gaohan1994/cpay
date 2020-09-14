/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-09-11 15:19:51 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-09-14 14:06:57
 * 
 * @todo 角色管理页面
 */
import React, { useState } from 'react';
import { Form, Table, Divider, Spin } from 'antd';
import { useAntdTable } from 'ahooks';
import { formatListResult } from '@/common/request-util';
import { useStore } from '@/pages/common/costom-hooks';
import Forms from '@/component/form';
import { createTableColumns } from '@/component/table';
import history from '@/common/history-util';
import { PlusOutlined, LogoutOutlined } from '@ant-design/icons';
import { systemRoleList } from '../role/constants/api';

type Props = {};

function Page(props: Props) {
  // 请求dept数据
  useStore([]);

  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [form] = Form.useForm();
  const { tableProps, search }: any = useAntdTable(
    (paginatedParams: any, tableProps: any) => {
      return systemRoleList({
        ...tableProps
      });
    },
    {
      form,
      formatResult: formatListResult,
    }
  );
  const { submit, reset } = search;

  /**
   * @todo 自定义查询，把选中列表置空
   */
  const customSubmit = () => {
    setSelectedRowKeys([]);
    submit();
  }

  /**
   * @todo 自定义重置，把选中列表置空
   */
  const customReset = () => {
    setSelectedRowKeys([]);
    reset();
  }

  const onEdit = (item: any) => {
    history.push(`/system/role-add?id=${item.roleId}`);
  }

  const onRemove = (item: any) => {

  }

  /**
   * @todo 创建table的列
   */
  const columns = createTableColumns([
    {
      title: '操作',
      render: (key, item) => (
        <div>
          <a onClick={() => onEdit(item)}>修改</a>
          <Divider type="vertical" />
          <a onClick={() => onRemove(item)}>删除</a>
        </div>
      ),
      fixed: 'left',
      align: 'center',
      width: 120,
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
  ]);

  const onAdd = () => {
    history.push(`/system/role-add`);
  }

  const onMenuAuth = () => {

  }

  const onFunctionAuth = () => {

  }

  const extraButtons = [
    { title: '新增', onClick: onAdd, icon: <PlusOutlined />, type: "primary" as any, },
    { title: '菜单授权', onClick: onMenuAuth },
    { title: '功能授权', onClick: onFunctionAuth },
  ]

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
    type: 'radio'
  };

  return (
    <Spin spinning={loading}>
      <Forms
        form={form}
        forms={[]}
        formButtonProps={{
          extraButtons
        }}
      />
      <Table
        rowKey="roleId"
        rowSelection={rowSelection}
        columns={columns}
        {...tableProps}
        pagination={false}
      />
    </Spin>
  );
}
export default Page;

