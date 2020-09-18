/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-08-18 14:56:36 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-09-10 15:47:17
 * 
 * @todo 远程运维列表
 */
import React, { useState, useEffect } from 'react';
import { Form, Table, Tag, Divider, notification, Modal, Spin } from 'antd';
import { useAntdTable } from 'ahooks';
import { formatListResult } from '@/common/request-util';
import { useStore } from '@/pages/common/costom-hooks';
import Forms from '@/component/form';
import { FormItem, FormItmeType } from '@/component/form/type';
import { createTableColumns, getStandardPagination } from '@/component/table';
import { taskOperationJobList, taskOperationJobPublish, taskOperationJobRemove, taskOperationJobPuase } from '../constants/api';
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

type Props = {};

const initState = {
  terminalFirmList: [] as ITerminalFirmItem[],        // 终端厂商列表
  terminalFirmValue: '',                              // 终端厂商选中的值
  terminalTypeList: [] as ITerminalType[],            // 终端类型列表（与终端厂商有关）
  terminalTypeValue: '',
}

function Page(props: Props) {
  // 请求dept数据
  useStore(['operator_job_status', 'terminal_operator_command']);

  const [loading, setLoading] = useState(false);
  const [terminalFirmList, setTerminalFirmList] = useState(
    initState.terminalFirmList
  );
  const [terminalFirmValue, setTerminalFirmValue] = useState(
    initState.terminalFirmValue
  );
  const [terminalTypeList, setTerminalTypeList] = useState(
    initState.terminalTypeList
  );
  const [terminalTypeValue, setTerminalTypeValue] = useState(
    initState.terminalTypeValue
  );
  const [selectedRowKeys, setSelectedRowKeys] = useState([] as any[]);  // 选中的列的key值列表
  const [selectedRows, setSelectedRows] = useState([] as any[]);

  useEffect(() => {
    /** 获取终端厂商列表 */
    getTerminalFirmList({}, (firmList: any[]) => {
      setTerminalFirmList(firmList);
    });
  }, []);

  /**
   * @todo 监听终端厂商的值，获取终端类型列表
   */
  useEffect(() => {
    if (terminalFirmValue.length > 0) {
      setTerminalTypeList([]);
      setTerminalTypeValue('');
      terminalTypeListByFirm({ firmId: terminalFirmValue }, setTerminalTypeList);
    }
  }, [terminalFirmValue]);

  const [form] = Form.useForm();

  const { tableProps, search }: any = useAntdTable(
    (paginatedParams: any, tableProps: any) =>
      taskOperationJobList({ copsSign: 0, pageSize: paginatedParams.pageSize, pageNum: paginatedParams.current, ...tableProps }),
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
   * @todo 跳转到应用审核页面
   * @param item 
   */
  const onDetail = (item: any) => {
    history.push(`/upload/operation/detail?id=${item.id}`);
  }

  /**
   * @todo 跳转到编辑页面
   * @param item 
   */
  const onEdit = (item: any) => {
    if (item.status === 7) {
      notification.error({ message: "任务已经结束，不允许修改！" });
      return;
    }
    if (item.status === 5 || item.status === 6) {
      notification.error({ message: "任务正在进行中，不允许修改！" });
      return;
    }
    history.push(`/upload/operation/edit?id=${item.id}&type=1`);
  }

  const onRemove = async (item: any) => {
    Modal.confirm({
      title: '提示',
      content: `确认要删除当前任务?`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          const param = {
            ids: item.id
          }
          setLoading(true);
          const result = await taskOperationJobRemove(param);
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
   * @todo 创建table的列
   */
  const columns = createTableColumns([
    {
      title: '操作',
      render: (key, item) => (
        <div>
          <a onClick={() => onDetail(item)}>详情</a>
          <Divider type="vertical" />
          <a onClick={() => onEdit(item)}>修改</a>
          <Divider type="vertical" />
          <a onClick={() => onRemove(item)}>删除</a>
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
      dictType: 'operator_job_status',
      render: (item: any) => {
        return <Tag color={getTaskJobStatusColor(item)}>{item}</Tag>
      }
    },
    {
      title: '终端厂商',
      dataIndex: 'firmName',
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
    {
      placeholder: '终端厂商',
      formName: 'firmId',
      formType: FormItmeType.Select,
      selectData:
        (Array.isArray(terminalFirmList) &&
          terminalFirmList.map((item) => {
            return {
              value: `${item.id}`,
              title: `${item.firmName}`,
            };
          })) ||
        [],
      value: terminalFirmValue,
      onChange: (id: string) => {
        setTerminalFirmValue(`${id}`);
      },
    },
    {
      placeholder: '终端型号',
      formName: 'terminalTypeId',
      formType: FormItmeType.Select,
      selectData:
        (Array.isArray(terminalTypeList) &&
          terminalTypeList.map((item) => {
            return {
              value: `${item.id}`,
              title: `${item.typeName}`,
            };
          })) ||
        [],
      value: terminalTypeValue,
      onChange: (id: string) => {
        setTerminalTypeValue(`${id}`);
      },
    },
    {
      formName: ['operatorCommand',],
      formType: FormItmeType.SelectCommon,
      dictList: ['terminal_operator_command'],
    },
  ];

  /**
   * @todo 新增
   */
  const onAdd = () => {
    history.push('/upload/operation/add');
  }

  /**
   * @todo 复制
   */
  const onCopy = () => {
    if (selectedRowKeys.length === 0) {
      notification.error({ message: "请选择任务" });
      return;
    }
    if (selectedRowKeys.length > 1) {
      notification.error({ message: "请选择一条任务" });
      return;
    }
    history.push(`/upload/operation/copy?id=${selectedRowKeys[0]}&type=0`);
  }

  /**
   * @todo 执行情况
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
      notification.error({ message: "请先启动当前任务" });
      return;
    }
    history.push(`/upload/operation/operation?id=${selectedRowKeys[0]}`);
  }

  /**
   * @todo 启动
   */
  const onStart = async () => {
    if (selectedRowKeys.length === 0) {
      notification.error({ message: "请选择任务" });
      return;
    }
    if (selectedRowKeys.length > 1) {
      notification.error({ message: "请选择一条任务" });
      return;
    }
    if (selectedRows[0].status === 5) {
      notification.error({ message: "任务已经启动！" });
      return;
    }
    if (selectedRows[0].status === 7) {
      notification.error({ message: "任务已经结束！" });
      return;
    }
    setLoading(true);
    const res = await taskOperationJobPublish(selectedRowKeys[0]);
    setLoading(false);
    if (res && res.code === RESPONSE_CODE.success) {
      notification.success({ message: '启动任务成功' });
      customSubmit();
    } else {
      notification.error({ message: res && res.msg || '执行任务失败，请重试' });
    }
  }

  /**
   * @todo 暂停
   */
  const onPause = async () => {
    if (selectedRowKeys.length === 0) {
      notification.error({ message: "请选择任务" });
      return;
    }
    if (selectedRowKeys.length > 1) {
      notification.error({ message: "请选择一条任务" });
      return;
    }
    if (selectedRows[0].status === 6) {
      notification.error({ message: "任务已经暂停！" });
      return;
    }
    if (selectedRows[0].status === 7) {
      notification.error({ message: "任务已经结束！" });
      return;
    }
    setLoading(true);
    const res = await taskOperationJobPuase(selectedRowKeys[0]);
    setLoading(false);
    if (res && res.code === RESPONSE_CODE.success) {
      notification.success({ message: '启动任务成功' });
      customSubmit();
    } else {
      notification.error({ message: res && res.msg || '执行任务失败，请重试' });
    }
  }

  const extraButtons = [
    { title: '新增', onClick: onAdd, icon: <PlusOutlined />, type: "primary" as any, },
    { title: '复制', onClick: onCopy, icon: <CopyOutlined /> },
    { title: '执行情况', onClick: onOperationDetail, icon: <BarsOutlined /> },
    { title: '启动', onClick: onStart, icon: <CaretRightOutlined />, type: "primary" as any, },
    { title: '暂停', onClick: onPause, icon: <PauseOutlined />, type: "primary" as any, },
  ]

  const onChangeSelectedRows = (selectedRowKeys: any[], selectedRows: any[]) => {
    setSelectedRowKeys(selectedRowKeys);
    setSelectedRows(selectedRows);
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onChangeSelectedRows,
    type: 'radio'
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

