/**
 * 参数模板详情
 * @Author: centerm.gaohan 
 * @Date: 2020-10-14 11:10:25 
 * @Last Modified by: centerm.gaohan
 * @Last Modified time: 2020-10-14 11:38:49
 */
import React, { useEffect, useState } from 'react';
import { Form, DatePicker, Button, notification, Input } from 'antd';
import { useHistory } from 'react-router-dom';
import { useStore } from '@/pages/common/costom-hooks';
import { useSelectorHook } from '@/common/redux-util';
import { } from '@/component/form';
import { CustomFormItems } from '@/component/custom-form';
import {
  renderTreeSelect,
  renderSelect,
  renderCommonSelectForm,
  renderSelectForm,
} from '@/component/form/render';
import { } from '../constants';
import { FormItmeType } from '@/component/form/type';
import { terminalGroupListByDept } from '@/pages/terminal/message/constants/api';
import { ITerminalGroupByDeptId } from '@/pages/terminal/message/types';
import { RESPONSE_CODE } from '@/common/config';
import moment from 'moment';
import invariant from 'invariant';
import {
  terminalFirmList as getTerminalFirmList,
  terminalTypeListByFirm as getTerminalTypeListByFirm,
} from '@/pages/terminal/constants';
import FixedFoot from '@/component/fixed-foot';

const { TextArea } = Input;

export default () => {
  const history = useHistory();
  const [form] = Form.useForm();
  const { deptTreeList } = useStore([]);

  const [error, setError] = useState<any[]>([]);

  const onFinish = async () => {
    try {
      const fields = await form.validateFields();
    } catch (errorInfo) {
      errorInfo.message && notification.warn({ message: errorInfo.message });
      errorInfo.errorFields && setError(errorInfo.errorFields);
    }
  }

  const forms: any[] = [
    {
      label: '参数模板名称',
      key: 'templateName',
      placeholder: '请输入参数模板名称',
      requiredText: '请输入参数模板名称',
    },
    {
      label: '适用机构',
      key: 'deptId',
      requiredType: 'select',
      render: () =>
        renderTreeSelect({
          placeholder: '请选择所属机构',
          formName: 'deptId',
          formType: FormItmeType.TreeSelect,
          treeSelectData: deptTreeList,
          span: 24,
        } as any),
    },
    {
      label: '模板类型',
      key: 'templateType',
      placeholder: '请输入参数模板名称',
      requiredText: '请输入参数模板名称',
    },
    {
      label: '备注',
      key: 'remark',
      placeholder: '请输入备注',
      requiredText: '请输入备注',
      render: () => {
        return <TextArea rows={5} />
      }
    },
  ];

  let fieldLabels: any = {};
  forms.forEach((item) => {
    fieldLabels[item.key] = item.label
  });
  return (
    <div>
      <Form form={form}>
        <CustomFormItems items={forms} singleCol={true} />
      </Form>
      <FixedFoot errors={error} fieldLabels={fieldLabels}>
        <Button type="primary" onClick={onFinish}>
          提交
        </Button>
        <Button onClick={() => history.goBack()}>返回</Button>
      </FixedFoot>
    </div>
  )
}