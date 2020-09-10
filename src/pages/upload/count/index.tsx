/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-08-20 11:40:15 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-09-10 15:15:55
 * 
 * @todo 更新试点列表
 */
import React, { useState } from 'react';
import { Form, Table, Modal, notification, Spin } from 'antd';
import { useAntdTable } from 'ahooks';
import { formatListResult } from '@/common/request-util';
import { createTableColumns, getStandardPagination } from '@/component/table';
import { taskCountList, taskCountRemove } from '../constants/api';
import invariant from 'invariant';
import { RESPONSE_CODE } from '@/common/config';

type Props = {};

function Page(props: Props) {

  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();
  const { tableProps, search }: any = useAntdTable(
    (paginatedParams: any, tableProps: any) =>
      taskCountList({ pageSize: paginatedParams.pageSize, pageNum: paginatedParams.current, ...tableProps }),
    {
      form,
      formatResult: formatListResult,
    }
  );
  const { reset } = search;



  /**
   * @todo 删除记录
   * @param item 
   */
  const onRemove = (item: any) => {
    Modal.confirm({
      title: '提示',
      content: `确认要删除当前记录吗?`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          const param = {
            ids: item.id
          }
          setLoading(true);
          const result = await taskCountRemove(param);
          setLoading(false);
          reset();
          invariant(result && result.code === RESPONSE_CODE.success, result && result.msg || '删除记录失败，请重试');
          notification.success({ message: '删除记录成功!' });
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
          <a onClick={() => onRemove(item)}>删除</a>
        </div>
      ),
      fixed: 'left',
      align: 'center',
      width: 70,
    },
    {
      title: '任务名称',
      dataIndex: 'jobName',
    },
    {
      title: '试点两天更新最大任务数',
      dataIndex: 'maxTaskCount',
    },
    {
      title: '目前已执行更新任务数',
      dataIndex: 'curTaskCount',
    },
    {
      title: '试点开始时间秒数',
      dataIndex: 'validEndTime',
    },
  ]);


  return (
    <Spin spinning={loading}>
      <Table
        rowKey="id"
        columns={columns}
        {...tableProps}
        pagination={getStandardPagination(tableProps.pagination)}
      />
    </Spin>
  );
}
export default Page;

