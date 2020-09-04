/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-08-19 14:29:27 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-09-01 14:27:49
 * 
 * @todo 执行情况查询
 */
import React, { useState } from 'react';
import { Form, Table, notification, Modal } from 'antd';
import { useAntdTable } from 'ahooks';
import { formatListResult, formatSearch } from '@/common/request-util';
import { useStore } from '@/pages/common/costom-hooks';
import Forms from '@/component/form';
import { FormItem, FormItmeType } from '@/component/form/type';
import { createTableColumns } from '@/component/table';
import { SyncOutlined, PauseOutlined, CaretRightOutlined, LogoutOutlined } from '@ant-design/icons';
import { useRedux } from '@/common/redux-util';
import { RESPONSE_CODE, getDownloadPath } from '@/common/config';
import { taskOperationTaskList, taskOperationTaskExport, taskOperationTaskReset, taskOperationTaskPause } from '../../constants/api';
import { useHistory } from 'react-router-dom';
import invariant from 'invariant';

type Props = {};

function Page(props: Props) {
  // 请求dept数据
  useStore(['operator_task_status', 'terminal_operator_command']);
  const [useSelector, dispatch] = useRedux();
  const history = useHistory();
  const { search: historySearch } = history.location;
  const field = formatSearch(historySearch);

  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState([] as any[]);  // 选中的列的key值列表
  const [selectedRows, setSelectedRows] = useState([] as any[]);

  const { tableProps, search, params: fetchParams }: any = useAntdTable(
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
      title: '任务状态',
      dataIndex: 'status',
      dictType: 'operator_task_status',
    },
    {
      title: '操作指令',
      dataIndex: 'operatorCommand',
      dictType: 'terminal_operator_command'
    },
    {
      title: '所属机构',
      dataIndex: 'firmName',
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
      dictList: ['operator_task_status'],
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

  /**
   * @todo 导出
   */
  const onLogOut = async () => {
    Modal.confirm({
      title: '提示',
      content: `确认导出远程运维-执行情况信息?`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          const param = {
            jobId: field.id,
            ...fetchParams[1]
          }
          const result = await taskOperationTaskExport(param);
          invariant(result && result.code === RESPONSE_CODE.success, result && result.msg || '导出失败，请重试');
          if (result.data) {
            const href = getDownloadPath(result.data);
            window.open(href, '_blank');
          }
        } catch (error) {
          notification.warn({ message: error.message });
        }
      },
    });
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

