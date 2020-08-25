import React from 'react';
import { Form, Table } from 'antd';
import { useHistory } from 'react-router-dom';
import { useAntdTable } from 'ahooks';
import { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { advertInfoList } from '../constants/api';
import { formatListResult } from '@/common/request-util';
import Forms from '@/component/form';
import { FormItmeType, FormItem } from '@/component/form/type';
import { createTableColumns } from '@/component/table';
import { useStore } from '@/pages/common/costom-hooks';

export default () => {
  // 请求dept数据
  const history = useHistory();
  useStore(['advert']);
  const [form] = Form.useForm();

  const { tableProps, search }: any = useAntdTable(
    (paginatedParams: PaginatedParams, tableProps: any) =>
      advertInfoList({ ...paginatedParams, ...tableProps }),
    {
      form,
      formatResult: formatListResult,
    }
  );

  const { submit, reset } = search;
  const columns = createTableColumns([
    {
      title: '操作',
      render: (item: any) => (
        <a
          onClick={() =>
            history.push(`/advertisement/apply-update?id=${item.id}`)
          }
        >
          审核
        </a>
      ),
      fixed: 'left',
    },
    {
      title: '广告名称',
      dataIndex: 'adName',
    },
    {
      title: '所属机构',
      dataIndex: 'deptName',
    },
    {
      title: '组别名称',
      dataIndex: 'groupName',
      placeHolder: '无',
    },
    {
      title: '广告类型',
      dataIndex: 'type',
      dictType: 'advert_type',
    },
    {
      title: '广告文件类型',
      dataIndex: 'adFileType',
      dictType: 'advert_file_type',
    },
    {
      title: '有效起始时间',
      dataIndex: 'createTime',
    },
    {
      title: '审核状态',
      dataIndex: 'status',
      dictType: 'advert_status',
    },
  ]);
  const forms: FormItem[] = [
    {
      formName: 'deptId',
      formType: FormItmeType.TreeSelectCommon,
    },
    {
      formName: 'adName',
      placeholder: '广告名称',
      formType: FormItmeType.Normal,
    },
    {
      formName: ['adFileType', 'adType', 'status'],
      formType: FormItmeType.SelectCommon,
      dictList: ['advert_file_type', 'advert_type', 'advert_status'],
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
};
