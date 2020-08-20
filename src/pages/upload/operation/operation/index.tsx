/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-08-19 14:29:27 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-08-20 13:46:26
 * 
 * @todo 执行情况查询
 */
import React, { useState, useEffect } from 'react';
import { Form, Table, Tag, Divider, Popconfirm, notification } from 'antd';
import { useAntdTable } from 'ahooks';
import { formatListResult, formatSearch } from '@/common/request-util';
import { useStore } from '@/pages/common/costom-hooks';
import Forms from '@/component/form';
import { FormItem, FormItmeType } from '@/component/form/type';
import { createTableColumns } from '@/component/table';
import history from '@/common/history-util';
import { DownloadOutlined, SyncOutlined, PauseOutlined, CaretRightOutlined, LogoutOutlined } from '@ant-design/icons';
import { useRedux } from '@/common/redux-util';
import { RESPONSE_CODE, BASIC_CONFIG } from '@/common/config';
import { taskUploadTaskList, taskUploadTaskReset, taskUploadTaskCancel, taskOperationTaskList, taskOperationTaskExport, taskOperationTaskReset, taskOperationTaskPause } from '../../constants/api';
import { useHistory } from 'react-router-dom';

type Props = {};

function Page(props: Props) {
  // 请求dept数据
  useStore(['task_job_status', 'terminal_operator_command']);
  const [useSelector, dispatch] = useRedux();
  const history = useHistory();
  const { search: historySearch } = history.location;
  const field = formatSearch(historySearch);

  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState([] as any[]);  // 选中的列的key值列表
  const [selectedRows, setSelectedRows] = useState([] as any[]);

  const { tableProps, search }: any = useAntdTable(
    (paginatedParams: any, tableProps: any) =>
      taskOperationTaskList({ jobId: field.id, pageSize: paginatedParams.pageSize, pageNum: paginatedParams.current, ...tableProps }),
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
      title: '状态',
      dataIndex: 'status',
      dictType: 'task_job_status',
    },
    {
      title: '终端厂商',
      dataIndex: 'firmName',
    },
    {
      title: '终端型号',
      dataIndex: 'typeName'
    },
    {
      title: '操作指令',
      dataIndex: 'operatorCommand',
      dictType: 'terminal_operator_command'
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
      formName: 'tusn',
      placeholder: '终端序列号',
      formType: FormItmeType.Normal,
    },
    {
      formName: ['status'],
      formType: FormItmeType.SelectCommon,
      dictList: ['task_job_status'],
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
    const res = await taskOperationTaskReset(param);
    if (res && res.code === RESPONSE_CODE.success) {
      notification.success({ message: '启动任务成功' });
      submit();
    } else {
      notification.error({ message: res && res.msg || '启动任务失败，请重试' });
    }
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
    const res = await taskOperationTaskPause(param);
    if (res && res.code === RESPONSE_CODE.success) {
      notification.success({ message: '暂停任务成功' });
      submit();
    } else {
      notification.error({ message: res && res.msg || '暂停任务失败，请重试' });
    }
  }

  const onLogOut = async () => {
    const param = {
      id: field.id
    }
    const res = await taskOperationTaskExport(param);
    if (res && res.code === RESPONSE_CODE.success) {
      // notification.success({ message: '取消任务成功' });
      // submit();
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
      <Table rowKey="id" rowSelection={rowSelection} columns={columns}  {...tableProps} />
    </div>
  );
}
export default Page;

