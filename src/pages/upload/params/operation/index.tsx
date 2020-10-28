/*
 * @Author: centerm.gaozhiying
 * @Date: 2020-08-26 11:27:53
 * @Last Modified by: centerm.gaohan
 * @Last Modified time: 2020-10-14 15:17:29
 *
 * @todo 软件更新执行情况查询
 */
import React, { useState } from 'react';
import { Form, Table, notification, Modal, Spin } from 'antd';
import { useAntdTable } from 'ahooks';
import { formatListResult, useQueryParam } from '@/common/request-util';
import { useStore } from '@/pages/common/costom-hooks';
import Forms from '@/component/form';
import { FormItem, FormItmeType } from '@/component/form/type';
import { createTableColumns, getStandardPagination } from '@/component/table';
import {
  SyncOutlined,
  PauseOutlined,
  CaretRightOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { RESPONSE_CODE, getDownloadPath } from '@/common/config';
import {
  issueTaskList,
  issueTaskExport,
  issueTaskReset,
  issueTaskPause,
} from '../../constants/api';
import invariant from 'invariant';
import { useFormSelectedList } from '@/pages/common/costom-hooks/form-select';
import { terminalTemplateList } from '@/pages/terminal/template/constants/index'

type Props = {};

function Page(props: Props) {
  // 请求dept数据
  useStore([
    'download_task_status',
    'terminal_operator_command',
    'job_action',
  ]);
  const id = useQueryParam('id');
  const jobName = useQueryParam('jobName');

  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState([] as any[]); // 选中的列的key值列表
  const [selectedRows, setSelectedRows] = useState([] as any[]);
  const [loading, setLoading] = useState(false);
  const {list: templateInfoList} = useFormSelectedList(terminalTemplateList, [], {})

  const { tableProps, search, params: fetchParams }: any = useAntdTable(
    (paginatedParams: any, tableProps: any) =>
      issueTaskList({
        jobId: id,
        pageSize: paginatedParams.pageSize,
        pageNum: paginatedParams.current,
        ...tableProps,
      }),
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
  };

  /**
   * @todo 自定义重置，把选中列表置空
   */
  const customReset = () => {
    setSelectedRowKeys([]);
    setSelectedRows([]);
    reset();
  };

  /**
   * @todo 创建table的列
   */
  const columns = createTableColumns([
    {
      title: '终端序列号',
      dataIndex: 'tusn',
    },
    // {
    //   title: '应用名称',
    //   dataIndex: 'appName',
    // },
    // {
    //   title: '应用版本号',
    //   dataIndex: 'versionCode',
    // },
    // {
    //   title: '操作类型',
    //   dataIndex: 'actionType',
    //   dictType: 'job_action',
    // },
    {
      title: '模板参数名称',
      dataIndex: 'paramTemplateName',
    },
    {
      title: '状态',
      dataIndex: 'status',
      dictType: 'download_task_status',
    },
    {
      title: '结果说明',
      dataIndex: 'resultMsg',
    },
    {
      title: '任务开始时间',
      dataIndex: 'validStartTime',
    },
    {
      title: '任务结束时间',
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
    // {
    //   formName: 'appName',
    //   placeholder: '应用名称',
    //   formType: FormItmeType.Normal,
    // },
    // {
    //   formName: 'versionCode',
    //   placeholder: '应用版本号',
    //   formType: FormItmeType.Normal,
    // },
    // {
    //   formName: 'actionType',
    //   formType: FormItmeType.SelectCommon,
    //   dictList: 'job_action',
    // },
    // {
    //   placeholder: '参数模板',
    //   formName: 'paramsTemplateId',
    //   formType: FormItmeType.Select,
    //   selectData: templateInfoList.map((item) => {
    //     return { value: `${item.id}`, title: `${item.templateName}`}
    //   }),
    // },
    {
      formName: 'status',
      formType: FormItmeType.SelectCommon,
      dictList: 'download_task_status',
    },
  ];

  /**
   * @todo 重置任务
   */
  const onStartTask = async () => {
    if (selectedRowKeys.length === 0) {
      notification.error({ message: '请选择任务' });
      return;
    }
    for (let i = 0; i < selectedRows.length; i++) {
      if (selectedRows[i].status !== 6 && selectedRows[i].status !== 9) {
        notification.error({
          message: '不能选择暂停和下载失败以外的任务启动！',
        });
        return;
      }
    }
    const param = {
      ids: selectedRowKeys.join(','),
    };
    setLoading(true);
    const res = await issueTaskReset(param);
    setLoading(false);
    if (res && res.code === RESPONSE_CODE.success) {
      notification.success({ message: '启动任务成功' });
      customSubmit();
    } else {
      notification.error({
        message: (res && res.msg) || '启动任务失败，请重试',
      });
    }
  };

  /**
   * @todo 暂停任务
   */
  const onPauseTask = async () => {
    if (selectedRowKeys.length === 0) {
      notification.error({ message: '请选择任务' });
      return;
    }
    for (let i = 0; i < selectedRows.length; i++) {
      if (selectedRows[i].status !== 6 && selectedRows[i].status !== 0) {
        notification.error({
          message: '不能选择等待下发和下载失败以外的任务暂停！',
        });
        return;
      }
    }
    const param = {
      ids: selectedRowKeys.join(','),
    };
    setLoading(true);
    const res = await issueTaskPause(param);
    setLoading(false);
    if (res && res.code === RESPONSE_CODE.success) {
      notification.success({ message: '暂停任务成功' });
      customSubmit();
    } else {
      notification.error({
        message: (res && res.msg) || '暂停任务失败，请重试',
      });
    }
  };

  /**
   * @todo 导出
   */
  const onLogOut = async () => {
    Modal.confirm({
      title: '提示',
      content: `确认导出软件更新-执行情况信息?`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          const param = {
            jobId: id,
            ...fetchParams[1],
          };
          setLoading(true);
          const result = await issueTaskExport(param);
          setLoading(false);
          invariant(
            result && result.code === RESPONSE_CODE.success,
            (result && result.msg) || '导出失败，请重试'
          );
          if (result.data) {
            const href = getDownloadPath(result.data);
            // window.open(href, '_blank');
            notification.success({ message: '导出成功' });

          }
        } catch (error) {
          notification.warn({ message: error.message });
        }
      },
    });
  };

  const extraButtons = [
    {
      title: '启动任务',
      onClick: onStartTask,
      icon: <CaretRightOutlined />,
      type: 'primary' as any,
    },
    { title: '暂停任务', onClick: onPauseTask, icon: <PauseOutlined /> },
    {
      title: '刷新状态',
      onClick: () => {
        customReset();
      },
      icon: <SyncOutlined />,
      type: 'primary' as any,
    },
    {
      title: '导出',
      onClick: onLogOut,
      icon: <LogoutOutlined />,
      type: 'primary' as any,
    },
  ];

  const onChangeSelectedRows = (
    selectedRowKeys: any[],
    selectedRows: any[]
  ) => {
    setSelectedRowKeys(selectedRowKeys);
    setSelectedRows(selectedRows);
  };

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
          extraButtons,
        }}
      />
      <div style={{ marginBottom: 10 }}>
        任务名称：{decodeURIComponent(jobName)}
      </div>
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
