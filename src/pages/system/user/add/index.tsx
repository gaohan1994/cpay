/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-09-11 16:11:16 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-09-11 16:20:43
 * 
 * @todo 用户管理新增
 */
import React, { useState, useEffect, useRef } from 'react';
import { Spin, Form, Button, message, notification } from 'antd';
import { useStore } from '@/pages/common/costom-hooks';
import { CustomFormItems } from '@/component/custom-form';
import { useForm } from 'antd/lib/form/Form';
import { useFormSelectData } from './costom-hooks';
import { CustomFromItem } from '@/common/type';
import { renderTreeSelect } from '@/component/form/render';
import { useQueryParam } from '@/common/request-util';
import { RESPONSE_CODE } from '@/common/config';
import { useHistory } from 'react-router-dom';
import { useDetail } from '@/pages/common/costom-hooks/use-detail';
import { merge } from 'lodash';
import numeral from 'numeral';
import FixedFoot, { ErrorField } from '@/component/fixed-foot';
import { systemUserEdits } from '../constants/api';

const fieldLabels = {
  loginName: '用户名',
  userName: '真实姓名',
  roleIds: '所属角色',
  deptId: '所属机构',
  phone: '电话号码',
  email: 'EMAIL',
}

export default function Page() {
  const id = useQueryParam('id');
  const type = useQueryParam('type');
  const groupRef: any = useRef();
  const [form] = useForm();
  const history = useHistory();
  const res = useStore(['']);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorField[]>([]);

  const {
    terminalFirmList,
    terminalFirmValue, setTerminalFirmValue,
    terminalTypeList,
    terminalTypeValue, setTerminalTypeValue,
  } = useFormSelectData({ ...form.getFieldsValue() }, form);

  // const { detail } = useDetail(id, systemUserEdits, setLoading);

  // const initialValues = merge(
  //   {},
  //   (detail && detail) || {}
  // );

  // useEffect(() => {
  //   if (!res.loading) {
  //     form.setFieldsValue(initialValues);
  //     setLoading(false);
  //   }
  // }, [detail, res.loading]);


  const forms: CustomFromItem[] = [
    {
      label: fieldLabels.loginName,
      key: 'loginName',
      requiredType: 'input' as any,
    },
    // {
    //   ...getCustomSelectFromItemData({
    //     label: fieldLabels.firmId,
    //     key: 'firmId',
    //     value: terminalFirmValue,
    //     list: terminalFirmList,
    //     valueKey: 'id',
    //     nameKey: 'firmName',
    //     required: true,
    //     onChange: (id: any) => {
    //       setTerminalFirmValue(id);
    //       form.setFieldsValue({ 'terminalTypeId': [] });
    //     }
    //   })
    // },
    // {
    //   ...getCustomSelectFromItemData({
    //     label: fieldLabels.terminalTypeId,
    //     key: 'terminalTypeId',
    //     list: terminalTypeList,
    //     valueKey: 'id',
    //     nameKey: 'typeName',
    //     required: true,
    //     value: terminalTypeValue,
    //     setValue: setTerminalTypeValue,
    //   })
    // },

  ]

  const onSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log('Success:', values);
      const fields = form.getFieldsValue();
      let param: any = {
        ...fields,
      }
      setLoading(true);
      if (id && type === '1') {
        param = {
          ...param,
          id
        }
        // const res = await taskOperationJobEdit(param);
        // setLoading(false);
        // if (res && res.code === RESPONSE_CODE.success) {
        //   notification.success({ message: '修改终端操作任务成功' });
        //   history.goBack();
        // } else {
        //   notification.error({ message: res.msg || '修改终端操作任务失败，请重试' });
        // }
      } else {
        // const res = await taskOperationJobAdd(param);
        // setLoading(false);
        // if (res && res.code === RESPONSE_CODE.success) {
        //   notification.success({ message: '添加终端操作任务成功' });
        //   history.goBack();
        // } else {
        //   notification.error({ message: res.msg || '添加终端操作任务失败，请重试' });
        // }
      }
      setLoading(false);
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
      setError(errorInfo.errorFields);
    }
  }

  return (
    <Spin spinning={loading}>
      <div style={{ paddingTop: 10 }}>
        <Form
          form={form}
          className="ant-advanced-search-form"
          style={{ backgroundColor: 'white' }}
        >
          <CustomFormItems items={forms} singleCol={true} />
        </Form>
      </div>
      <FixedFoot errors={error} fieldLabels={fieldLabels}>
        <Button type="primary" loading={loading} onClick={onSubmit}>
          提交
        </Button>
        <Button onClick={() => history.goBack()}>返回</Button>
      </FixedFoot>
    </Spin>
  )
}