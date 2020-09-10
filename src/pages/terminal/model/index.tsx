import React, { useState, useEffect } from 'react';
import { Form, Table, Input, Col, Button, notification, Modal } from 'antd';
import { useAntdTable, useBoolean } from 'ahooks';
import { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { PlusOutlined } from '@ant-design/icons';
import { formatListResult } from '@/common/request-util';
import { createTableColumns } from '@/component/table';
import { FormItem, FormItmeType } from '@/component/form/type';
import Forms from '@/component/form';
import { useStore } from '@/pages/common/costom-hooks';
import { formatPaginate } from '@/common/request-util';
import { RESPONSE_CODE } from '@/common/config';
import invariant from 'invariant';
import { terminalFirmList as getTerminalFirmList } from '../constants';
import { terminalTypeList, terminalTypeRemove } from './constants';
import { useHistory } from 'react-router-dom';

const { Item } = Form;
const { TextArea } = Input;
export default () => {
  useStore([]);
  const history = useHistory();
  const [form] = Form.useForm();

  const [terminalFirmList, setTerminalFirmList] = useState([] as any[]);
  const [firmValue, setFirmValue] = useState('');

  useEffect(() => {
    getTerminalFirmList({}, setTerminalFirmList);
  }, []);

  const { tableProps, search }: any = useAntdTable(
    (paginatedParams: PaginatedParams[0], tableProps: any) => {
      return terminalTypeList({
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
      placeholder: '终端厂商',
      formType: FormItmeType.Select,
      selectData:
        terminalFirmList &&
        terminalFirmList.map((item) => {
          return {
            value: `${item.id}`,
            title: `${item.firmName}`,
          };
        }),
      onChange: (firmId: any) => {
        console.log('firmId: ', firmId);
        setFirmValue(firmId);
      },
      formName: 'firmId',
    },
    {
      formName: 'typeCode',
      placeholder: '终端型号代码',
      formType: FormItmeType.Normal,
    },
    {
      placeholder: '终端型号名称',
      formName: 'typeName',
      formType: FormItmeType.Normal,
    },
  ];

  const columns = createTableColumns([
    {
      title: '操作',
      render: (item: any) => (
        <div>
          <a onClick={() => onEdit(item)}>修改</a>
          {` | `}
          <a onClick={() => onDelete(item.id)}>删除</a>
        </div>
      ),
    },
    {
      title: '终端型号代码',
      dataIndex: 'typeCode',
    },
    {
      title: '终端型号名称',
      dataIndex: 'typeName',
    },
    {
      title: '终端厂商',
      dataIndex: 'firmName',
    },
    {
      title: '是否启用',
      dataIndex: 'status',
      render: (status: any) => {
        return <span>{status === 0 ? '启用' : '停用'}</span>;
      },
    },
  ]);

  const extraButtons: any[] = [
    {
      title: '新增',
      type: 'primary',
      icon: <PlusOutlined />,
      onClick: () => onAdd(),
    },
  ];

  const onAdd = async () => {
    history.push(`/terminal/model-add`);
  };

  const onDelete = async (id: string) => {
    Modal.confirm({
      title: '提示',
      content: `确认要删除选中的型号么?`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          terminalTypeRemove({ ids: `${id}` }).then((response) => {
            console.log('response');
            if (response.code === RESPONSE_CODE.success) {
              notification.success({ message: '删除成功！' });
            } else {
              notification.success({ message: '删除失败！' });
            }
          });
          submit();
        } catch (error) {
          notification.warn({ message: error.message });
        }
      },
    });
  };

  const onEdit = async (item: any) => {
    console.log('edit');
    history.push(`/terminal/model-edit?id=${item.id}`);
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
      <Table rowKey="id" columns={columns} {...tableProps} />
    </div>
  );
};
