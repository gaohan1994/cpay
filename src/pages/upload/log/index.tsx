/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-08-13 10:49:40 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-08-13 11:25:07
 * 
 * @todo 日志提取列表
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
import { softInfoRemove, taskUploadJobList } from '../constants/api';
import { PlusOutlined, CloseOutlined, BarsOutlined, CheckOutlined } from '@ant-design/icons';
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
      taskUploadJobList({ pageSize: paginatedParams.pageSize, pageNum: paginatedParams.current, ...tableProps }),
    {
      form,
      formatResult: formatListResult,
    }
  );
  const { submit, reset } = search;

  /**
   * @todo 跳转到日志提取详情页
   * @param item 
   */
  const onDetail = (item: any) => {
    history.push(`/upload/log-detail?id=${item.id}`);
  }

  /**
   * @todo 批量删除
   */
  const onRemoveBatch = async () => {
    // const param = {
    //   ids: item.id
    // }
    // const res = await softInfoRemove(param);
    // if (res && res.code === RESPONSE_CODE.success) {
    //   notification.success({ message: '删除软件信息成功' });
    //   submit();
    // } else {
    //   notification.error({ message: res && res.msg || '删除软件信息失败，请重试' });
    // }
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
        </div>
      ),
      fixed: 'left',
      width: 60,
    },
    {
      title: '任务名称',
      dataIndex: 'jobName',
    },
    {
      title: '发布状态',
      dataIndex: 'status',
      dictType: 'task_job_status'
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
      title: '创建时间',
      dataIndex: 'createTime',
    },
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
  ];

  /**
   * @todo 跳转到新增页面
   */
  const onAdd = () => {
    history.push('/upload/log-add');
  }

  const extraButtons = [
    { title: '新增', onClick: onAdd, icon: <PlusOutlined />, type: "primary" as any, },
    { title: '批量删除', onClick: onRemoveBatch, icon: <CloseOutlined /> },
    { title: '执行情况查询', onClick: onRemoveBatch, icon: <BarsOutlined /> },
    { title: '执行任务', onClick: onRemoveBatch, icon: <CheckOutlined />, type: "primary" as any,  },
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

