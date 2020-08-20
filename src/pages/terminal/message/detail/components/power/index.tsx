import React from 'react';
import { useAntdTable } from 'ahooks';
import { ITerminalSystemDetailInfo } from '../../types';
import { Table, Form } from 'antd';
import { terminalPowerList } from '../constants';
import { formatListResult } from '@/common/request-util';
import { createTableColumns } from '@/component/table';

type Props = {
  terminalDetailInfo: ITerminalSystemDetailInfo;
};

export default (props: Props) => {
  const { terminalDetailInfo } = props;

  const columns = createTableColumns([
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
  return (
    <div>
      <Table columns={columns} {...tableProps} />
    </div>
  );
};
