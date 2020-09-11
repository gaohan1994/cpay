/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-09-11 14:21:23 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-09-11 16:13:14
 * 
 * @todo 用户管理
 */
import React, { useState, useEffect } from 'react';
import { Form, Table, Divider, notification, Modal, Spin } from 'antd';
import { useAntdTable } from 'ahooks';
import { formatListResult } from '@/common/request-util';
import { useStore } from '@/pages/common/costom-hooks';
import Forms from '@/component/form';
import { FormItem, FormItmeType } from '@/component/form/type';
import { createTableColumns, getStandardPagination } from '@/component/table';
import history from '@/common/history-util';
import { PlusOutlined, LogoutOutlined } from '@ant-design/icons';
import { systemUserList, systemUserChangeStatus } from './constants/api';
import { renderSelectForm } from '@/component/form/render';
import { systemRoleList } from '../role/constants/api';
import invariant from 'invariant';
import { RESPONSE_CODE } from '@/common/config';

type Props = {};

function Page(props: Props) {
  // 请求dept数据
  useStore([]);

  const [loading, setLoading] = useState(false);
  const [roleList, setRoleList] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [form] = Form.useForm();
  const { tableProps, search }: any = useAntdTable(
    (paginatedParams: any, tableProps: any) =>
      systemUserList({ pageSize: paginatedParams.pageSize, pageNum: paginatedParams.current, ...tableProps }),
    {
      form,
      formatResult: formatListResult,
    }
  );
  const { submit, reset } = search;

  useEffect(() => {
    systemRoleList({}, (result: any) => {
      if (result.data && result.data.rows) {
        setRoleList(result.data.rows);
      }
    });
  }, []);

  const onEdit = (item: any) => {

  }

  /**
   * @todo 删除软件信息
   * @param item 
   */
  const onRemove = async (item: any) => {
    Modal.confirm({
      title: '提示',
      content: `确认要删除当前软件吗?`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          const param = {
            ids: item.id
          }
          setLoading(true);
          // const result = await softInfoRemove(param);
          setLoading(false);
          // invariant(result && result.code === RESPONSE_CODE.success, result && result.msg || '删除软件信息失败，请重试');
          notification.success({ message: '删除软件信息成功!' });
          submit();
        } catch (error) {
          notification.warn({ message: error.message });
        }
      },
    });
  }

  const onChangeStatus = (item: any) => {
    const operateText = item.status === 0 ? '停用' : '启用'
    Modal.confirm({
      title: '提示',
      content: `确认要${operateText}当前用户吗?`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          const param = {
            userId: item.userId,
            status: item.status === 0 ? 1 : 0,
          }
          setLoading(true);
          const result = await systemUserChangeStatus(param);
          setLoading(false);
          invariant(result && result.code === RESPONSE_CODE.success, result && result.msg || `${operateText}用户失败！`);
          notification.success({ message: `${operateText}用户成功!` });
          submit();
        } catch (error) {
          notification.warn({ message: error.message });
        }
      },
    });
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
          <Divider type="vertical" />
          {
            item.status === 0
              ? <a onClick={() => onChangeStatus(item)}>停用</a>
              : <a onClick={() => onChangeStatus(item)}>启用</a>
          }
        </div>
      ),
      fixed: 'left',
      align: 'center',
      width: 150,
    },
    {
      title: '用户名',
      dataIndex: 'loginName',
    },
    {
      title: '用户真实姓名',
      dataIndex: 'userName',
    },
    {
      title: '所属角色',
      dataIndex: 'roles',
      render: () => '--'
    },
    {
      title: '机构名称',
      dataIndex: 'dept',
      render: (dept: any) => dept.deptName
    },
    {
      title: '电话号码',
      dataIndex: 'phone',
    },
  ]);

  /**
   * @todo table查询表单
   */
  const forms: FormItem[] = [
    {
      formName: 'deptId',
      formType: FormItmeType.TreeSelectCommon,
    },
    {
      formName: 'loginName',
      placeholder: '用户名',
      formType: FormItmeType.Normal,
    },
    {
      formName: 'userName',
      placeholder: '用户真实姓名',
      formType: FormItmeType.Normal,
    },
    {
      formName: 'roleIds',
      formType: FormItmeType.Normal,
      render: () =>
        renderSelectForm({
          formName: 'roleIds',
          placeholder: '所属角色',
          selectData:
            (roleList &&
              roleList.map((item: any) => {
                return {
                  title: item.roleName,
                  value: item.roleId,
                } as any;
              })) ||
            [],
          formType: FormItmeType.Select,
        }),
    },
  ];

  /**
   * @todo 跳转到新增页面
   */
  const onAdd = () => {
    history.push('/system/user-add');
  }

  const onResetPassword = () => {
    if (selectedRowKeys.length === 0) {
      notification.error({ message: '请选择用户！' });
      return;
    }
  }

  const onExport = () => {
    Modal.confirm({
      title: '确认要导出终端信息？',
      onOk: async () => {
        try {
          // const result = await terminalShiftExport({});
          // invariant(result.code === RESPONSE_CODE.success, result.msg || ' ');

          // const href = getDownloadPath(result.data);
          // window.open(href, '_blank');
          // notification.success({ message: '导出成功' });
        } catch (error) {
          notification.warn({ message: error.message });
        }
      },
      okText: '确定',
      cancelText: '取消',
    });
  };

  const extraButtons = [
    { title: '新增', onClick: onAdd, icon: <PlusOutlined />, type: "primary" as any, },
    { title: '密码重置', onClick: onResetPassword },
    { title: '导出', onClick: onExport, icon: <LogoutOutlined />, type: "primary" as any, },
  ]

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  return (
    <Spin spinning={loading}>
      <Forms
        form={form}
        forms={forms}
        formButtonProps={{
          submit,
          reset,
          extraButtons
        }}
      />
      <Table
        rowKey="userId"
        columns={columns}
        rowSelection={rowSelection}
        {...tableProps}
        pagination={getStandardPagination(tableProps.pagination)}
      />
    </Spin>
  );
}
export default Page;

