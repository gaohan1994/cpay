/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-08-13 09:32:54 
 * @Last Modified by:   centerm.gaozhiying 
 * @Last Modified time: 2020-08-13 09:32:54 
 * 
 * @todo 软件管理列表
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
import { taskSoftList, softInfoRemove } from '../constants/api';
import { PlusOutlined } from '@ant-design/icons';
import { useRedux } from '@/common/redux-util';
import { ACTION_TYPES_UPLOAD } from '../reducers';
import { RESPONSE_CODE } from '@/common/config';

type Props = {};

function Page(props: Props) {
  // 请求dept数据
  useStore(['driver_type']);
  const [useSelector, dispatch] = useRedux();

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
    history.push(`/upload/manage-detail?id=${item.id}`);
  }

  /**
   * @todo 跳转到编辑页面
   * @param item 
   */
  const onEdit = (item: any) => {
    history.push(`/upload/manage-edit?id=${item.id}`);
  }

  const onRemove = async (item: any) => {
    const param = {
      ids: item.id
    }
    const res = await softInfoRemove(param);
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
      title: '软件名称',
      align: 'center',
      // dataIndex: 'apkName',
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
      formName: ['type'],
      formType: FormItmeType.SelectCommon,
      dictList: ['driver_type'],
    },
  ];

  const onAdd = () => {
    history.push('/upload/manage-add');
  }

  const extraButtons = [
    { title: '新增', onClick: onAdd, icon: <PlusOutlined />, type: "primary" as any, },
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

