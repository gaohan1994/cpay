import React from 'react';
import { Form, Table, notification, Modal } from 'antd';
import { useHistory } from 'react-router-dom';
import { useAntdTable } from 'ahooks';
import { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { advertInfoList, advertInfoRemove } from '../constants/api';
import { formatListResult } from '@/common/request-util';
import Forms from '@/component/form';
import { FormItmeType, FormItem } from '@/component/form/type';
import { createTableColumns, getStandardPagination } from '@/component/table';
import { useStore } from '@/pages/common/costom-hooks';
import { RESPONSE_CODE } from '@/common/config';
import invariant from 'invariant';

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

  const onDelete = async (id: number) => {
    Modal.confirm({
      title: '提示',
      content: `确认删除选中的广告吗？`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          const result = await advertInfoRemove(id);
          invariant(result.code === RESPONSE_CODE.success, result.msg || ' ');
          notification.success({ message: '删除成功' });
          submit();
        } catch (error) {
          notification.warn({ message: error.message });
        }
      },
    });
  };

  const columns = createTableColumns([
    {
      title: '操作',
      render: (item: any) => (
        <div>
          <a onClick={() => history.push(`/advertisement/apply/detail?id=${item.id}`)}>详情</a>
          {` | `}
          <a
            onClick={() =>
              history.push(`/advertisement/apply/update?id=${item.id}`)
            }
          >
            修改
          </a>
          {` | `}
          <a onClick={() => onDelete(item.id)}>删除</a>
        </div>
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
      dataIndex: 'startTime',
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
      formName: 'adFileType',
      formType: FormItmeType.SelectCommon,
      dictList: 'advert_file_type',
    },
    {
      formName: 'adType',
      formType: FormItmeType.SelectCommon,
      dictList: 'advert_type',
    },
    {
      formName: 'status',
      formType: FormItmeType.SelectCommon,
      dictList: 'advert_status',
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
          extraButtons: [{
            title: '新增',
            type: 'primary',
            onClick: () => {
              history.push(`/advertisement/apply/add`)
            }
          }]
        }}
      />
      <Table
        columns={columns}
        {...tableProps}
        pagination={getStandardPagination(tableProps.pagination)}
      />
    </div>
  );
};
