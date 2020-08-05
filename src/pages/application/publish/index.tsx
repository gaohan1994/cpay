import React from 'react';
import { Form, Table } from 'antd';
import { useAntdTable } from 'ahooks';
import { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { appAuditList } from '../constants/api';
import { formatListResult } from '@/common/request-util';
import { useStore } from '@/pages/common/costom-hooks';
import Forms from '@/component/form';
import { FormItem, FormItmeType } from '@/component/form/type';
import { createTableColumns } from '@/component/table';
import history from '@/common/history-util';

type Props = {};

function Page(props: Props) {
  // 请求dept数据
  useStore(['app_type']);
  const [form] = Form.useForm();

  const { tableProps, search }: any = useAntdTable(
    (paginatedParams: PaginatedParams, tableProps: any) => {
      appAuditList({ ...paginatedParams, ...tableProps })
    },

    {
      form,
      formatResult: formatListResult,
    }
  );
  const { submit, reset } = search;

  const onClick = (item: any) => {
    history.push(`/advertisement/review-detail?id=${item.id}`);
  };

  const columns = createTableColumns([
    {
      title: '操作',
      render: (key, item) => <a onClick={() => onClick(item)}>审核</a>,
      fixed: 'left',
    },
    {
      title: '应用名称',
      dataIndex: 'appName',
    },
    {
      title: '应用分类',
      dataIndex: 'appType',
      dictType: 'app_type',
    },
    {
      title: '应用包名',
      dataIndex: 'appPackage',
    },
    {
      title: '应用版本',
      dataIndex: 'versionCode',
    },
    {
      title: '内部版本',
      dataIndex: 'versionName',
    },
    {
      title: '机构',
      dataIndex: 'deptName',
    },
    {
      title: '所属组别',
      dataIndex: 'groupName',
      placeHolder: '无',
    },
    {
      title: '终端厂商',
      dataIndex: ' firmName',
    },
    {
      title: '终端型号',
      dataIndex: ' terminalTypes',
    },
    {
      title: '应用状态',
      dataIndex: ' status',
    },
    {
      title: '申请时间',
      dataIndex: 'createTime',
    },
  ]);

  const forms: FormItem[] = [
    {
      formName: 'deptId',
      formType: FormItmeType.TreeSelectCommon,
    },
    {
      formName: 'appName',
      placeholder: '应用名称',
      formType: FormItmeType.Normal,
    },
    {
      formName: 'appPackage',
      placeholder: '应用包名',
      formType: FormItmeType.Normal,
    },
    {
      formName: ['appType'],
      formType: FormItmeType.SelectCommon,
      dictList: ['app_type'],
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
      <Table columns={columns} {...tableProps} />
    </div>
  );
}
export default Page;

