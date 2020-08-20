/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-08-13 09:36:52 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-08-20 11:32:50
 * 
 * @todo 软件更新任务列表
 */
import React, { useState, useEffect } from 'react';
import { Form, Table, Tag, Divider, Popconfirm, notification } from 'antd';
import { useAntdTable } from 'ahooks';
import { formatListResult } from '@/common/request-util';
import { useStore } from '@/pages/common/costom-hooks';
import Forms from '@/component/form';
import { FormItem, FormItmeType } from '@/component/form/type';
import { createTableColumns } from '@/component/table';
import history from '@/common/history-util';
import { taskDownloadJobList, taskDownloadJobRemove } from '../constants/api';
import { PlusOutlined, CopyOutlined, BarsOutlined, CaretRightOutlined, PauseOutlined, ScheduleOutlined, SyncOutlined } from '@ant-design/icons';
import { useRedux } from '@/common/redux-util';
import { RESPONSE_CODE } from '@/common/config';

type Props = {};

function Page(props: Props) {
  // 请求dept数据
  useStore(['task_job_status']);
  const [useSelector, dispatch] = useRedux();

  const [form] = Form.useForm();


  const { tableProps, search }: any = useAntdTable(
    (paginatedParams: any, tableProps: any) =>
      taskDownloadJobList({ jobCopsSign: 0, pageSize: paginatedParams.pageSize, pageNum: paginatedParams.current, ...tableProps }),
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

  }

  /**
   * @todo 跳转到编辑页面
   * @param item 
   */
  const onEdit = (item: any) => {

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
      title: '任务状态',
      dataIndex: 'status',
      dictType: 'task_job_status'
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
    // history.push('/upload/manage-add');
  }

  const extraButtons = [
    { title: '新增', onClick: onAdd, icon: <PlusOutlined />, type: "primary" as any, },
    { title: '复制', onClick: onAdd, icon: <CopyOutlined /> },
    { title: '执行情况', onClick: onAdd, icon: <BarsOutlined /> },
    { title: '启动', onClick: onAdd, icon: <CaretRightOutlined />, type: "primary" as any, },
    { title: '暂停', onClick: onAdd, icon: <PauseOutlined />, type: "primary" as any, },
    { title: '延时', onClick: onAdd, icon: <ScheduleOutlined /> },
    { title: '增量同步', onClick: onAdd, icon: <SyncOutlined /> },
  ]

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
      <Table rowKey="id" columns={columns}  {...tableProps} />
    </div>
  );
}
export default Page;

