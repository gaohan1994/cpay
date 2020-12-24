import React from 'react';
import { useAntdTable } from 'ahooks';
import { LogoutOutlined } from '@ant-design/icons';
import { ITerminalSystemDetailInfo } from '../../types';
import { Table, Form, Modal, notification } from 'antd';
import invariant from 'invariant';
import { FormItem } from '@/component/form/type';
import { terminalFlowList, terminalFlowExport } from '../constants';
import { formatPaginate } from '@/common/request-util';
import { createTableColumns } from '@/component/table';
import { RESPONSE_CODE, getDownloadPath } from '@/common/config';

type Props = {
  terminalDetailInfo: ITerminalSystemDetailInfo;
};

export default (props: Props) => {
  const { terminalDetailInfo } = props;

  const [form] = Form.useForm();
  const { tableProps, search, params: fetchFields }: any = useAntdTable(
    (paginatedParams: any, tableProps: any) => {
      return terminalFlowList({
        ...formatPaginate(paginatedParams),
        ...tableProps,
        tusn:
          (terminalDetailInfo.terminalInfo &&
            terminalDetailInfo.terminalInfo.tusn) ||
          '',
        recordMonth: `${new Date().getFullYear()}${
          new Date().getMonth() >= 9
            ? new Date().getMonth() + 1
            : `0${new Date().getMonth() + 1}`
          }`,
      });
    },
    {
      form,
      formatResult: (mergeResult: any) => {
        return {
          list: mergeResult.data || [],
          total: mergeResult.data.length,
        };
      },
    }
  );
  const { submit, reset } = search;

  const forms: FormItem[] = [
    // {
    //   placeholder: '最小流量',
    //   formName: '',
    //   formType: FormItmeType.Normal,
    // },
    // {
    //   placeholder: '最大流量',
    //   formName: '',
    //   formType: FormItmeType.Normal,
    // },
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
    Modal.confirm({
      title: '确认要导出终端流量信息？',
      onOk: async () => {
        try {
          const result = await terminalFlowExport({
            tusn:
              (terminalDetailInfo.terminalInfo &&
                terminalDetailInfo.terminalInfo.tusn) ||
              '',
            ...fetchFields[1]
          } as any);
          invariant(result.code === RESPONSE_CODE.success, result.msg || ' ');

          const href = getDownloadPath(result.data);
          // window.open(href, '_blank');
          notification.success({ message: '导出成功' });
        } catch (error) {
          notification.warn({ message: error.message });
        }
      },
      okText: '确定',
      cancelText: '取消',
    });
  };

  const extraButtons: any[] = [
    {
      title: '流量信息导出',
      type: 'primary',
      onClick: exportList,
      icon: <LogoutOutlined />,
    },
  ];
  return (
    <div>
      {/* <Forms
        forms={forms}
        form={form}
        formButtonProps={{
          reset,
          submit,
          extraButtons,
        }}
      /> */}
      <div style={{ margin: 12, marginTop: 0 }}>
        总计（移动流量）：
      {tableProps.dataSource && tableProps.dataSource.reduce((pre: any, cur: any) => {
        return pre + cur.monthFlow;
      }, 0)}
        MB
      </div>
      <Table rowKey='tusn' columns={columns} {...tableProps} />
    </div>
  );
};
