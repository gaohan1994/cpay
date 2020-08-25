/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-08-18 14:56:36 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-08-20 16:15:29
 * 
 * @todo 远程运维列表
 */
import React, { useState, useEffect } from 'react';
import { Form, Table, Tag, Divider, Popconfirm, notification } from 'antd';
import { useAntdTable } from 'ahooks';
import { formatListResult } from '@/common/request-util';
import { useStore } from '@/pages/common/costom-hooks';
import Forms from '@/component/form';
import { FormItem, FormItmeType } from '@/component/form/type';
import { createTableColumns } from '@/component/table';
import { taskOperationJobList, taskOperationJobPublish } from '../constants/api';
import { PlusOutlined, CopyOutlined, BarsOutlined, CaretRightOutlined, PauseOutlined } from '@ant-design/icons';
import { useRedux } from '@/common/redux-util';
import { RESPONSE_CODE } from '@/common/config';
import history from '@/common/history-util';
import { ITerminalFirmItem, ITerminalType } from '@/pages/terminal/types';
import {
  terminalFirmList as getTerminalFirmList,
  terminalTypeListByFirm,
} from '@/pages/terminal/constants';
import { getTaskJobStatusColor } from '../common/util';
import { taskDownloadJobRemove } from '../upload/constants/api';

type Props = {};

const initState = {
  terminalFirmList: [] as ITerminalFirmItem[],        // 终端厂商列表
  terminalFirmValue: '',                              // 终端厂商选中的值
  terminalTypeList: [] as ITerminalType[],            // 终端类型列表（与终端厂商有关）
  terminalTypeValue: '',
}

function Page(props: Props) {
  // 请求dept数据
  useStore(['task_job_status', 'terminal_operator_command']);

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
   * @todo 跳转到应用审核页面
   * @param item 
   */
  const onDetail = (item: any) => {
    history.push(`/upload/operation-detail?id=${item.id}`);
  }

  /**
   * @todo 跳转到编辑页面
   * @param item 
   */
  const onEdit = (item: any) => {
    history.push(`/upload/operation-add?id=${item.id}&type=1`);
  }

  const onRemove = async (item: any) => {
    const param = {
      ids: item.id
    }
    const res = await taskDownloadJobRemove(param);
    if (res && res.code === RESPONSE_CODE.success) {
      notification.success({ message: '删除软件信息成功' });
      submit();
    } else {
      notification.error({ message: res && res.msg || '删除软件信息失败，请重试' });
    }
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
          <Popconfirm
            title="是否确认删除？"
            onConfirm={() => onRemove(item)}
            okText="是"
            cancelText="否"
          >
            <a>删除</a>
          </Popconfirm>
        </div>
      ),
      fixed: 'left',
      width: 150,
    },
    {
      title: '任务名称',
      dataIndex: 'jobName',
    },
    {
      title: '任务状态',
      dataIndex: 'status',
      dictType: 'task_job_status',
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
  ];

  const onAdd = () => {
    history.push('/upload/operation-add');
  }

  const onCopy = () => {
    if (selectedRowKeys.length === 0) {
      notification.error({ message: "请选择任务" });
      return;
    }
    if (selectedRowKeys.length > 1) {
      notification.error({ message: "请选择一条任务" });
      return;
    }
    history.push(`/upload/operation-add?id=${selectedRowKeys[0]}&type=0`);
  }

  const onOperationDetail = () => {
    if (selectedRowKeys.length === 0) {
      notification.error({ message: "请选择任务" });
      return;
    }
    if (selectedRowKeys.length > 1) {
      notification.error({ message: "请选择一条任务" });
      return;
    }
    history.push(`/upload/operation-operation?id=${selectedRowKeys[0]}`);
  }

  const onStart = async () => {
    if (selectedRowKeys.length === 0) {
      notification.error({ message: "请选择任务" });
      return;
    }
    if (selectedRowKeys.length > 1) {
      notification.error({ message: "请选择一条任务" });
      return;
    }
    const res = await taskOperationJobPublish(selectedRowKeys[0]);
    if (res && res.code === RESPONSE_CODE.success) {
      notification.success({ message: '启动任务成功' });
      setSelectedRowKeys([]);
      submit();
    } else {
      notification.error({ message: res && res.msg || '执行任务失败，请重试' });
    }
  }

  const extraButtons = [
    { title: '新增', onClick: onAdd, icon: <PlusOutlined />, type: "primary" as any, },
    { title: '复制', onClick: onCopy, icon: <CopyOutlined /> },
    { title: '执行情况', onClick: onOperationDetail, icon: <BarsOutlined /> },
    { title: '启动', onClick: onStart, icon: <CaretRightOutlined />, type: "primary" as any, },
    { title: '暂停', onClick: onCopy, icon: <PauseOutlined />, type: "primary" as any, },
  ]

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
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

