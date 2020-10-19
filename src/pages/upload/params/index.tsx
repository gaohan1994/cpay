/*
 * @Author: centerm.gaohan 
 * @Date: 2020-10-19 11:08:28 
 * @Last Modified by: centerm.gaohan
 * @Last Modified time: 2020-10-19 13:44:11
 */

import React, { useState, useEffect } from 'react';
import { Form, Table, Tag, Divider, notification, Modal, Spin } from 'antd';
import { useAntdTable } from 'ahooks';
import { formatListResult } from '@/common/request-util';
import { useStore } from '@/pages/common/costom-hooks';
import Forms from '@/component/form';
import { FormItem, FormItmeType } from '@/component/form/type';
import { createTableColumns, getStandardPagination } from '@/component/table';
import { issueJobList } from '../constants/api';
import { PlusOutlined, CopyOutlined, BarsOutlined, CaretRightOutlined, PauseOutlined } from '@ant-design/icons';
import { RESPONSE_CODE } from '@/common/config';
import history from '@/common/history-util';
import { ITerminalFirmItem, ITerminalType } from '@/pages/terminal/types';
import {
  terminalFirmList as getTerminalFirmList,
  terminalTypeListByFirm,
} from '@/pages/terminal/constants';
import { getTaskJobStatusColor } from '../common/util';
import invariant from 'invariant';
import { useHistory } from 'react-router-dom';

export default () => {
  const history = useHistory();
  const { deptList } = useStore([]);
  const [form] = Form.useForm();

  const { tableProps, search }: any = useAntdTable(
    (paginatedParams: any, tableProps: any) =>
      issueJobList({
        pageSize: paginatedParams.pageSize,
        pageNum: paginatedParams.current,
        ...tableProps
      }),
    {
      form,
      formatResult: formatListResult,
    }
  );
  const { submit, reset } = search;

  const onAdd = () => {
    history.push(`/upload/params/`)
  }

  /**
   * @todo 创建table的列
   */
  const columns = createTableColumns([
    {
      title: '操作',
      render: (key, item) => (
        <div>
          <a onClick={() => { }}>详情</a>
          <Divider type="vertical" />
          <a onClick={() => { }}>修改</a>
          <Divider type="vertical" />
          <a onClick={() => { }}>删除</a>
        </div>
      ),
      fixed: 'left',
      align: 'center',
      width: 150,
    },
    {
      title: '任务名称',
      dataIndex: 'jobName',
    },
    {
      title: '任务状态',
      dataIndex: 'status',
      dictType: 'status',
      render: (item: any) => {
        return <Tag color={getTaskJobStatusColor(item)}>{item}</Tag>
      }
    },
    {
      title: '所属机构',
      dataIndex: 'deptId',
      render: (item: any) => {
        const currentDept = deptList && deptList.find(d => d.id === item);
        return (
          <span>{currentDept?.name || '--'}</span>
        )
      }
    },
    {
      title: '终端型号',
      dataIndex: 'typeName',
    },
    {
      title: '操作指令',
      dataIndex: 'operatorCommand',
      dictType: 'terminal_operator_command',
    },
    {
      title: '创建日期',
      dataIndex: 'createTime',
    }
  ]);

  /**
   * @todo table查询表单
   */
  const forms: FormItem[] = [
    {
      formName: 'jobName',
      placeholder: '任务名称',
      formType: FormItmeType.Normal,
    },
  ];


  const extraButtons = [
    { title: '新增', onClick: onAdd, icon: <PlusOutlined />, type: "primary" as any, },
  ]
  return (
    <div>
      <Forms
        form={form}
        forms={forms}
        formButtonProps={{
          // submit: customSubmit,
          // reset: customReset,
          extraButtons
        }}
      />
      <Table
        rowKey="id"
        // rowSelection={rowSelection}
        columns={columns}
        {...tableProps}
        pagination={getStandardPagination(tableProps.pagination)}
      />
    </div>
  )
}