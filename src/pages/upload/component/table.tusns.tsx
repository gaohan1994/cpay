/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-09-01 11:47:28 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-09-10 15:56:39
 * 
 * @todo 终端选择modal
 */
import React, { useState, useEffect } from 'react';
import { Modal, Form, Table, message } from 'antd';
import Forms from '@/component/form';
import { useAntdTable } from 'ahooks';
import { terminalInfoList } from '@/pages/terminal/message/constants/api';
import { formatListResult } from '@/common/request-util';
import { FormItem, FormItmeType } from '@/component/form/type';
import { createTableColumns, getStandardPagination } from '@/component/table';

interface Props {
  visible: boolean;       // modal是否展示
  hideModal: () => void;  // 关闭modal
  fetchParam: any;        // 获取参数
  setOptions: any;        // 设置选中列表
  options: any[];         // 选中列表
}

export function TableTusns(props: Props) {
  const { visible, hideModal, fetchParam, options, setOptions } = props;
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

  useEffect(() => {
    setSelectedRowKeys([]);
    reset();
  }, [visible]);

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

  /**
   * @todo 点击确定，把选中终端放入选中列表中
   */
  const handleOk = () => {
    if (selectedRowKeys.length === 0) {
      message.error('请选择终端');
      return;
    }
    if (options.length === 0) {
      setOptions(selectedRowKeys);
    } else {
      const arr = [...options];
      for (let i = 0; i < selectedRowKeys.length; i++) {
        let item = selectedRowKeys[i];
        let flag = false;
        for (let j = 0; j < options.length; j++) {
          if (item === options[j]) {
            flag = true;
            break;
          }
        }
        if (!flag) {
          arr.push(item);
        }
      }
      setOptions(arr);
    }
    hideModal();
  }

  /**
   * @todo 点击取消调用：关闭modal
   */
  const handleCancel = () => {
    hideModal();
  }

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
      getContainer={false}
    >
      <div style={{ height: 400, overflow: 'auto', overflowX: 'hidden', padding: '24px 0px 24px 24px' }}>
        <Forms
          form={form}
          forms={forms}
          formButtonProps={{
            submit: customSubmit,
            reset: customReset,
          }}
        />
        <Table
          rowKey="tusn"
          rowSelection={rowSelection}
          columns={columns}
          {...tableProps}
          style={{ overflowX: 'auto', paddingRight: '24px' }}
          pagination={getStandardPagination(tableProps.pagination)}
        />
      </div>

    </Modal>
  )
}