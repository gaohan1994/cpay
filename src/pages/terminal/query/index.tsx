import React, { useState, useEffect } from 'react';
import { Form, Table } from 'antd';
import { useAntdTable, useSet } from 'ahooks';
import { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { ImportOutlined, LogoutOutlined } from '@ant-design/icons';
import { ButtonProps } from 'antd/lib/button';
import {
  terminalInfoList,
  terminalGroupListByDept,
} from '../message/constants/api';
import { formatListResult } from '@/common/request-util';
import { createTableColumns } from '@/component/table';
import { FormItem, FormItmeType } from '@/component/form/type';
import Forms from '@/component/form';
import { useStore } from '@/pages/common/costom-hooks';
import { ITerminalGroupByDeptId } from '../message/types';
import { ITerminalFirmItem, ITerminalType } from '../types';
import {
  terminalFirmList as getTerminalFirmList,
  terminalTypeListByFirm as getTerminalTypeListByFirm,
} from '../constants';

const prefix = 'terminal-query';

export default () => {
  const [
    fields,
    {
      add: assFields,
      has: hasFields,
      remove: removeFields,
      reset: resetFields,
    },
  ] = useSet([]);

  const [fieldTitle, setFieldTitle] = useState('');
  const [fieldCondition, setFieldCondition] = useState('');

  const forms: FormItem[] = [
    {
      formName: '',
      formType: FormItmeType.Select,
      selectData: [],
    },
  ];

  return (
    <div>
      <div className={`${prefix}-tags`}></div>
    </div>
  );
};
