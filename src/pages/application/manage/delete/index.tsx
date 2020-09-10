/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-08-11 18:00:33 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-09-10 15:11:42
 * 
 * @todo 应用管理的回收站页面
 */
import React, { useState } from 'react';
import { Form, Table, Row, Popconfirm, Modal, notification, Divider, Tag, Spin } from 'antd';
import { useAntdTable } from 'ahooks';
import { appInfoDeleteList, appInfoRecove, appInfoDelete } from '../../constants/api';
import { formatListResult } from '@/common/request-util';
import { useStore } from '@/pages/common/costom-hooks';
import Forms from '@/component/form';
import { FormItem, FormItmeType } from '@/component/form/type';
import { createTableColumns, getStandardPagination } from '@/component/table';
import { CloseOutlined } from '@ant-design/icons';
import { RESPONSE_CODE } from '../../../../common/config';
import invariant from 'invariant';
import { getAppStatusColor } from '../../common/util';

type Props = {};

function Page(props: Props) {
  // 请求dept数据
  useStore(['app_status']);
  const [selectedRowKeys, setSelectedRowKeys] = useState([] as any[]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const { tableProps, search }: any = useAntdTable(
    (paginatedParams: any, tableProps: any) =>
      appInfoDeleteList({ pageSize: paginatedParams.pageSize, pageNum: paginatedParams.current, ...tableProps }),
    {
      form,
      formatResult: formatListResult,
    }
  );
  const { submit, reset } = search;

  /**
   * @todo 自定义查询，把选中列表置空
   */
  const customSubmit = () => {
    setSelectedRowKeys([]);
    submit();
  }

  /**
   * @todo 自定义重置，把选中列表置空
   */
  const customReset = () => {
    setSelectedRowKeys([]);
    reset();
  }

  /**
   * @todo 还原单项应用
   * @param item 
   */
  const onRecoveItem = async (item: any) => {
    setLoading(true);
    const res = await appInfoRecove({ ids: item.id });
    setLoading(false);
    if (res && res.code === RESPONSE_CODE.success) {
      notification.success({ message: '还原应用成功' });
      customSubmit();
    } else {
      notification.warn({ message: res.msg || '还原应用失败' });
    }
  }

  /**
   * @todo 删除单项应用
   * @param item 
   */
  const onDeleteItem = async (item: any) => {
    try {
      Modal.confirm({
        title: '提示',
        content: `应用删除后无法还原，确定删除当前应用吗?`,
        okText: '确定',
        cancelText: '取消',
        onOk: async () => {
          const params: any = {
            ids: item.id,
          };
          setLoading(true);
          const result = await appInfoDelete(params);
          setLoading(false);

          if (result && result.code === RESPONSE_CODE.success) {
            notification.success({
              message: '删除成功',
            });
            customSubmit();
          } else {
            notification.warn({ message: result.msg || '删除失败' });
          }
        },
      });
    } catch (error) {
      notification.warn({ message: error.message });
    }
  }

  /**
   *  @todo 批量删除操作
   */
  const onDeleteBatch = async () => {
    try {
      invariant(selectedRowKeys.length > 0, '请选择记录');
      Modal.confirm({
        title: '提示',
        content: `应用删除后无法还原，确定删除选中应用吗?`,
        okText: '确定',
        cancelText: '取消',
        onOk: async () => {
          const params: any = {
            ids: selectedRowKeys.join(','),
          };
          setLoading(true);
          const result = await appInfoDelete(params);
          setLoading(false);

          if (result && result.code === RESPONSE_CODE.success) {
            notification.success({
              message: '删除成功',
            });
            customSubmit();
          } else {
            notification.warn({ message: result.msg || '删除失败' });
          }
        },
      });
    } catch (error) {
      notification.warn({ message: error.message });
    }
  }

  /**
   *  @todo 创建table列
   */
  const columns = createTableColumns([
    {
      title: '操作',
      render: (key, item) => (
        <div>
          <a onClick={() => onRecoveItem(item)}>还原</a>
          <Divider type="vertical" />
          <a onClick={() => onDeleteItem(item)}>删除</a>
        </div>
      ),
      fixed: 'left',
      width: 140,
      align: 'center'
    },
    {
      title: '应用名称',
      align: 'center',
      render: (key, item: any) => {
        return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img src={item.iconPath} style={{ width: 50, height: 50 }} />
            <div style={{ paddingTop: 5 }}>{item.apkName}</div>
          </div>
        )
      }
    },
    {
      title: '应用状态',
      dataIndex: 'status',
      dictType: 'app_status',
      render: (item: any) => {
        return <Tag color={getAppStatusColor(item)}>{item}</Tag>
      }
    },
    {
      title: '应用分类',
      dataIndex: 'typeName',
    },
    {
      title: '终端厂商',
      dataIndex: 'firmName',
    },
    {
      title: '终端型号',
      dataIndex: 'terminalTypes',
    },
    {
      title: '应用包名',
      dataIndex: 'apkCode',
      width: 200
    },
    {
      title: '内部版本',
      dataIndex: 'versionCode',
    },
    {
      title: '所属机构',
      dataIndex: 'deptName',
    },
    {
      title: '所属组别',
      dataIndex: 'groupName',
      placeHolder: '无',
    },
    {
      title: '上传时间',
      dataIndex: 'createTime',
      width: 200
    },
  ]);

  /**
   * @todo 查询表单
   */
  const forms: FormItem[] = [
    {
      formName: 'deptId',
      formType: FormItmeType.TreeSelectCommon,
    },
    {
      formName: 'apkName',
      placeholder: '应用名称',
      formType: FormItmeType.Normal,
    },
  ];

  const extraButtons = [
    { title: '批量删除', onClick: onDeleteBatch, icon: <CloseOutlined /> }
  ]

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  return (
    <Spin spinning={loading}>
      <Forms
        form={form}
        forms={forms}
        formButtonProps={{
          submit: customSubmit,
          reset: customReset,
          extraButtons
        }}
      />
      <Table
        rowKey="id"
        rowSelection={rowSelection}
        columns={columns}
        {...tableProps}
        scroll={{ x: 1500 }}
        pagination={getStandardPagination(tableProps.pagination)}
      />
    </Spin>
  );
}
export default Page;

