import React, { useState, useEffect } from 'react';
import { Form, Table, Row, Popconfirm, Modal, notification, Divider } from 'antd';
import { useAntdTable } from 'ahooks';
import { appInfoList, getAppTypeList, appInfoDeleteList, appInfoRecove, appInfoDelete } from '../../constants/api';
import { formatListResult } from '@/common/request-util';
import { useStore } from '@/pages/common/costom-hooks';
import Forms from '@/component/form';
import { FormItem, FormItmeType } from '@/component/form/type';
import { createTableColumns } from '@/component/table';
import history from '@/common/history-util';
import { ITerminalGroupByDeptId } from '@/pages/terminal/message/types';
import { terminalGroupListByDept } from '@/pages/terminal/message/constants/api';
import { DeleteOutlined, CloseOutlined } from '@ant-design/icons';
import { IAppType } from '../../types';
import '@/index.css';
import { RESPONSE_CODE } from '../../../../common/config';
import invariant from 'invariant';

type Props = {};

function Page(props: Props) {
  // 请求dept数据
  useStore(['app_status']);

  const [selectedRowKeys, setSelectedRowKeys] = useState([] as any[]);

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

  const onRecoveItem = async (item: any) => {
    const res = await appInfoRecove({ ids: item.id });
    if (res.code === RESPONSE_CODE.success) {
      notification.success({message: '还原应用成功'});
      submit();
    } else {
      notification.warn({message: res.msg || '还原应用失败'});
    }
  }

  const onDeleteItem = async (item: any) => {
    const res = await appInfoDelete({ ids: item.id });
    if (res.code === RESPONSE_CODE.success) {
      notification.success({message: '删除应用成功'});
      submit();
    } else {
      notification.warn({message: res.msg || '删除应用失败'});
    }
  }

  const onDeleteBatch = async () => {
    try {
      invariant(selectedRowKeys.length > 0, '请选择记录');

      Modal.confirm({
        title: '提示',
        content: `应用删除后无法还原，确定删除选中应用?`,
        okText: '确定',
        cancelText: '取消',
        onOk: async () => {
          const params: any = {
            ids: selectedRowKeys.join(','),
          };
          const result = await appInfoDelete(params);

          if (result.code === RESPONSE_CODE.success) {
            notification.success({
              message: '删除成功',
            });
            setSelectedRowKeys([]);
            submit();
          } else {
            notification.warn({ message: result.msg || '删除失败' });
          }
        },
      });
    } catch (error) {
      notification.warn({ message: error.message });
    }
  }

  const columns = createTableColumns([
    {
      title: '操作',
      render: (key, item) => (
        <Row style={{ alignItems: 'center' }}>
          <Popconfirm
            title="是否确认还原？"
            onConfirm={() => onRecoveItem(item)}
            okText="是"
            cancelText="否"
          >
            <a href="#">还原</a>
          </Popconfirm>
          <Divider type="vertical" />
          <Popconfirm
            title="是否确认删除？"
            onConfirm={() => onDeleteItem(item)}
            okText="是"
            cancelText="否"
          >
            <a href="#">删除</a>
          </Popconfirm>
        </Row>
      ),
      fixed: 'left',
      width: 150,
    },
    {
      title: '应用名称',
      dataIndex: 'apkName',
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
    },
    {
      title: '应用状态',
      dataIndex: 'status',
      dictType: 'app_status',
    },
  ]);

  const forms: FormItem[] = [
    {
      span: 4,
      formName: 'deptId',
      formType: FormItmeType.TreeSelectCommon,
      // onChange: onChange,
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
  console.log('rowSelection:', rowSelection);

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
      <Table rowKey="id" rowSelection={rowSelection} columns={columns}  {...tableProps} scroll={{ x: 1600 }} />
    </div>
  );
}
export default Page;

