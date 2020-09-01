/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-08-13 09:36:52 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-09-01 14:56:48
 * 
 * @todo 软件更新任务列表
 */
import React, { useState } from 'react';
import { Form, Table, Tag, Divider, notification, Radio, Modal } from 'antd';
import { useAntdTable } from 'ahooks';
import { formatListResult } from '@/common/request-util';
import { useStore } from '@/pages/common/costom-hooks';
import Forms from '@/component/form';
import { FormItem, FormItmeType } from '@/component/form/type';
import { createTableColumns } from '@/component/table';
import history from '@/common/history-util';
import { PlusOutlined, CopyOutlined, BarsOutlined, CaretRightOutlined, PauseOutlined, ScheduleOutlined, SyncOutlined } from '@ant-design/icons';
import { RESPONSE_CODE } from '@/common/config';
import { taskDownloadJobList, taskDownloadJobRemove, taskDownloadJobPublish } from './constants/api';
import invariant from 'invariant';

type Props = {};

function Page(props: Props) {
  // 请求dept数据
  useStore(['task_job_status']);

  const [selectedRowKeys, setSelectedRowKeys] = useState([] as any[]);  // 选中的列的key值列表
  const [selectedRows, setSelectedRows] = useState([] as any[]);
  const [timeType, setTimeType] = useState(0);

  const [form] = Form.useForm();

  const { tableProps, search }: any = useAntdTable(
    (paginatedParams: any, tableProps: any) =>
      taskDownloadJobList({ timeType, jobCopsSign: 0, pageSize: paginatedParams.pageSize, pageNum: paginatedParams.current, ...tableProps }),
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
    history.push(`/upload/update-detail?id=${item.id}`);
  }

  /**
   * @todo 跳转到编辑页面
   * @param item 
   */
  const onEdit = (item: any) => {
    history.push(`/upload/update-add?id=${item.id}&type=1`);
  }

  /**
   * @todo 删除软件更新任务
   * @param item 
   */
  const onRemove = async (item: any) => {
    Modal.confirm({
      title: '提示',
      content: `确认要删除当前软件更新任务吗?`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          const param = {
            ids: item.id
          }
          const result = await taskDownloadJobRemove(param);
          invariant(result && result.code === RESPONSE_CODE.success, result && result.msg || '删除软件更新任务失败，请重试');
          notification.success({ message: '删除软件更新任务成功!' });
          submit();
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
      align: 'center',
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
      width: 150,
    },
    {
      title: '成功',
      dataIndex: 'status',
      render: (item: any) => (<div style={{ color: '#468847' }}>{item}</div>)
    },
    {
      title: '失败',
      dataIndex: 'status',
      render: (item: any) => (<div style={{ color: '#ce3739' }}>{item}</div>)
    },
    {
      title: '待执行',
      dataIndex: 'status',
      render: (item: any) => (<div style={{ color: '#8FBC8F' }}>{item}</div>)
    },
    {
      title: '执行中',
      dataIndex: 'status',
      render: (item: any) => (<div style={{ color: '#32CD32' }}>{item}</div>)
    },
    {
      title: '任务状态',
      dataIndex: 'status',
      dictType: 'task_job_status',
      render: (item: any) => {
        return <Tag color={item === '初始' ? '#f8ac59' : item === '结束' ? '#57b5e3' : '#3D7DE9'}>{item}</Tag>
      }
    },
    {
      title: '任务名称',
      dataIndex: 'jobName',
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
      title: '创建日期',
      dataIndex: 'createTime',
    },
    {
      title: '创建机构',
      dataIndex: 'deptName',
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
      formName: ['status'],
      formType: FormItmeType.SelectCommon,
      dictList: ['task_job_status'],
    },
  ];

  const onAdd = () => {
    history.push('/upload/update-add');
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
    history.push(`/upload/update-add?id=${selectedRowKeys[0]}&type=0`);
  }

  /**
   * @todo 执行软件更新任务
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
    history.push(`/upload/update-operation?id=${selectedRowKeys[0]}&jobName=${selectedRows[0].jobName}`);
  }

  /**
   * @todo 启动任务
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
    const res = await taskDownloadJobPublish(selectedRowKeys[0]);
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
    { title: '暂停', onClick: () => { }, icon: <PauseOutlined />, type: "primary" as any, },
    { title: '延时', onClick: () => { }, icon: <ScheduleOutlined /> },
    { title: '增量同步', onClick: () => { }, icon: <SyncOutlined /> },
  ]

  const onChangeSelectedRows = (selectedRowKeys: any[], selectedRows: any[]) => {
    setSelectedRowKeys(selectedRowKeys);
    setSelectedRows(selectedRows);
  }


  const rowSelection = {
    selectedRowKeys,
    onChange: onChangeSelectedRows,
  };

  const renderExtra = () => {
    return (
      <Radio.Group buttonStyle="solid" style={{ float: 'right' }} value={timeType} onChange={e => { setTimeType(e.target.value); submit(); }}>
        <Radio.Button value="1" >当日</Radio.Button>
        <Radio.Button value="7" >近7天</Radio.Button>
        <Radio.Button value="30" >近30天</Radio.Button>
      </Radio.Group>
    )
  }

  const resetExtraParam = () => {
    setTimeType(0);
  }

  return (
    <div>
      <Forms
        form={form}
        forms={forms}
        formButtonProps={{
          submit,
          reset,
          extraButtons,
          renderExtra,
          resetExtra: resetExtraParam
        }}
      />
      <Table rowKey="id" rowSelection={rowSelection} columns={columns}  {...tableProps} />
    </div>
  );
}
export default Page;

