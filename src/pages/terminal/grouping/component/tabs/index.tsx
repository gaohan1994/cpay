import React, { useState, useEffect } from 'react';
import { useAntdTable } from 'ahooks';
import invariant from 'invariant';
import { CheckOutlined, ImportOutlined } from '@ant-design/icons';
import { Tabs, Table, Form, notification, Modal } from 'antd';
import { TerminalGroupItem } from '@/pages/terminal/group/types';
import './index.scss';
import { FormItem, FormItmeType } from '@/component/form/type';
import {
  terminalInfoListByIsGroup,
  terminalGroupSetAdd,
  terminalGroupSetRemove,
} from '../../constants';
import Forms from '@/component/form';
import { formatListResult, formatPaginate } from '@/common/request-util';
import { createTableColumns, getStandardPagination } from '@/component/table';
import { RESPONSE_CODE } from '@/common/config';
import { useModal } from '../../costom-hooks';
import ImportModal from '../modal';

const prefix = 'terminal-group-component';

const { TabPane } = Tabs;

type Props = {
  groupSet: TerminalGroupItem[];
  currentGroupSet: TerminalGroupItem;
};

export default (props: Props) => {
  const { visible, setTrue, setFalse } = useModal();
  const [currentTab, setCurrentTab] = useState('1');
  const [selectedRowKeys, setSelectedRowKeys] = useState([] as any[]);
  const { currentGroupSet } = props;

  const [form] = Form.useForm();
  const { tableProps, search }: any = useAntdTable(
    (paginatedParams: any, tableProps: any) => {
      const tap = currentTab ? { groupFlag: currentTab === '1' ? 1 : 0 } : {};
      return terminalInfoListByIsGroup({
        ...formatPaginate(paginatedParams),
        ...tableProps,
        ...(currentGroupSet ? { groupId: currentGroupSet.id } : {}),
        ...(currentTab ? { groupFlag: currentTab === '1' ? 1 : 0 } : {}),
      });
    },
    {
      form,
      formatResult: formatListResult,
    }
  );
  const { submit, reset } = search;

  useEffect(() => {
    reset();
    setSelectedRowKeys([]);
  }, [currentTab]);

  useEffect(() => {
    reset();
    setSelectedRowKeys([]);
  }, [currentGroupSet]);

  const tabsData = [
    {
      tab: currentGroupSet.deptName,
      key: '1',
    },
    {
      tab: '未分组',
      key: '2',
    },
  ];

  const onChangeTab = (key: any) => {
    setCurrentTab(`${key}`);
  };

  const onSelectRowUpdate = async () => {
    try {
      invariant(selectedRowKeys.length > 0, '请选择记录');

      Modal.confirm({
        title: '提示',
        content: `确定${currentTab === '1' ? '解除' : '分组'}选中设备?`,
        okText: '确定',
        cancelText: '取消',
        onOk: async () => {
          const fetchFunction =
            currentTab === '1' ? terminalGroupSetRemove : terminalGroupSetAdd;
          const params: any = {
            ids: selectedRowKeys.join(','),
            groupId: currentGroupSet.id,
          };
          const result = await fetchFunction(params);
          invariant(result.code === RESPONSE_CODE.success, result.msg || ' ');
          notification.success({
            message: `${currentTab === '1' ? '解除成功' : '分组成功'}`,
          });
          setSelectedRowKeys([]);
          submit();
        },
      });
    } catch (error) {
      notification.warn({ message: error.message });
    }
  };

  const forms: FormItem[] = [
    {
      formName: 'deptId',
      formType: FormItmeType.TreeSelectCommon,
    },
    {
      formName: 'tusn',
      formType: FormItmeType.Normal,
      placeholder: '终端序列号',
    },
    {
      formName: '2',
      formType: FormItmeType.Normal,
      placeholder: '终端编号',
    },
    {
      formName: 'merchantId',
      formType: FormItmeType.Normal,
      placeholder: '商户编号',
    },
    {
      formName: 'terminalTypeId',
      formType: FormItmeType.SelectCommon,
      dictList: 'terminal_type',
    },
  ];

  const extraButtons: any[] =
    currentTab === '1'
      ? [
          {
            title: '解除',
            icon: <CheckOutlined />,
            type: 'primary',
            onClick: onSelectRowUpdate,
          },
        ]
      : [
          {
            title: '分组',
            icon: <CheckOutlined />,
            type: 'primary',
            onClick: onSelectRowUpdate,
          },
          {
            title: '导入',
            icon: <ImportOutlined />,
            type: 'primary',
            onClick: () => setTrue(),
          },
        ];

  const columns = createTableColumns([
    {
      title: '终端序列号',
      dataIndex: 'tusn',
    },
    // {
    //   title: '终端厂商',
    //   dataIndex: 'firmName',
    // },
    {
      title: '终端编号',
      dataIndex: 'firmName',
    },
    // {
    //   title: '商户编号',
    //   dataIndex: 'merchantId',
    // },
    {
      title: '终端型号',
      dataIndex: 'terminalTypeName',
    },
    // {
    //   title: '终端类型',
    //   dataIndex: 'terminalTypeName',
    // },
    {
      title: '所属机构',
      dataIndex: 'deptName',
    },
    {
      title: '所属组别',
      dataIndex: 'groupName',
      render: (key, item) => <span>{item['groupName'] || '--'}</span>,
    },
    {
      title: '商户名称',
      dataIndex: 'merchantName',
    },
  ]);

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };
  return (
    <div className={`${prefix}-tab`}>
      <Tabs defaultActiveKey={'1'} onChange={onChangeTab}>
        {tabsData &&
          tabsData.map((tab) => {
            return (
              <TabPane tab={tab.tab} key={tab.key}>
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
                  rowKey="id"
                  rowSelection={rowSelection}
                  style={{ overflowX: 'auto' }}
                  columns={columns}
                  {...tableProps}
                  pagination={getStandardPagination(tableProps.pagination)}
                  // scroll={{ x: 800 }}
                />
              </TabPane>
            );
          })}
      </Tabs>
      <ImportModal visible={visible} setFalse={setFalse} />
    </div>
  );
};
