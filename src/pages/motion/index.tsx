import React, { useState, useEffect } from 'react';
import { Form, Table, notification, Modal } from 'antd';
import { useAntdTable } from 'ahooks';
import { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { ImportOutlined, LogoutOutlined } from '@ant-design/icons';
import { ButtonProps } from 'antd/lib/button';
import { terminalShiftList, terminalShiftExport } from './constants';
import { formatListResult, formatPaginate } from '@/common/request-util';
import invariant from 'invariant';
import { createTableColumns } from '@/component/table';
import { FormItem, FormItmeType } from '@/component/form/type';
import Forms from '@/component/form';
import { useStore } from '@/pages/common/costom-hooks';
import { RESPONSE_CODE, getDownloadPath } from '@/common/config';
import history from '@/common/history-util';

export default () => {
  useStore([]);

  const [form] = Form.useForm();
  const { tableProps, search }: any = useAntdTable(
    (paginatedParams: PaginatedParams[0], tableProps: any) => {
      return terminalShiftList({
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
    Modal.confirm({
      title: '确认要导出终端信息？',
      onOk: async () => {
        try {
          const result = await terminalShiftExport({});
          invariant(result.code === RESPONSE_CODE.success, result.msg || ' ');

          const href = getDownloadPath(result.data);
          window.open(href, '_blank');
          notification.success({ message: '导出成功' });
        } catch (error) {
          notification.warn({ message: error.message });
        }
      },
      okText: '确定',
      cancelText: '取消',
    });
  };

  const forms: FormItem[] = [
    {
      placeholder: '终端序列号',
      formName: 'tusn',
      formType: FormItmeType.Normal,
    },
    {
      span: 4,
      formName: 'deptId',
      formType: FormItmeType.TreeSelectCommon,
    },
    {
      placeholder: '终端编号',
      formName: 'terminalCode',
      formType: FormItmeType.Normal,
    },
    {
      placeholder: '商户号',
      formName: 'terminalTypeIds',
      formType: FormItmeType.Normal,
    },
  ];

  // createTime: "2020-08-24 16:06:42"
  // curAddress: "福建省福州市闽侯县荆溪镇海峡软件新城"
  // deptId: 100
  // distance: "2794.29"
  // id: 1
  // latitude: "38.037601"
  // lockStatus: 1
  // lockTime: "2020-08-24 16:06:37"
  // longidude: "114.535231"
  // moveCount: 1
  // moveStatus: 1
  // operationType: 1
  // tusn: "00000104D1G0000000001"
  const columns = createTableColumns([
    {
      title: '操作',
      render: (key, item: any) => (
        <a
          onClick={() => {
            history.push(`/terminal/message-detail?id=${item.id}`);
          }}
        >
          详情
        </a>
      ),
      fixed: 'left',
      width: 100,
    },
    {
      title: '终端序列号',
      width: 240,
      dataIndex: 'tusn',
    },
    {
      title: '终端号',
      dataIndex: 'merchantId',
    },
    {
      title: '商户号',
      dataIndex: 'merchantName',
    },
    {
      title: '所属机构',
      width: 80,
      dataIndex: 'deptName',
    },
    {
      title: '商家地址',
      width: 240,
      dataIndex: '',
    },
    {
      title: '经度',
      dataIndex: 'latitude',
    },
    {
      title: '纬度',
      dataIndex: 'longidude',
    },
    {
      title: '终端最近上送地理位置',
      dataIndex: 'curAddress',
    },
    {
      title: '偏移距离（米）',
      dataIndex: 'distance',
    },
    {
      title: '记录时间',
      dataIndex: 'updateTime',
    },
  ]);

  const extraButtons: ButtonProps[] = [
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
        style={{ overflowX: 'auto' }}
        columns={columns}
        rowKey="email"
        {...tableProps}
        scroll={{ x: 2000 }}
      />
    </div>
  );
};
