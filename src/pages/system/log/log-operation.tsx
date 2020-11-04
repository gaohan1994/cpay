/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-09-14 16:15:09 
 * @Last Modified by: centerm.gaohan
 * @Last Modified time: 2020-10-14 15:16:46
 * 
 * @todo 操作日志
 */
import React, { useState } from 'react';
import { Form, Table, Tag, Modal, notification, Spin } from 'antd';
import { useAntdTable } from 'ahooks';
import { formatListResult } from '@/common/request-util';
import Forms from '@/component/form';
import { FormItem, FormItmeType } from '@/component/form/type';
import { createTableColumns, getStandardPagination } from '@/component/table';
import { monitorOperLogList, monitorOperLogExport, monitorOperLogRemove, monitorOperLogClean } from './constants/api';
import { DeleteOutlined, LogoutOutlined, CloseOutlined } from '@ant-design/icons';
import invariant from 'invariant';
import { RESPONSE_CODE, getDownloadPath } from '@/common/config';
import { useSelectorHook } from '@/common/redux-util';
import { getStatusColor } from '../common';
import history from '@/common/history-util';

type Props = {};

function SystemLog(props: Props) {
  const dictList = useSelectorHook(state => state.common.dictList);

  const [fetchField, setFetchField] = useState({} as any);
  const [selectedRowKeys, setSelectedRowKeys] = useState([] as any[]);
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();
  const { tableProps, search }: any = useAntdTable(
    (paginatedParams: any, tableProps: any) => {
      setFetchField(tableProps);
      return monitorOperLogList({
        pageSize: paginatedParams.pageSize, pageNum: paginatedParams.current, ...tableProps
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

  const onDetail = (item: any) => {
    history.push(`/system/log/detail?id=${item.operId}`)
  }

  /**
   * @todo 创建table的列
   */
  const columns = createTableColumns([
    {
      title: '操作',
      render: (key, item) => (
        <div>
          <a onClick={() => onDetail(item)}>详情</a>
        </div>
      ),
      width: 60,
      align: 'center',
      fixed: 'left'
    },
    {
      title: '系统模块',
      dataIndex: 'title',
    },
    {
      title: '操作类型',
      dataIndex: 'action',
      dictType: 'sys_oper_type'
    },
    {
      title: '操作人员',
      dataIndex: 'operName',
    },
    {
      title: '机构名称',
      dataIndex: 'deptName',
    },
    {
      title: '主机',
      dataIndex: 'operIp',
    },
    {
      title: '操作地点',
      dataIndex: 'operLocation',
    },
    {
      title: '登录状态',
      dataIndex: 'status',
      dictType: 'sys_common_status',
      render: (item) => <Tag color={getStatusColor(item)}>{item}</Tag>
    },
    {
      title: '操作时间',
      dataIndex: 'operTime',
    },
  ]);

  /**
   * @todo table查询表单
   */
  const forms: FormItem[] = [
    {
      formName: 'title',
      placeholder: '系统模块',
      formType: FormItmeType.Normal,
    },
    {
      formName: 'operName',
      placeholder: '操作人员',
      formType: FormItmeType.Normal,
    },
    {
      placeholder: '操作状态',
      formName: 'status',
      formType: FormItmeType.Select,
      selectData:
        (dictList &&
          dictList.sys_common_status && dictList.sys_common_status.data.map((item) => {
            return {
              value: `${item.dictValue}`,
              title: `${item.dictLabel}`,
            };
          })) ||
        [],
    },
  ]

  /**
   * @todo 清空
   */
  const onEmpty = () => {
    Modal.confirm({
      title: '提示',
      content: `确认要清空所有操作日志吗?`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          setLoading(true);
          const result = await monitorOperLogClean();
          setLoading(false);
          invariant(result && result.code === RESPONSE_CODE.success, result && result.msg || '清空操作日志失败，请重试');
          notification.success({ message: '清空操作日志成功!' });
          customSubmit();
        } catch (error) {
          notification.error({ message: error.message });
        }
      },
    });
  }

  /**
   * @todo 导出操作日志
   */
  const onExport = () => {
    Modal.confirm({
      title: '确认要导出操作日志吗？',
      onOk: async () => {
        try {
          const result = await monitorOperLogExport(fetchField);
          invariant(result.code === RESPONSE_CODE.success, result.msg || ' ');

          const href = getDownloadPath(result.data);
          // window.open(href, '_blank');
          notification.success({ message: '导出成功' });
        } catch (error) {
          notification.warn({ message: error.message });
        }
      },
      okText: '确定',
      cancelText: '取消',
    });
  };

  /**
   * @todo 批量删除操作日志
   */
  const onRemoveBatch = () => {
    if (selectedRowKeys.length === 0) {
      notification.error({ message: '请选择记录！' });
      return;
    }
    Modal.confirm({
      title: '提示',
      content: `确认要删除选中的操作日志吗?`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          const param = {
            ids: selectedRowKeys.join(','),
          }
          setLoading(true);
          const result = await monitorOperLogRemove(param);
          setLoading(false);
          invariant(result && result.code === RESPONSE_CODE.success, result && result.msg || '删除操作日志失败，请重试');
          notification.success({ message: '删除操作日志成功!' });
          customSubmit();
        } catch (error) {
          notification.error({ message: error.message });
        }
      },
    });
  }

  const extraButtons = [
    { title: '删除', onClick: onRemoveBatch, icon: <CloseOutlined /> },
    { title: '清空', onClick: onEmpty, icon: <DeleteOutlined /> },
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
          submit: customSubmit,
          reset: customReset,
          extraButtons
        }}
      />
      <Table
        rowKey="operId"
        columns={columns}
        rowSelection={rowSelection}
        {...tableProps}
        pagination={getStandardPagination(tableProps.pagination)}
      />
    </Spin>
  );
}
export default SystemLog;
