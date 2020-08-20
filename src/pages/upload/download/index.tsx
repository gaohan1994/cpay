/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-08-20 11:40:15 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-08-20 14:02:58
 * 
 * @todo 远程下载列表
 */
import React from 'react';
import { Form, Table } from 'antd';
import { useAntdTable } from 'ahooks';
import { formatListResult } from '@/common/request-util';
import { useStore } from '@/pages/common/costom-hooks';
import Forms from '@/component/form';
import { FormItem, FormItmeType } from '@/component/form/type';
import { createTableColumns } from '@/component/table';
import { taskDownloadJobList } from '../constants/api';

type Props = {};

function Page(props: Props) {
  // 请求dept数据
  useStore(['task_job_status']);

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
   * @todo 创建table的列
   */
  const columns = createTableColumns([
    {
      title: '终端序列号',
      dataIndex: 'status',
    },
    {
      title: '下载资源数',
      dataIndex: 'jobName',
    },
    {
      title: '下载开始时间',
      dataIndex: 'validStartTime',
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
  ];


  return (
    <div>
      <Forms
        form={form}
        forms={forms}
        formButtonProps={{
          submit,
          reset,
        }}
      />
      <Table rowKey="id" columns={columns}  {...tableProps} />
    </div>
  );
}
export default Page;

