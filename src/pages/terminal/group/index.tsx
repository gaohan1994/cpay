import React, { useState } from 'react';
import { Form, Table, Input, Col, Button, notification, Modal, Divider } from 'antd';
import { useAntdTable, useBoolean } from 'ahooks';
import { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { PlusOutlined } from '@ant-design/icons';
import {
  terminalGroupList,
  terminalGroupAdd,
  terminalGroupDelete,
  terminalGroupEdit,
} from './constants';
import { formatListResult } from '@/common/request-util';
import { createTableColumns, getStandardPagination } from '@/component/table';
import { FormItem, FormItmeType } from '@/component/form/type';
import Forms from '@/component/form';
import { renderCommonTreeSelectForm } from '@/component/form/render';
import { useStore } from '@/pages/common/costom-hooks';
import { formatPaginate } from '@/common/request-util';
import { RESPONSE_CODE } from '@/common/config';
import invariant from 'invariant';

const { Item } = Form;
const { TextArea } = Input;
export default () => {
  useStore([]);
  const [form] = Form.useForm();
  const [modalForm] = Form.useForm();
  const [editId, setEditId] = useState('');
  const [modalTitle, setModalTitle] = useState('新增');
  const [modalVisible, { setFalse, setTrue }] = useBoolean(false);
  const { tableProps, search }: any = useAntdTable(
    (paginatedParams: PaginatedParams[0], tableProps: any) => {
      return terminalGroupList({
        ...formatPaginate(paginatedParams),
        ...tableProps,
      });
    },
    {
      form,
      formatResult: formatListResult,
    }
  );
  const { submit, reset } = search;

  const forms: FormItem[] = [
    {
      formName: 'deptId',
      formType: FormItmeType.TreeSelectCommon,
    },
    {
      formName: 'name',
      formType: FormItmeType.Normal,
      placeholder: '组别名称',
    },
  ];

  const columns = createTableColumns([
    {
      title: '操作',
      render: (item: any) => (
        <div>
          <a onClick={() => onEdit(item)}>修改</a>
          <Divider type='vertical' />
          <a onClick={() => onDelete(item.id)}>删除</a>
        </div>
      ),
      fixed: 'left',
      width: 100,
    },
    {
      title: '所属机构',
      dataIndex: 'deptName',
    },
    {
      title: '组别名称',
      dataIndex: 'name',
      render: (item: any) => {
        return <span>{item || '--'}</span>;
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
  ]);

  const extraButtons: any[] = [
    {
      title: '新增',
      type: 'primary',
      icon: <PlusOutlined />,
      onClick: () => {
        modalForm.setFieldsValue({
          name: '',
          deptId: '',
          remark: '',
        });
        setEditId('');
        setModalTitle('新增');
        setTrue();
      },
    },
  ];

  const onAdd = async () => {
    try {
      const values: any = await modalForm.getFieldsValue();
      const payload = {
        ...values,
        ...(modalTitle === '修改' && editId ? { id: editId } : {}),
      };
      const fetchFunction =
        modalTitle === '修改' ? terminalGroupEdit : terminalGroupAdd;
      const result = await fetchFunction(payload);
      invariant(result.code === RESPONSE_CODE.success, result.msg || ' ');
      setFalse();
      notification.success({ message: `${modalTitle}分组成功!` });
      submit();
    } catch (error) {
      error.message && notification.warn({ message: error.message });
    }
  };

  const onDelete = async (id: string) => {
    Modal.confirm({
      title: '提示',
      content: `确认要删除选中的组别么?`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          const payload: any = { ids: id };
          const result = await terminalGroupDelete(payload);
          invariant(result.code === RESPONSE_CODE.success, result.msg || ' ');
          notification.success({ message: '删除分组成功!' });
          submit();
        } catch (error) {
          notification.warn({ message: error.message });
        }
      },
    });
  };

  const onEdit = async (item: any) => {
    modalForm.setFieldsValue({ ...item });
    setEditId(item.id);
    setModalTitle('修改');
    setTrue();
  };
  return (
    <div>
      <Forms
        form={form}
        forms={forms}
        formButtonProps={{
          reset,
          submit,
          extraButtons,
        }}
      />
      <Table
        rowKey="id"
        columns={columns}
        {...tableProps}
        pagination={getStandardPagination(tableProps.pagination)}
      />
      <Modal
        title={`终端组别${modalTitle}`}
        cancelText="取消"
        okText="确定"
        visible={modalVisible}
        maskClosable
        // footer={null}
        onOk={onAdd}
        // confirmLoading={confirmLoading}
        onCancel={() => {
          setModalTitle('新增');
          setFalse();
        }}
      >
        <Form
          form={modalForm}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          onFinish={onAdd}
        >
          <Item
            label="组别名称"
            name="name"
            rules={[
              {
                required: true,
                message: '请输入组别名称',
              },
            ]}
          >
            <Input />
          </Item>
          <Item
            label="所属机构"
            name="deptId"
            rules={[
              {
                required: true,
                message: '请选择机构',
              },
            ]}
          >
            {renderCommonTreeSelectForm(
              {
                formName: 'deptId',
                formType: FormItmeType.TreeSelectCommon,
              },
              false
            )}
          </Item>
          <Item
            label="备注"
            name="remark"
            rules={[
              {
                required: true,
                message: '请填写备注',
              },
            ]}
          >
            <TextArea style={{ minHeight: 150 }} />
          </Item>
        </Form>
      </Modal>
    </div>
  );
};
