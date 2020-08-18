import React, { useState } from 'react';
import { useAntdTable } from 'ahooks';
import { ITerminalSystemDetailInfo } from '../../types';
import { Descriptions, Row, Col, Table, Form } from 'antd';

import Forms from '@/component/form';
import { FormItem, FormItmeType } from '@/component/form/type';
import { terminalFlowList } from '../constants';
import { formatListResult } from '@/common/request-util';
import { createTableColumns } from '@/component/table';

type Props = {
  terminalDetailInfo: ITerminalSystemDetailInfo;
};

export default (props: Props) => {
  const { terminalDetailInfo } = props;

  const [form] = Form.useForm();

  const { tableProps, search }: any = useAntdTable(
    (paginatedParams: any, tableProps: any) => {
      return terminalFlowList({
        // ...formatPaginate(paginatedParams),
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
  const { submit, reset } = search;

  const forms: FormItem[] = [
    {
      placeholder: '最小流量',
      formName: '',
      formType: FormItmeType.Normal,
    },
    {
      placeholder: '最大流量',
      formName: '',
      formType: FormItmeType.Normal,
    },
  ];

  const columns = createTableColumns([
    {
      title: '流量日期',
      dataIndex: 'recordMonth',
    },
    {
      title: '最近流量(MB)',
      dataIndex: 'monthFlow',
    },
  ]);

  const exportList = () => {
    console.log('exportList');
  };

  const extraButtons: any[] = [
    {
      title: '流量信息导出',
      type: 'primary',
      onClick: exportList,
    },
  ];
  return (
    <div>
      <Forms
        forms={forms}
        form={form}
        formButtonProps={{
          reset,
          submit,
          extraButtons,
        }}
      />
      <div>总计（移动流量）：0MB</div>
      <Table columns={columns} {...tableProps} />
    </div>
  );
};
