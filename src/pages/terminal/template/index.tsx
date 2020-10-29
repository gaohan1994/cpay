/**
 * 参数模板
 * @Author: centerm.gaohan 
 * @Date: 2020-10-14 09:54:41 
 * @Last Modified by: centerm.gaohan
 * @Last Modified time: 2020-10-16 15:59:20
 */
import React, { useState } from 'react';
import { Form, Table, notification, Modal, Divider } from 'antd';
import { useAntdTable } from 'ahooks';
import invariant from 'invariant';
import { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { PlusOutlined, CopyOutlined } from '@ant-design/icons';
import { ButtonProps } from 'antd/lib/button';
import { terminalTemplateList, terminalTemplateRemove } from './constants';
import { formatListResult, formatPaginate } from '@/common/request-util';
import { createTableColumns, getStandardPagination } from '@/component/table';
import { FormItem, FormItmeType } from '@/component/form/type';
import Forms from '@/component/form';
import { useStore } from '@/pages/common/costom-hooks';
import history from '@/common/history-util';
import { RESPONSE_CODE } from '@/common/config';

export default () => {
  const { deptList } = useStore(['acquiring_param_belong_app', 'acquiring_param_template_type']);
  const [selectedRowKeys, setSelectedRowKeys] = useState([] as any[]);

  const [form] = Form.useForm();
  const { tableProps, search }: any = useAntdTable(
    (paginatedParams: PaginatedParams[0], tableProps: any) => {
      return terminalTemplateList({ ...tableProps,  ...formatPaginate(paginatedParams)});
    },
    {
      form,
      formatResult: formatListResult,
    }
  );
  const { submit, reset } = search;

  const onAdd = () => {
    history.push(`/terminal/template/add`);
  };

  const onEdit = (item: any) => {
    history.push(`/terminal/template/edit?id=${item.id}`);
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
          const result = await terminalTemplateRemove({ ids: item.id });
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
      placeholder: '适用机构',
      formType: FormItmeType.TreeSelectCommon,
    },
    {
      formName: 'templateName',
      formType: FormItmeType.Normal,
      placeholder: '请输入参数模板名称'
    },
    {
      formName: 'templateName',
      formType: FormItmeType.Normal,
      placeholder: '模板编号'
    },
    {
      formName: 'templateType',
      placeholder: '模板类型',
      formType: FormItmeType.SelectCommon,
      dictList: 'acquiring_param_template_type',
    },
    {
      formName: 'applicableAppType',
      placeholder: '适用应用名称',
      formType: FormItmeType.SelectCommon,
      dictList: 'acquiring_param_belong_app',
    },
  ];

  const columns = createTableColumns([
    {
      title: '操作',
      render: (item) => (
        <div>
          <a onClick={() => onEdit(item)}>修改</a>
          <Divider type="vertical" />
          <a onClick={() => onDelete(item)}>删除</a>
        </div>
      ),
    },
    {
      title: '模板编号',
      dataIndex: 'id',
    },
    {
      title: '参数模板名称',
      dataIndex: 'templateName',
    },
    {
      title: '适用机构',
      dataIndex: 'deptId',
      render: (deptId: any) => {
        const currentDept = deptList.find(d => d.id === deptId);
        return <span>{currentDept?.name || '--'}</span>
      }
    },
    {
      title: '模板类型',
      dataIndex: 'templateType',
      dictType: 'acquiring_param_template_type'
    },
    {
      title: '适用应用名称',
      dataIndex: 'applicableAppType',
      dictType: 'acquiring_param_belong_app'
    },
    {
      title: '新增时间',
      dataIndex: 'createTime',
    },
    {
      title: '新增用户',
      dataIndex: 'createBy',
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
