/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-09-14 16:15:09 
 * @Last Modified by: centerm.gaohan
 * @Last Modified time: 2020-10-14 15:16:44
 * 
 * @todo 登录日志
 */
import React, { useState } from 'react';
import { Form, Table, Tag, Modal, notification, Spin } from 'antd';
import { useAntdTable } from 'ahooks';
import { formatListResult } from '@/common/request-util';
import Forms from '@/component/form';
import { FormItem, FormItmeType } from '@/component/form/type';
import { createTableColumns, getStandardPagination } from '@/component/table';
import { monitorOperLogExport, monitorOperLogRemove, monitorOperLogClean, monitorLoginInfoList } from './constants/api';
import { DeleteOutlined, LogoutOutlined, CloseOutlined } from '@ant-design/icons';
import invariant from 'invariant';
import { RESPONSE_CODE, getDownloadPath } from '@/common/config';
import { useSelectorHook } from '../../../common/redux-util';
import { getStatusColor } from '../common';

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
      return monitorLoginInfoList({
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

  /**
   * @todo 创建table的列
   */
  const columns = createTableColumns([
    {
      title: '登录名',
      dataIndex: 'loginName',
    },
    {
      title: '登录地址',
      dataIndex: 'ipaddr',
    },
    {
      title: '登录地点',
      dataIndex: 'loginLocation',
    },
    {
      title: '浏览器',
      dataIndex: 'browser',
    },
    {
      title: '操作系统',
      dataIndex: 'os',
    },
    {
      title: '登录状态',
      dataIndex: 'status',
      dictType: 'sys_common_status',
      render: (item) => <Tag color={getStatusColor(item)}>{item}</Tag>
    },
    {
      title: '操作信息',
      dataIndex: 'msg',
    },
    {
      title: '登录时间',
      dataIndex: 'loginTime',
    },
  ]);

  /**
   * @todo table查询表单
   */
  const forms: FormItem[] = [
    {
      formName: 'ipaddr',
      placeholder: '登录地址',
      formType: FormItmeType.Normal,
    },
    {
      formName: 'loginName',
      placeholder: '登录名',
      formType: FormItmeType.Normal,
    },
    {
      placeholder: '登录状态',
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
        rowKey="infoId"
        columns={columns}
        rowSelection={rowSelection}
        {...tableProps}
        pagination={getStandardPagination(tableProps.pagination)}
      />
    </Spin>
  );
}
export default SystemLog;
