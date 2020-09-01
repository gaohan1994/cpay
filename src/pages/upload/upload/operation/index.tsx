/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-08-26 11:27:53 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-09-01 15:02:25
 * 
 * @todo 软件更新执行情况查询
 */
import React, { useState } from 'react';
import { Form, Table, notification } from 'antd';
import { useAntdTable } from 'ahooks';
import { formatListResult, useQueryParam } from '@/common/request-util';
import { useStore } from '@/pages/common/costom-hooks';
import Forms from '@/component/form';
import { FormItem, FormItmeType } from '@/component/form/type';
import { createTableColumns } from '@/component/table';
import { SyncOutlined, PauseOutlined, CaretRightOutlined, LogoutOutlined } from '@ant-design/icons';
import { RESPONSE_CODE, BASIC_CONFIG } from '@/common/config';
import { taskOperationTaskExport } from '../../constants/api';
import { taskDownloadTaskList } from '../constants/api';

type Props = {};

function Page(props: Props) {
  // 请求dept数据
  useStore(['task_job_status', 'terminal_operator_command', 'download_task_type']);
  const id = useQueryParam('id');
  const jobName = useQueryParam('jobName');

  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState([] as any[]);  // 选中的列的key值列表
  const [selectedRows, setSelectedRows] = useState([] as any[]);

  const { tableProps, search }: any = useAntdTable(
    (paginatedParams: any, tableProps: any) =>
      taskDownloadTaskList({ jobId: id, pageSize: paginatedParams.pageSize, pageNum: paginatedParams.current, ...tableProps }),
    {
      form,
      formatResult: formatListResult,
    }
  );
  const { submit, reset } = search;

  /**
   * @todo 创建table的列
   */
  const columns = createTableColumns([
    {
      title: '终端序列号',
      dataIndex: 'tusn',
    },
    {
      title: '应用名称',
      dataIndex: 'appName',
    },
    {
      title: '应用版本号',
      dataIndex: 'versionCode',
    },
    {
      title: '操作类型',
      dataIndex: 'actionType',
      dictType: 'download_task_type',
    },
    {
      title: '状态',
      dataIndex: 'status',
      dictType: 'task_job_status',
    },
    {
      title: '结果说明',
      dataIndex: 'resultMsg',
    },
    {
      title: '任务开始时间',
      dataIndex: 'startTime',
    },
    {
      title: '任务结束时间',
      dataIndex: 'endTime',
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
      formName: 'appName',
      placeholder: '应用名称',
      formType: FormItmeType.Normal,
    },
    {
      formName: 'versionCode',
      placeholder: '应用版本号',
      formType: FormItmeType.Normal,
    },
    {
      formName: ['actionType', 'status'],
      formType: FormItmeType.SelectCommon,
      dictList: ['download_task_type', 'task_job_status'],
    },
  ];

  /**
   * @todo 重置任务
   */
  const onStartTask = async () => {
    if (selectedRowKeys.length === 0) {
      notification.error({ message: "请选择任务" });
      return;
    }
    const param = {
      ids: selectedRowKeys.join(',')
    }
    // const res = await taskOperationTaskReset(param);
    // if (res && res.code === RESPONSE_CODE.success) {
    //   notification.success({ message: '启动任务成功' });
    //   submit();
    // } else {
    //   notification.error({ message: res && res.msg || '启动任务失败，请重试' });
    // }
  }

  /**
   * @todo 取消任务
   */
  const onPauseTask = async () => {
    if (selectedRowKeys.length === 0) {
      notification.error({ message: "请选择任务" });
      return;
    }
    const param = {
      ids: selectedRowKeys.join(',')
    }
    // const res = await taskOperationTaskPause(param);
    // if (res && res.code === RESPONSE_CODE.success) {
    //   notification.success({ message: '暂停任务成功' });
    //   submit();
    // } else {
    //   notification.error({ message: res && res.msg || '暂停任务失败，请重试' });
    // }
  }

  /**
   * @todo 导出
   */
  const onLogOut = async () => {
    const param = {
      id: id
    }
    const res = await taskOperationTaskExport(param);
    if (res && res.code === RESPONSE_CODE.success) {
      if (res.data) {
        window.location.href = `${BASIC_CONFIG.SOURCE_URL}/${res.data}`;
      }
    } else {
      notification.error({ message: res && res.msg || '导出失败，请重试' });
    }
  }

  const extraButtons = [
    { title: '启动任务', onClick: onStartTask, icon: <CaretRightOutlined />, type: "primary" as any, },
    { title: '暂停任务', onClick: onPauseTask, icon: <PauseOutlined /> },
    { title: '刷新状态', onClick: () => reset(), icon: <SyncOutlined />, type: "primary" as any, },
    { title: '导出', onClick: onLogOut, icon: <LogoutOutlined />, type: "primary" as any, },
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
    <div>
      <Forms
        form={form}
        forms={forms}
        formButtonProps={{
          submit,
          reset,
          extraButtons
        }}
      />
      <div style={{ marginBottom: 10 }}>任务名称：{decodeURIComponent(jobName)}</div>
      <Table rowKey="id" rowSelection={rowSelection} columns={columns}  {...tableProps} />
    </div>
  );
}
export default Page;

