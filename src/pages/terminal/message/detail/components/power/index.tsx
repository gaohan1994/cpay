import React, { useState } from 'react';
import { useAntdTable } from 'ahooks';
import { ITerminalSystemDetailInfo } from '../../types';
import { Table, Form, Button, notification, Modal } from 'antd';
import { terminalPowerList, powerRemove } from '../constants';
import { formatListResult } from '@/common/request-util';
import { createTableColumns } from '@/component/table';
import invariant from 'invariant';
import { RESPONSE_CODE } from '@/common/config';

type Props = {
  terminalDetailInfo: ITerminalSystemDetailInfo;
};

export default (props: Props) => {
  const { terminalDetailInfo } = props;
  const [selectedRowKeys, setSelectedRowKeys] = useState([] as any);

  const columns = createTableColumns([
    {
      title: '终端序列号',
      dataIndex: 'tusn'
    },
    {
      title: '开机时间',
      dataIndex: 'openTime',
    },
    {
      title: '上次关机时间',
      dataIndex: 'closeTime',
    },
  ]);

  const [form] = Form.useForm();

  const { tableProps, search }: any = useAntdTable(
    (paginatedParams: any, tableProps: any) => {
      return terminalPowerList({
        ...tableProps,
        tusn:
          (terminalDetailInfo.terminalInfo &&
            terminalDetailInfo.terminalInfo.tusn) ||
          '',
      });
    },
    {
      form,
      formatResult: formatListResult,
    }
  );
  const { submit } = search;

  const onDelete = async (type?: string) => {
    try {
      if (type !== 'all') {
        invariant(selectedRowKeys.length > 0, '请选择要删除的记录');
      }
      Modal.confirm({
        title: '提示',
        content: type !== 'all' ? `确认删除选中的记录吗？` : '确认删除全部记录吗？',
        okText: '确定',
        cancelText: '取消',
        onOk: async () => {
          try {
            const payload = {
              ids: type !== 'all'
                ? selectedRowKeys
                : tableProps.dataSource
                  ? tableProps.dataSource.map((i: any) => i.id)
                  : '',
            };
            const result = await powerRemove(payload);
            invariant(result.code === RESPONSE_CODE.success, result.msg || ' ');
            notification.success({ message: '删除成功' });
            setSelectedRowKeys([]);
            submit();
          } catch (error) {
            notification.warn({ message: error.message });
          }
        },
      })

    } catch (error) {
      notification.warn({ message: error.message });
    }
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  }

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <Button type='primary' style={{ marginRight: 12 }} onClick={() => onDelete('all')}>
          全部清空
        </Button>
        <Button type='primary' onClick={() => onDelete()}>
          选择清空
        </Button>
      </div>
      <Table columns={columns} rowKey='id' rowSelection={rowSelection} {...tableProps} />
    </div>
  );
};
