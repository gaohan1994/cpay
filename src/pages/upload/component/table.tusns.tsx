import React, { useState } from 'react';
import { Modal, Form, Table } from 'antd';
import Forms from '@/component/form';
import { useAntdTable } from 'ahooks';
import { terminalInfoList } from '@/pages/terminal/message/constants/api';
import { formatListResult } from '@/common/request-util';
import { FormItem, FormItmeType } from '@/component/form/type';
import { createTableColumns } from '@/component/table';

interface Props {
  visible: boolean;
  hideModal: () => void;
  handleOk: () => void;
  handleCancel: () => void;
  fetchParam: any;
}

export function TableTusns(props: Props) {
  const { visible, hideModal, handleOk, handleCancel, fetchParam } = props;
  const [selectedRowKeys, setSelectedRowKeys] = useState([] as any[]);
  const [form] = Form.useForm();    // 查询终端的表单
  const { tableProps, search }: any = useAntdTable(
    (paginatedParams: any, tableProps: any) =>
      terminalInfoList({ ...fetchParam, pageSize: paginatedParams.pageSize, pageNum: paginatedParams.current, ...tableProps }),
    {
      form,
      formatResult: formatListResult,
    }
  );
  const { submit, reset } = search;

  /**
   * @todo table查询表单
   */
  const forms: FormItem[] = [
    {
      span: 6,
      formName: 'tusn',
      placeholder: '终端序列号',
      formType: FormItmeType.Normal,
    },
    {
      span: 6,
      formName: 'merchantName',
      placeholder: '商户名称',
      formType: FormItmeType.Normal,
    },
    {
      span: 8,
      formName: 'deptId',
      formType: FormItmeType.TreeSelectCommon,
    },
  ];

   /**
   * @todo 创建table的列
   */
  const columns = createTableColumns([
    {
      title: '终端序列号',
      dataIndex: 'tusn',
    },
    {
      title: '所属机构',
      dataIndex: 'deptName',
    },
    {
      title: '终端厂商',
      dataIndex: 'firmName',
    },
    {
      title: '终端型号',
      dataIndex: 'terminalTypeName'
    },
    {
      title: '商户名称',
      dataIndex: 'merchantName'
    }
  ]);

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  return (
    <Modal
      title={"终端选择"}
      cancelText="取消"
      okText="确定"
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      width={'60vw'}
      bodyStyle={{ padding: 0 }}
    >
      <div style={{ height: 400, overflow: 'auto', overflowX: 'hidden', padding: '24px 0px 24px 24px' }}>
        <Forms
          form={form}
          forms={forms}
          formButtonProps={{
            submit,
            reset,
          }}
        />
        <Table rowKey="tusn" rowSelection={rowSelection} columns={columns}  {...tableProps} style={{ overflowX: 'auto', paddingRight: '24px' }} />
      </div>
    </Modal>
  )
}