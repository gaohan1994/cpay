import React from 'react';
import { Form, Table, Input, Col } from 'antd';
import { useAntdTable, useBoolean } from 'ahooks';
import { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { PlusOutlined } from '@ant-design/icons';
import { terminalGroupList } from './constants';
import { formatListResult } from '@/common/request-util';
import { createTableColumns } from '@/component/table';
import { FormItem, FormItmeType } from '@/component/form/type';
import Forms from '@/component/form';
import { useStore } from '@/pages/common/costom-hooks';
import { formatPaginate } from '@/common/request-util';
import Modal from 'antd/lib/modal/Modal';

const { Item } = Form;
const { TextArea } = Input;
export default () => {
  useStore([]);
  const [modalVisible, { setFalse, setTrue, toggle }] = useBoolean(false);
  const [form] = Form.useForm();
  const [modalForm] = Form.useForm();
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
      span: 4,
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
      render: () => (
        <div>
          <a>修改</a>
          {` | `}
          <a>删除</a>
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
      dataIndex: 'groupName',
      render: (key: any, item: any) => (
        <span>{!!item['groupName'] || '--'}</span>
      ),
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
      onClick: setTrue,
    },
  ];

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
      <Table columns={columns} {...tableProps} />
      <Modal
        title="终端组别新增"
        cancelText="取消"
        okText="确定"
        visible={modalVisible}
        maskClosable
        // onOk={handleOk}
        // confirmLoading={confirmLoading}
        onCancel={setFalse}
      >
        <Form form={modalForm} labelCol={{ span: 4 }} wrapperCol={{ span: 16 }}>
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
            label="类型名称"
            name="typeName"
            rules={[
              {
                required: true,
                message: '请输入类型名称',
              },
            ]}
          >
            <Input />
          </Item>
          <Item
            label="应用图标"
            name="typeIcon"
            rules={[
              {
                required: true,
                message: '请上传应用图标',
              },
            ]}
          >
            <Col>
              <TextArea />
            </Col>
          </Item>
        </Form>
      </Modal>
    </div>
  );
};
