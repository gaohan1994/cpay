/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-08-17 16:20:07 
 * @Last Modified by: centerm.gaohan
 * @Last Modified time: 2020-10-19 11:20:30
 * 
 * @todo 执行情况详情
 */
import React, { useState } from 'react';
import { Form, Table, notification, Spin } from 'antd';
import { useAntdTable } from 'ahooks';
import { formatListResult, formatSearch, useQueryParam } from '@/common/request-util';
import { useStore } from '@/pages/common/costom-hooks';
import Forms from '@/component/form';
import { FormItem, FormItmeType } from '@/component/form/type';
import { createTableColumns, getStandardPagination } from '@/component/table';
import { CheckOutlined, CloseOutlined, DownloadOutlined, SyncOutlined } from '@ant-design/icons';
import { RESPONSE_CODE } from '@/common/config';
import { taskUploadTaskList, taskUploadTaskReset, taskUploadTaskCancel } from '../../constants/api';
import { useHistory } from 'react-router-dom';

type Props = {};

function Page(props: Props) {
  // 请求dept数据
  useStore(['log_task_status']);
  const history = useHistory();
  const id = useQueryParam('id');

  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState([] as any[]);  // 选中的列的key值列表
  const [selectedRows, setSelectedRows] = useState([] as any[]);
  const [loading, setLoading] = useState(false);

  const { tableProps, search }: any = useAntdTable(
    (paginatedParams: any, tableProps: any) =>
      taskUploadTaskList({ jobId: id, pageSize: paginatedParams.pageSize, pageNum: paginatedParams.current, ...tableProps }),
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
   * @todo 创建table的列
   */
  const columns = createTableColumns([
    {
      title: '终端序列号',
      dataIndex: 'tusn',
    },
    {
      title: '状态',
      dataIndex: 'status',
      dictType: 'log_task_status'
    },
    {
      title: '提取开始时间',
      dataIndex: 'logBeginTime',
    },
    {
      title: '提取结束日期',
      dataIndex: 'logEndTime',
    },
    {
      title: '有效期起始日期',
      dataIndex: 'validStartTime',
    },
    {
      title: '有效期截止日期',
      dataIndex: 'validEndTime',
    },
  ]);

  /**
   * @todo table查询表单
   */
  const forms: FormItem[] = [
    {
      formName: 'tusn',
      placeholder: '终端序列号',
      formType: FormItmeType.Normal,
    },
    {
      formName: ['status'],
      formType: FormItmeType.SelectCommon,
      dictList: ['log_task_status'],
    },
  ];

  /**
   * @todo 重置任务
   */
  const onResetTask = async () => {
    if (selectedRowKeys.length === 0) {
      notification.error({ message: "请选择任务" });
      return;
    }
    const param = {
      ids: selectedRowKeys.join(',')
    }
    setLoading(true);
    const res = await taskUploadTaskReset(param);
    setLoading(false);
    if (res && res.code === RESPONSE_CODE.success) {
      notification.success({ message: '重置任务成功' });
      customSubmit();
    } else {
      notification.error({ message: res && res.msg || '重置任务失败，请重试' });
    }
  }

  /**
   * @todo 取消任务
   */
  const onCancelTask = async () => {
    if (selectedRowKeys.length === 0) {
      notification.error({ message: "请选择任务" });
      return;
    }
    const param = {
      ids: selectedRowKeys.join(',')
    }
    setLoading(true);
    const res = await taskUploadTaskCancel(param);
    setLoading(false);
    if (res && res.code === RESPONSE_CODE.success) {
      notification.success({ message: '取消任务成功' });
      customSubmit();
    } else {
      notification.error({ message: res && res.msg || '取消任务失败，请重试' });
    }
  }

  /**
   * @todo 日志下载
   */
  const onLogDownload = () => {
    if (selectedRowKeys.length === 0) {
      notification.error({ message: "请选择任务" });
      return;
    }
    if (selectedRowKeys.length > 1) {
      notification.error({ message: "请选择一条任务" });
      return;
    }
    if (selectedRows[0].logPath) {
      window.location.href = selectedRows[0].logPath;
    } else {
      notification.error({ message: "文件还未上传成功！" });
    }
  }

  const extraButtons = [
    { title: '重置任务', onClick: onResetTask, icon: <CheckOutlined /> },
    { title: '取消任务', onClick: onCancelTask, icon: <CloseOutlined /> },
    { title: '日志下载', onClick: onLogDownload, icon: <DownloadOutlined /> },
    { title: '刷新状态', onClick: () => customReset(), icon: <SyncOutlined />, type: "primary" as any, },
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

