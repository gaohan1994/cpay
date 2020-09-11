/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-08-26 11:27:53 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-09-10 16:42:20
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
import { createTableColumns } from '@/component/table';
import { SyncOutlined, PauseOutlined, CaretRightOutlined, LogoutOutlined } from '@ant-design/icons';
import { RESPONSE_CODE, getDownloadPath } from '@/common/config';
import invariant from 'invariant';
import { taskDownloadTaskList } from '@/pages/upload/upload/constants/api';

type Props = {};

function Page(props: Props) {
  // 请求dept数据
  useStore(['download_task_status', 'terminal_operator_command']);
  const id = useQueryParam('id');
  const jobName = useQueryParam('jobName');

  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState([] as any[]);  // 选中的列的key值列表
  const [selectedRows, setSelectedRows] = useState([] as any[]);
  const [loading, setLoading] = useState(false);

  const { tableProps, search, params: fetchParams }: any = useAntdTable(
    (paginatedParams: any, tableProps: any) =>
      taskDownloadTaskList({ jobId: id, pageSize: paginatedParams.pageSize, pageNum: paginatedParams.current, ...tableProps }),
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
      title: '应用名称',
      dataIndex: 'appName',
    },
    {
      title: '应用版本号',
      dataIndex: 'versionCode',
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
      title: '终端号',
      dataIndex: 'terminalCode',
    },
    {
      title: '商户号',
      dataIndex: 'terminalMerchant',
      render: (merchant) => merchant.merchantCode,
    },
    {
      title: '商户名称',
      dataIndex: 'terminalMerchant',
      render: (merchant) => merchant.merchantName,
    },
    {
      title: '商家姓名',
      dataIndex: 'terminalMerchant',
      render: (merchant) => merchant.legalPerson,
    },
    {
      title: '商家手机号',
      dataIndex: 'terminalMerchant',
      render: (merchant) => merchant.applyPhone,
    },
    {
      title: '商家地址',
      dataIndex: 'terminalMerchant',
      render: (merchant) => `${merchant.province || ''}${merchant.city || ''}${merchant.county || ''}`,
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
      formName: ['status'],
      formType: FormItmeType.SelectCommon,
      dictList: ['download_task_status'],
    },
  ];

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
            ...fetchParams[1]
          }
          setLoading(true);
          const result = await taskDownloadTaskList(param);
          setLoading(false);
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
    { title: '刷新状态', onClick: () => { customReset() }, icon: <SyncOutlined />, type: "primary" as any, },
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
      <div style={{ marginBottom: 10 }}>任务名称：{decodeURIComponent(jobName)}</div>
      <Table rowKey="id" rowSelection={rowSelection} columns={columns}  {...tableProps} />
    </Spin>
  );
}
export default Page;

