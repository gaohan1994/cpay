import React, { useState } from 'react';
import { Spin, Button, Form, notification, Modal, Table, Divider } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { taskLogSetList, taskLogSetRemove } from './constants/api';
import invariant from 'invariant';
import { RESPONSE_CODE } from '@/common/config';
import { PlusOutlined } from '@ant-design/icons';
import { useAntdTable } from 'ahooks';
import { createTableColumns, getStandardPagination } from '@/component/table';
import AddModal from './add';
import { formatListResult } from '@/common/request-util';



export default function Page() {
  
  const [addForm] = useForm();
  const [loading, setLoading] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editId, setEditId] = useState<number | undefined>()

  const { tableProps, search }: any = useAntdTable(
    (paginatedParams: any, tableProps: any) => {
      return taskLogSetList(
        {
        pageSize: paginatedParams.pageSize, 
        pageNum: paginatedParams.current, 
        ...tableProps,
        },
      );
    },
    {
      form,
      formatResult: formatListResult,
    }
  );
  const { submit, reset } = search;

  /**
   * @todo 修改
   * @param item 
   */
  const onEdit = (item: any) => {
    setAddModalVisible(true);
    addForm.setFieldsValue({ ...item });
    setEditId(item.id)
  }

  /**
   * @todo 删除
   * @param item 
   */
  const onRemove = (item: any) => {
    Modal.confirm({
      title: '提示',
      content: `确认要删除当前日志配置吗?`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          setLoading(true);
          const result = await taskLogSetRemove(`${item.id}`);
          setLoading(false);
          invariant(result && result.code === RESPONSE_CODE.success, result && result.msg || '删除失败，请重试');
          notification.success({ message: '删除成功!' });
          submit();
        } catch (error) {
          notification.error({ message: error.message });
        }
      },
    });
  }


  const columns = createTableColumns([
    {
      title: '操作',
      render: (key, item) => (
        <div>
          {
            <>
              <a onClick={() => onEdit(item)}>修改</a>
              <Divider type="vertical" />
              <a onClick={() => onRemove(item)}>删除</a>
            </>
          }
        </div>
      ),
      fixed: 'right',
      align: 'center',
    },
    {
      title: '应用名称',
      dataIndex: 'appName',
    },
    {
      title: '应用包名',
      dataIndex: 'appCode',
    },
    {
      title: '日志存放路径',
      dataIndex: 'logUrl',
    },
    
  ]);

  const onAdd = () => {  
    setAddModalVisible(true);
  }

  return (
    <Spin spinning={loading}>
      <Button type='primary' icon={<PlusOutlined/>} onClick={() => onAdd()} style={{marginBottom: 20}}>新增</Button>
      <Table
        rowKey="id"
        columns={columns}
        {...tableProps}
        pagination={getStandardPagination(tableProps.pagination)}
      />
      <AddModal
        modalVisible={addModalVisible}
        setModalVisible={setAddModalVisible}
        form={addForm}
        setLoading={setLoading}
        submit={submit}
        editId={editId}
        setEditId={setEditId}
      />
    </Spin>
  );
}