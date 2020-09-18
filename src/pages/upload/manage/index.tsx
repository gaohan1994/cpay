/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-08-13 09:32:54 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-09-10 16:04:07
 * 
 * @todo 软件管理列表
 */
import React, { useState } from 'react';
import { Form, Table, Divider, notification, Modal, Spin } from 'antd';
import { useAntdTable } from 'ahooks';
import { formatListResult } from '@/common/request-util';
import { useStore } from '@/pages/common/costom-hooks';
import Forms from '@/component/form';
import { FormItem, FormItmeType } from '@/component/form/type';
import { createTableColumns, getStandardPagination } from '@/component/table';
import history from '@/common/history-util';
import { taskSoftList, softInfoRemove } from '../constants/api';
import { PlusOutlined } from '@ant-design/icons';
import { RESPONSE_CODE } from '@/common/config';
import invariant from 'invariant';

type Props = {};

function Page(props: Props) {
  // 请求dept数据
  useStore(['driver_type', 'unionpay_connection', 'is_dcc_sup']);

  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();
  const { tableProps, search }: any = useAntdTable(
    (paginatedParams: any, tableProps: any) =>
      taskSoftList({ pageSize: paginatedParams.pageSize, pageNum: paginatedParams.current, ...tableProps }),
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
    history.push(`/upload/manage/detail?id=${item.id}`);
  }

  /**
   * @todo 跳转到编辑页面
   * @param item 
   */
  const onEdit = (item: any) => {
    history.push(`/upload/manage/edit?id=${item.id}`);
  }

  /**
   * @todo 删除软件信息
   * @param item 
   */
  const onRemove = async (item: any) => {
    Modal.confirm({
      title: '提示',
      content: `确认要删除当前软件吗?`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          const param = {
            ids: item.id
          }
          setLoading(true);
          const result = await softInfoRemove(param);
          setLoading(false);
          invariant(result && result.code === RESPONSE_CODE.success, result && result.msg || '删除软件信息失败，请重试');
          notification.success({ message: '删除软件信息成功!' });
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
      align: 'center',
      width: 150,
    },
    {
      title: '软件名称',
      align: 'center',
      render: (key, item: any) => {
        return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {
              item.iconPath && (
                <img src={item.iconPath} style={{ width: 50, height: 50 }} />
              )
            }
            <div style={{ paddingTop: 5 }}>{item.appName}</div>
          </div>
        )
      }
    },
    {
      title: '软件编码',
      dataIndex: 'code',
    },
    {
      title: '所属机构',
      dataIndex: 'deptName',
    },
    {
      title: '软件类型',
      dataIndex: 'type',
      dictType: 'driver_type'
    },
    {
      title: '是否支持DCC',
      dataIndex: 'dccSupFlag',
      dictType: 'is_dcc_sup'
    },
    {
      title: '银联间直联',
      dataIndex: 'cupConnMode',
      dictType: 'unionpay_connection'
    },
  ]);

  /**
   * @todo table查询表单
   */
  const forms: FormItem[] = [
    {
      formName: 'appName',
      placeholder: '软件名称',
      formType: FormItmeType.Normal,
    },
    {
      formName: 'code',
      placeholder: '软件编码',
      formType: FormItmeType.Normal,
    },
    {
      formName: ['type', 'dccSupFlag', 'cupConnMode'],
      formType: FormItmeType.SelectCommon,
      dictList: ['driver_type', 'is_dcc_sup', 'unionpay_connection'],
    },
  ];

  /**
   * @todo 跳转到新增页面
   */
  const onAdd = () => {
    history.push('/upload/manage/add');
  }

  const extraButtons = [
    { title: '新增', onClick: onAdd, icon: <PlusOutlined />, type: "primary" as any, },
  ]

  return (
    <Spin spinning={loading}>
      <Forms
        form={form}
        forms={forms}
        formButtonProps={{
          submit,
          reset,
          extraButtons
        }}
      />
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

