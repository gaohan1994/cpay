import React from 'react';
import { useAntdTable } from 'ahooks';
import { ITerminalSystemDetailInfo } from '../../types';
import { Table, Form } from 'antd';
import Forms from '@/component/form';
import { FormItem, FormItmeType } from '@/component/form/type';
import { terminalAppList } from '@/pages/terminal/application/constants';
import { formatListResult } from '@/common/request-util';
import { createTableColumns } from '@/component/table';

type Props = {
  terminalDetailInfo: ITerminalSystemDetailInfo;
};

export default (props: Props) => {
  const { terminalDetailInfo } = props;
  const forms: FormItem[] = [
    {
      placeholder: '应用包名',
      formName: 'appCode',
      formType: FormItmeType.Normal,
    },
    {
      placeholder: '应用名称',
      formName: 'appName',
      formType: FormItmeType.Normal,
    },
    {
      placeholder: '应用版本',
      formName: 'versionCode',
      formType: FormItmeType.Normal,
    },
    {
      placeholder: '外部版本',
      formName: 'versionName',
      formType: FormItmeType.Normal,
    },
  ];

  const columns = createTableColumns([
    {
      title: '终端序列号',
      dataIndex: 'tusn',
    },
    {
      title: '应用包名',
      dataIndex: 'appCode',
    },
    {
      title: '应用名称',
      dataIndex: 'appName',
    },
    {
      title: '应用版本',
      dataIndex: 'versionName',
    },
    {
      title: '内部版本',
      dataIndex: 'versionCode',
    },
  ]);

  const [form] = Form.useForm();

  const { tableProps, search }: any = useAntdTable(
    (paginatedParams: any, tableProps: any) => {
      return terminalAppList({
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

  return (
    <div>
      <Forms
        forms={forms}
        form={form}
        formButtonProps={{
          reset,
          submit,
        }}
      />
      <Table columns={columns} {...tableProps} />
    </div>
  );
};
