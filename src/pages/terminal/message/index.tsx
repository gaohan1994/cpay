import React, { useState, useEffect } from 'react';
import { Form, Table } from 'antd';
import { useAntdTable } from 'ahooks';
import { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { terminalInfoList, terminalGroupListByDept } from './constants/api';
import { formatListResult } from '@/common/request-util';
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

export default () => {
  useStore('terminal');
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
    (paginatedParams: PaginatedParams, tableProps: any) => {
      return terminalInfoList(paginatedParams, tableProps);
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
    console.log('targetOption: ', targetOption);
    getTerminalTypeListByFirm({ firmId: targetOption.value }, (data) => {
      targetOption.loading = false;
      setTerminalFirmTypeList({
        [targetOption.value]: data,
      });
    });
  };

  const { submit, reset } = search;

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
    // {
    //   placeholder: '是否支持DCC',
    //   formName: ''

    // },
    //     {
    //       银联间直联
    //     },
    //     {
    //       业务类型
    //     },
    //     {
    //       终端状态
    //     }
  ];

  return (
    <div>
      <Forms
        form={form}
        forms={forms}
        formButtonProps={{
          reset,
          submit,
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
