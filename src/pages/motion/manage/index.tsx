import React, { useState, useEffect } from 'react';
import { Form, Table, notification, Modal, Input, Button } from 'antd';
import { useAntdTable } from 'ahooks';
import { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { LogoutOutlined } from '@ant-design/icons';
import { ButtonProps } from 'antd/lib/button';
import {
  relocationKeyList,
  relocationKeyRemove,
  relocationKeyAdd,
  relocationKeyEdit,
} from '../constants';
import { formatListResult, formatPaginate } from '@/common/request-util';
import invariant from 'invariant';
import { createTableColumns } from '@/component/table';
import { FormItem, FormItmeType } from '@/component/form/type';
import Forms from '@/component/form';
import { useStore } from '@/pages/common/costom-hooks';
import { RESPONSE_CODE, getDownloadPath } from '@/common/config';
import history from '@/common/history-util';

const { TextArea } = Input;
const { Item } = Form;

export default () => {
  useStore([]);
  const [modalForm] = Form.useForm();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('新增');
  const [editItem, setEditItem] = useState({} as any);
  const { tableProps, search }: any = useAntdTable(
    (paginatedParams: PaginatedParams[0], tableProps: any) => {
      return relocationKeyList({
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

  const onExport = () => {
    // Modal.confirm({
    //   title: '确认要导出终端信息？',
    //   onOk: async () => {
    //     try {
    //       const result = await terminalShiftExport({});
    //       invariant(result.code === RESPONSE_CODE.success, result.msg || ' ');
    //       const href = getDownloadPath(result.data);
    //       window.open(href, '_blank');
    //       notification.success({ message: '导出成功' });
    //     } catch (error) {
    //       notification.warn({ message: error.message });
    //     }
    //   },
    //   okText: '确定',
    //   cancelText: '取消',
    // });
  };

  const onReset = () => {
    Modal.confirm({
      title: '确认重置地图次数吗？',
      onOk: async () => {
        try {
          // const result = await relocationKeyRemove(item.id);
          // invariant(result.code === RESPONSE_CODE.success, result.msg || ' ');
          // notification.success({ message: '删除成功' });
        } catch (error) {
          notification.warn({ message: error.message });
        }
      },
      okText: '确定',
      cancelText: '取消',
    });
  };

  const onDelete = (item: any) => {
    Modal.confirm({
      title: '确认要删除终端信息？',
      onOk: async () => {
        try {
          const result = await relocationKeyRemove(item.id);
          invariant(result.code === RESPONSE_CODE.success, result.msg || ' ');
          notification.success({ message: '删除成功' });
          submit();
        } catch (error) {
          notification.warn({ message: error.message });
        }
      },
      okText: '确定',
      cancelText: '取消',
    });
  };

  const onAdd = () => {
    setModalTitle('新增');
    setVisible(true);
  };

  const onEdit = (item: any) => {
    setModalTitle('修改');
    setVisible(true);
    setEditItem(item);
    modalForm.setFieldsValue({
      mapKey: item.mapKey,
      dayCanUsedCount: item.dayCanUsedCount,
    });
  };

  const onFinish = async () => {
    const validate = await modalForm.validateFields();
    if (!validate) {
      return;
    }
    try {
      const values = modalForm.getFieldsValue();
      const fetchUrl =
        modalTitle === '新增' ? relocationKeyAdd : relocationKeyEdit;
      const payload: any = {
        ...values,
        ...(modalTitle === '修改' ? { id: editItem.id } : {}),
      };
      const result = await fetchUrl(payload);
      invariant(result.code === RESPONSE_CODE.success, result.msg || ' ');
      notification.success({ message: `${modalTitle}成功` });
      submit();
      setEditItem({});
      setVisible(false);
      setModalTitle('新增');
    } catch (error) {
      notification.warn({ message: error.message });
    }
  };

  const forms: FormItem[] = [
    {
      placeholder: 'key',
      formName: 'key',
      formType: FormItmeType.Normal,
    },
  ];

  const columns = createTableColumns([
    {
      title: '操作',
      width: 200,
      render: (key, item: any) => (
        <div>
          <a onClick={() => onEdit(item)}>详情</a>
          {` | `}
          <a onClick={() => onEdit(item)}>修改</a>
          {` | `}
          <a onClick={() => onDelete(item)}>删除</a>
        </div>
      ),
      fixed: 'left',
    },
    {
      title: 'key',
      width: 240,
      dataIndex: 'mapKey',
    },
    {
      title: '当日已调用次数',
      dataIndex: 'dayUsedCount',
    },
    {
      title: '当日可调用最大次数',
      dataIndex: 'dayCanUsedCount',
    },
  ]);

  const extraButtons: ButtonProps[] = [
    {
      title: '新增',
      icon: <LogoutOutlined />,
      type: 'primary',
      onClick: onAdd,
    },
    {
      title: '次数重置',
      icon: <LogoutOutlined />,
      type: 'primary',
      onClick: onReset,
    },
    {
      title: '导出',
      icon: <LogoutOutlined />,
      type: 'primary',
      onClick: onExport,
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
      <Table
        rowKey="id"
        style={{ overflowX: 'auto' }}
        columns={columns}
        {...tableProps}
      />
      <Modal
        visible={visible}
        title={`地图管理${modalTitle}`}
        cancelText="取消"
        okText="确定"
        maskClosable
        onCancel={() => {
          setModalTitle('新增');
          setVisible(false);
        }}
        onOk={onFinish}
      >
        <Form form={modalForm} labelCol={{ span: 8 }}>
          <Item
            label="地图key"
            name="mapKey"
            rules={[
              {
                required: true,
                message: '请输入地图key',
              },
            ]}
          >
            <Input />
          </Item>
          <Item
            label="当日可调用最大次数"
            name="dayCanUsedCount"
            rules={[
              {
                required: true,
                message: '请输入当日可调用最大次数',
              },
            ]}
          >
            <Input />
          </Item>
        </Form>
      </Modal>
    </div>
  );
};
