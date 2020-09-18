/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-08-13 10:49:40 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-09-10 15:16:51
 * 
 * @todo 日志提取列表
 */
import React, { useState } from 'react';
import { Form, Table, Divider, notification, Modal, Spin } from 'antd';
import { useAntdTable } from 'ahooks';
import { formatListResult } from '@/common/request-util';
import { useStore } from '@/pages/common/costom-hooks';
import Forms from '@/component/form';
import { FormItem, FormItmeType } from '@/component/form/type';
import { createTableColumns, getStandardPagination } from '@/component/table';
import history from '@/common/history-util';
import { taskUploadJobList, taskUploadJobRemove, taskUploadJobPublish } from '../constants/api';
import { PlusOutlined, CloseOutlined, BarsOutlined, CheckOutlined } from '@ant-design/icons';
import { RESPONSE_CODE } from '@/common/config';
import invariant from 'invariant';

type Props = {};

function Page(props: Props) {
  // 请求dept数据
  useStore(['log_job_status']);

  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState([] as any[]);  // 选中的列的key值列表
  const [selectedRows, setSelectedRows] = useState([] as any[]);
  const [loading, setLoading] = useState(false);

  const { tableProps, search }: any = useAntdTable(
    (paginatedParams: any, tableProps: any) =>
      taskUploadJobList({ pageSize: paginatedParams.pageSize, pageNum: paginatedParams.current, ...tableProps }),
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
    setSelectedRows([]);
    submit();
  }

  /**
   * @todo 自定义重置，把选中列表置空
   */
  const customReset = () => {
    setSelectedRowKeys([]);
    setSelectedRows([]);
    reset();
  }

  /**
   * @todo 跳转到日志提取详情页
   * @param item 
   */
  const onDetail = (item: any) => {
    history.push(`/upload/log/detail?id=${item.id}`);
  }

  /**
   * @todo 跳转到编辑页面
   * @param item 
   */
  const onEdit = (item: any) => {
    history.push(`/upload/log/edit?id=${item.id}`);
  }

  /**
   * @todo 单项删除
   * @param item 
   */
  const onRemoveItem = async (item: any) => {
    Modal.confirm({
      title: '提示',
      content: `确认要删除当前任务吗?`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          const param = {
            ids: item.id
          }
          setLoading(true);
          const result = await taskUploadJobRemove(param);
          setLoading(false);
          invariant(result && result.code === RESPONSE_CODE.success, result && result.msg || '删除任务失败，请重试');
          notification.success({ message: '删除任务成功!' });
          customSubmit();
        } catch (error) {
          notification.warn({ message: error.message });
        }
      },
    });
  }

  /**
   * @todo 批量删除
   */
  const onRemoveBatch = async () => {
    if (selectedRowKeys.length === 0) {
      notification.error({ message: "请选择任务" });
      return;
    }
    Modal.confirm({
      title: '提示',
      content: `确认要删除选中任务吗?`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          const param = {
            ids: selectedRowKeys.join(',')
          }
          setLoading(true);
          const result = await taskUploadJobRemove(param);
          setLoading(false);
          invariant(result && result.code === RESPONSE_CODE.success, result && result.msg || '删除任务失败，请重试');
          notification.success({ message: '删除任务成功!' });
          customSubmit();
        } catch (error) {
          notification.warn({ message: error.message });
        }
      },
    });
  }

  /**
   * @todo 执行任务
   */
  const onPublish = async () => {
    if (selectedRowKeys.length === 0) {
      notification.error({ message: "请选择任务" });
      return;
    }
    if (selectedRowKeys.length > 1) {
      notification.error({ message: "请选择一条任务" });
      return;
    }
    setLoading(true);
    const res = await taskUploadJobPublish(selectedRowKeys[0]);
    setLoading(false);
    if (res && res.code === RESPONSE_CODE.success) {
      notification.success({ message: '执行任务成功' });
      customSubmit();
    } else {
      notification.error({ message: res && res.msg || '执行任务失败，请重试' });
    }
  }

  /**
   * @todo 执行情况查询
   */
  const onOperationDetail = () => {
    if (selectedRowKeys.length === 0) {
      notification.error({ message: "请选择任务" });
      return;
    }
    if (selectedRowKeys.length > 1) {
      notification.error({ message: "请选择一条任务" });
      return;
    }
    if (selectedRows[0].status === 1) {
      notification.error({ message: "请先执行当前任务" });
      return;
    }
    history.push(`/upload/log/operation?id=${selectedRowKeys[0]}`);
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
          {
            (item.status === 1 || item.status === 3) && (
              <>
                <Divider type="vertical" />
                <a onClick={() => onEdit(item)}>修改</a>
              </>
            )
          }
          {
            (item.status === 1 || item.status === 3) && (
              <>
                <Divider type="vertical" />
                <a onClick={() => onRemoveItem(item)}>删除</a>
              </>
            )
          }
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
      title: '发布状态',
      dataIndex: 'status',
      dictType: 'log_job_status',
    },
    {
      title: '有效起始日期',
      dataIndex: 'validStartTime',
    },
    {
      title: '有效截止日期',
      dataIndex: 'validEndTime',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
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

  /**
   * @todo 跳转到新增页面
   */
  const onAdd = () => {
    history.push('/upload/log/add');
  }

  const extraButtons = [
    { title: '新增', onClick: onAdd, icon: <PlusOutlined />, type: "primary" as any, },
    { title: '批量删除', onClick: onRemoveBatch, icon: <CloseOutlined /> },
    { title: '执行情况查询', onClick: onOperationDetail, icon: <BarsOutlined /> },
    { title: '执行任务', onClick: onPublish, icon: <CheckOutlined />, type: "primary" as any, },
  ]

  const onChangeSelectedRows = (selectedRowKeys: any[], selectedRows: any[]) => {
    setSelectedRowKeys(selectedRowKeys);
    setSelectedRows(selectedRows);
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onChangeSelectedRows,
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
        rowKey="id"
        rowSelection={rowSelection}
        columns={columns}
        {...tableProps}
        pagination={getStandardPagination(tableProps.pagination)}
      />
    </Spin>
  );
}
export default Page;

