/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-08-13 10:49:40 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-08-17 16:28:24
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
import { softInfoRemove, taskUploadJobList, taskUploadJobRemove, taskUploadJobPublish } from '../constants/api';
import { PlusOutlined, CloseOutlined, BarsOutlined, CheckOutlined } from '@ant-design/icons';
import { useRedux } from '@/common/redux-util';
import { RESPONSE_CODE } from '@/common/config';

type Props = {};

function Page(props: Props) {
  // 请求dept数据
  useStore(['task_job_status']);
  const [useSelector, dispatch] = useRedux();

  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState([] as any[]);  // 选中的列的key值列表


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
   * @todo 跳转到编辑页面
   * @param item 
   */
  const onEdit = (item: any) => {
    history.push(`/upload/log-add?id=${item.id}`);
  }

  /**
   * @todo 单项删除
   * @param item 
   */
  const onRemoveItem = async (item: any) => {
    const param = {
      ids: item.id
    }
    const res = await taskUploadJobRemove(param);
    if (res && res.code === RESPONSE_CODE.success) {
      notification.success({ message: '删除任务成功' });
      submit();
    } else {
      notification.error({ message: res && res.msg || '删除任务失败，请重试' });
    }
  }

  /**
   * @todo 批量删除
   */
  const onRemoveBatch = async () => {
    if (selectedRowKeys.length === 0) {
      notification.error({ message: "请选择任务" });
      return;
    }
    const param = {
      ids: selectedRowKeys.join(',')
    }
    const res = await taskUploadJobRemove(param);
    if (res && res.code === RESPONSE_CODE.success) {
      notification.success({ message: '删除任务成功' });
      submit();
    } else {
      notification.error({ message: res && res.msg || '删除任务失败，请重试' });
    }
  }

  /**
   * @todo 执行任务
   */
  const onPublish = async () => {
    if (selectedRowKeys.length === 0) {
      notification.error({ message: "请选择任务" });
      return;
    }
    if (selectedRowKeys.length > 1) {
      notification.error({ message: "请选择一条任务" });
      return;
    }
    const res = await taskUploadJobPublish(selectedRowKeys[0]);
    if (res && res.code === RESPONSE_CODE.success) {
      notification.success({ message: '执行任务成功' });
      submit();
    } else {
      notification.error({ message: res && res.msg || '执行任务失败，请重试' });
    }
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
    history.push(`/upload/log-operation?id=${selectedRowKeys[0]}`);
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
          {
            item.status === 0 && (
              <>
                <Divider type="vertical" />
                <a onClick={() => onEdit(item)}>修改</a>
              </>
            )
          }
          {
            item.status === 0 && (
              <>
                <Divider type="vertical" />
                <Popconfirm
                  title="是否确认删除？"
                  onConfirm={() => onRemoveItem(item)}
                  okText="是"
                  cancelText="否"
                >
                  <a>删除</a>
                </Popconfirm>
              </>
            )
          }
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
      title: '发布状态',
      dataIndex: 'status',
      dictType: 'task_job_status',
      render: (item: any) => {
        return <Tag color={item === '待发布' ? '#f8ac59' : '#3D7DE9'}>{item}</Tag>
      }
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
    { title: '执行情况查询', onClick: onOperationDetail, icon: <BarsOutlined /> },
    { title: '执行任务', onClick: onPublish, icon: <CheckOutlined />, type: "primary" as any, },
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

