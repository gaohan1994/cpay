import React, { useState, useEffect } from 'react';
import { Form, Table, notification, Modal } from 'antd';
import { useAntdTable } from 'ahooks';
import { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { ImportOutlined, LogoutOutlined } from '@ant-design/icons';
import { ButtonProps } from 'antd/lib/button';
import {
  terminalInfoList,
  terminalGroupListByDept,
  terminalInfoExport,
} from './constants/api';
import { formatListResult, formatPaginate } from '@/common/request-util';
import invariant from 'invariant';
import { createTableColumns } from '@/component/table';
import { FormItem, FormItmeType } from '@/component/form/type';
import Forms from '@/component/form';
import { useStore } from '@/pages/common/costom-hooks';
import { ITerminalGroupByDeptId } from './types';
import { ITerminalFirmItem, ITerminalType } from '../types';
import {
  terminalFirmList as getTerminalFirmList,
  terminalTypeListByFirm as getTerminalTypeListByFirm,
} from '../constants';
import { RESPONSE_CODE, getDownloadPath } from '@/common/config';

export default () => {
  useStore([
    'terminal_type',
    'is_support_dcc',
    'unionpay_connection',
    'buss_type',
    'term_real_status',
  ]);
  const initState = {
    formTreeValue: -1,
    terminalGroup: [] as ITerminalGroupByDeptId[],
    groupValue: '',
    terminalFirmList: [] as ITerminalFirmItem[],
    terminalFirmTypeList: {} as { [key: string]: ITerminalType[] },
  };
  const [groupValue, setGroupValue] = useState(initState.groupValue);
  const [formTreeValue, setFormTreeValue] = useState(initState.formTreeValue);
  const [terminalGroup, setTerminalGroup] = useState(initState.terminalGroup);
  const [terminalFirmList, setTerminalFirmList] = useState(
    initState.terminalFirmList
  );
  const [terminalFirmTypeList, setTerminalFirmTypeList] = useState(
    initState.terminalFirmTypeList
  );
  useEffect(() => {
    getTerminalFirmList({}, setTerminalFirmList);
  }, []);

  useEffect(() => {
    terminalGroupListByDept(formTreeValue, (groupData) => {
      setTerminalGroup(groupData);
      setGroupValue(`${groupData[0].id}`);
    });
  }, [formTreeValue]);

  const [form] = Form.useForm();

  const { tableProps, search }: any = useAntdTable(
    (paginatedParams: PaginatedParams[0], tableProps: any) => {
      return terminalInfoList({
        ...formatPaginate(paginatedParams),
        ...tableProps,
      });
    },
    {
      form,
      formatResult: formatListResult,
    }
  );

  const onChange = (deptId: number) => {
    setFormTreeValue(deptId);
  };

  const onFirmLoadData = (selectedOptions: any) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    getTerminalTypeListByFirm({ firmId: targetOption.value }, (data) => {
      targetOption.loading = false;
      setTerminalFirmTypeList({
        [targetOption.value]: data,
      });
    });
  };
  const { submit, reset } = search;

  const onExport = () => {
    Modal.confirm({
      title: '确认要导出终端信息？',
      onOk: async () => {
        try {
          const result = await terminalInfoExport();
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
      placeholder: '终端编号',
      formName: 'terminalCode',
      formType: FormItmeType.Normal,
    },
    {
      placeholder: '商户编号',
      formName: 'merchantCode',
      formType: FormItmeType.Normal,
    },
    {
      span: 4,
      formName: 'deptId',
      formType: FormItmeType.TreeSelectCommon,
      onChange: onChange,
    },
    {
      placeholder: '所属组',
      formName: 'groupId',
      formType: FormItmeType.Select,
      selectData:
        (terminalGroup &&
          terminalGroup.map((item) => {
            return {
              value: `${item.id}`,
              title: `${item.remark}`,
            };
          })) ||
        [],
      value: groupValue,
      onChange: (id: string) => {
        setGroupValue(`${id}`);
      },
    },
    {
      placeholder: '终端厂商',
      formType: FormItmeType.Cascader,
      formName: 'firmId',
      options:
        (terminalFirmList &&
          terminalFirmList.map((item) => {
            return {
              label: item.firmName,
              value: `${item.id}`,
              isLeaf: false,
              ...(!!terminalFirmTypeList[item.id]
                ? {
                    children: terminalFirmTypeList[item.id].map((typeItem) => {
                      return {
                        label: typeItem.typeName,
                        value: typeItem.typeCode,
                      };
                    }),
                  }
                : {}),
            };
          })) ||
        [],
      loadData: onFirmLoadData,
      changeOnSelect: true,
    },
    {
      placeholder: '终端类型',
      formName: 'terminalTypeIds',
      formType: FormItmeType.SelectCommon,
      dictList: 'terminal_type',
      mode: 'multiple',
    },
    {
      placeholder: '是否支持DCC',
      formName: 'is_support_dcc',
      formType: FormItmeType.SelectCommon,
      dictList: 'is_support_dcc',
    },
    {
      placeholder: '银联间直联',
      formName: 'unionpay_connection',
      formType: FormItmeType.SelectCommon,
      dictList: 'unionpay_connection',
    },
    {
      placeholder: '业务类型',
      formType: FormItmeType.SelectCommon,
      formName: '',
      dictList: 'buss_type',
    },
    {
      placeholder: '终端状态',
      formType: FormItmeType.SelectCommon,
      formName: 'status',
      dictList: 'term_real_status',
    },
  ];

  const columns = createTableColumns([
    {
      title: '操作',
      render: () => <a>审核</a>,
      fixed: 'left',
      width: 100,
    },
    {
      title: '终端序列号',
      dataIndex: 'tusn',
    },
    {
      title: '商户编号',
      width: 80,
      dataIndex: 'merchantId',
    },
    {
      title: '终端厂商',
      width: 120,
      dataIndex: 'merchantName',
    },
    {
      title: '终端型号',
      width: 80,
      dataIndex: 'terminalTypeName',
    },
    {
      title: '终端类型',
      width: 80,
      dataIndex: 'terminalTypeName',
    },
    {
      title: '所属机构',
      width: 80,
      dataIndex: 'deptName',
    },
    {
      title: '所属组',
      dataIndex: 'tusn',
    },
    {
      title: '商户名称',
      dataIndex: 'tusn',
    },
    {
      title: '是否支持DCC',
      dataIndex: 'tusn',
    },
    {
      title: '银联间直连',
      dataIndex: 'tusn',
    },
    {
      title: '业务类型',
      dataIndex: 'tusn',
    },
    {
      title: '终端状态',
      dataIndex: 'tusn',
    },
  ]);

  const extraButtons: ButtonProps[] = [
    {
      title: '导入',
      icon: <ImportOutlined />,
      type: 'primary',
    },
    {
      title: '导出',
      icon: <LogoutOutlined />,
      type: 'primary',
      onClick: onExport,
    },
    // {
    //   title: '高级查询',
    //   type: 'primary',
    // },
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
        scroll={{ x: 2200 }}
      />
    </div>
  );
};
