/*
 * @Author: centerm.gaozhiying
 * @Date: 2020-09-01 11:47:28
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-09-01 13:34:12
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
import { createTableColumns } from '@/component/table';

import {
  terminalFirmList as getTerminalFirmList,
  terminalTypeListByFirm as getTerminalTypeListByFirm,
} from '@/pages/terminal/constants';

interface Props {
  visible: boolean; // modal是否展示
  hideModal: () => void; // 关闭modal
  fetchParam: any; // 获取参数
  setOptions: any; // 设置选中列表
  options: any[]; // 选中列表
}

export function TableTusns(props: Props) {
  const { visible, hideModal, fetchParam, options, setOptions } = props;
  const [terminalFirmList, setTerminalFirmList] = useState([] as any[]);
  const [terminalFirmTypeList, setTerminalFirmTypeList] = useState([] as any[]);
  const [firmValue, setFirmValue] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([] as any[]);
  const [form] = Form.useForm(); // 查询终端的表单
  const { tableProps, search }: any = useAntdTable(
    (paginatedParams: any, tableProps: any) =>
      terminalInfoList({
        ...fetchParam,
        pageSize: paginatedParams.pageSize,
        pageNum: paginatedParams.current,
        ...tableProps,
      }),
    {
      form,
      formatResult: formatListResult,
    }
  );
  const { submit, reset } = search;

  useEffect(() => {
    getTerminalFirmList({}, setTerminalFirmList);
  }, []);

  useEffect(() => {
    // 终端厂商变化导致终端型号要变
    if (firmValue !== '') {
      form.setFieldsValue({ terminalTypeCode: '' });
      onFirmLoadData(firmValue);
    }
  }, [firmValue]);

  const onFirmLoadData = (firmId: string) => {
    getTerminalTypeListByFirm({ firmId: firmId }, (data) => {
      setTerminalFirmTypeList(data);
    });
  };

  useEffect(() => {
    setSelectedRowKeys([]);
    reset();
  }, [visible]);

  /**
   * @todo table查询表单
   */
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
      placeholder: '终端型号',
      formType: FormItmeType.Select,
      selectData:
        terminalFirmTypeList &&
        terminalFirmTypeList.map((item) => {
          return {
            value: `${item.typeCode}`,
            title: `${item.typeName}`,
          };
        }),
      formName: 'terminalTypeCode',
    },
    {
      formName: 'tusn',
      placeholder: '终端序列号',
      formType: FormItmeType.Normal,
    },

    {
      placeholder: '终端编号',
      formName: 'terminalCode',
      formType: FormItmeType.Normal,
    },
    {
      placeholder: '商户编号',
      formName: 'merchantCode',
      formType: FormItmeType.Normal,
    },
  ].map((item) => {
    return {
      ...item,
      span: 4,
    } as any;
  });

  /**
   * @todo 创建table的列
   */
  const columns = createTableColumns([
    {
      title: '终端序列号',
      dataIndex: 'tusn',
    },
    {
      title: '终端厂商',
      dataIndex: 'firmName',
    },
    {
      title: '终端型号',
      dataIndex: 'terminalTypeName',
    },
    {
      title: '商户名称',
      dataIndex: 'merchantName',
    },
  ]);

  const rowSelection = {
    type: 'radio',
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
  };

  /**
   * @todo 点击取消调用：关闭modal
   */
  const handleCancel = () => {
    hideModal();
  };

  return (
    <Modal
      title={'终端选择'}
      cancelText="取消"
      okText="确定"
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      width={'80vw'}
      bodyStyle={{ padding: 0 }}
      getContainer={false}
    >
      <div
        style={{
          height: 400,
          overflow: 'auto',
          overflowX: 'hidden',
          padding: '24px 0px 24px 24px',
        }}
      >
        <Forms
          form={form}
          forms={forms}
          formButtonProps={{
            submit,
            reset,
          }}
        />
        <Table
          rowKey="tusn"
          rowSelection={rowSelection}
          columns={columns}
          {...tableProps}
          style={{ overflowX: 'auto', paddingRight: '24px' }}
        />
      </div>
    </Modal>
  );
}
