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
import { getDictText } from '@/pages/common/util';
import  './index.scss'
interface Props {
  visible: boolean;       // modal是否展示
  hideModal: () => void;  // 关闭modal
  fetchParam: any;        // 获取参数
  setOptions: any;        // 设置选中列表
  options: any[];         // 选中列表
  terminalTypeList: any[] // 终端类型
}

export function TableTusns(props: Props) {
  const { visible, hideModal, fetchParam, options, setOptions, terminalTypeList } = props;
  const [selectedRowKeys, setSelectedRowKeys] = useState([] as any[]);
  const [form] = Form.useForm();    // 查询终端的表单
  const { tableProps, search }: any = useAntdTable(
    (paginatedParams: any, tableProps: any) =>
      terminalInfoList({ ...fetchParam, pageSize: paginatedParams.pageSize, pageNum: paginatedParams.current, ...tableProps }),
    {
      manual: true,
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
    visible && customReset()
  }, [visible]);

  /**
   * @todo table查询表单
   */
  const forms: FormItem[] = [
    {
      formName: 'tusn',
      placeholder: '终端序列号',
      formType: FormItmeType.Normal,
    },
    {
      formName: 'deptId',
      formType: FormItmeType.TreeSelectCommon,
    },
    { 
      placeholder: '终端型号',
      formType: FormItmeType.Select,
      selectData:
        terminalTypeList &&
        terminalTypeList.map((item) => {
          return {
            value: `${item.typeCode}`,
            title: `${item.typeName}`,
          };
        }),
      formName: 'terminalTypeName',
    },
    {
      formName: 'terminalCode',
      placeholder: '终端编号',
      formType: FormItmeType.Normal,
    },
    {
      formName: 'merchantName',
      placeholder: '商户名称',
      formType: FormItmeType.Normal,
    },
    {
      formName: 'merchantCode',
      placeholder: '商户编号',
      formType: FormItmeType.Normal
    },
    {
      placeholder: '终端类型',
      formName: 'activateType',
      formType: FormItmeType.SelectCommon,
      dictList: 'terminal_type',
    },
    {
      placeholder: '银联间直连',
      formName: 'cupConnMode',
      formType: FormItmeType.SelectCommon,
      dictList: 'unionpay_connection',
    },
    {
      placeholder: '业务类型',
      formType: FormItmeType.SelectCommon,
      formName: 'bussType',
      dictList: 'buss_type',
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
    // {
    //   title: '所属机构',
    //   dataIndex: 'deptName',
    // },
    {
      title: '终端厂商',
      dataIndex: 'firmName',
    },
    {
      title: '终端型号',
      dataIndex: 'terminalTypeName'
    },
    {
      title: '终端编号',
      dataIndex: 'terminalCode',
    },
    {
      title: '商户编号',
      dataIndex: 'merchantCode',
    },
    {
      title: '终端类型',
      dataIndex: 'activateType',
      dictType: 'terminal_type'
    },
    {
      title: '商户名称',
      dataIndex: 'merchantName'
    },
    {
      title: '银联间直连',
      dataIndex: 'cupConnMode',
      render: (val) => Number(val) === 0 ? '间连' : '直连'
    },
    {
      title: '业务类型',
      dataIndex: 'bussType',
      render:(val) => getDictText(val, 'buss_type')
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
      <div style={{ height: 400, overflow: 'auto', overflowX: 'hidden', padding: '24px 24px 24px 24px' }}>
        <Forms
          form={form}
          forms={forms}
          formButtonProps={{
            submit: customSubmit,
            reset: customReset,
          }}
        />
        <Table
          className='table'
          rowKey="tusn"
          scroll={{ x: 1200 }}
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