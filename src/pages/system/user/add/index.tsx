/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-09-11 16:11:16 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-09-14 14:39:58
 * 
 * @todo 用户管理新增
 */
import React, { useState, useEffect } from 'react';
import { Spin, Form, Button, notification } from 'antd';
import { useStore } from '@/pages/common/costom-hooks';
import { CustomFormItems, getCustomSelectFromItemData } from '@/component/custom-form';
import { useForm } from 'antd/lib/form/Form';
import { useFormSelectData } from './costom-hooks';
import { CustomFromItem } from '@/common/type';
import { renderTreeSelect } from '@/component/form/render';
import { useQueryParam } from '@/common/request-util';
import { RESPONSE_CODE } from '@/common/config';
import { useHistory } from 'react-router-dom';
import { useDetail } from '@/pages/common/costom-hooks/use-detail';
import { merge } from 'lodash';
import FixedFoot, { ErrorField } from '@/component/fixed-foot';
import { systemUserEdits, systemUserAdd, systemUserEdit } from '../constants/api';
import { FormItmeType } from '@/component/form/type';
import { checkPhoneNumber } from '@/common/validator';

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
  const [form] = useForm();
  const history = useHistory();
  const res = useStore([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorField[]>([]);

  const {
    deptTreeData,
    roleList,
  } = useFormSelectData({}, form);

  /**
   * @todo 获取详情数据
   */
  const { detail } = useDetail(id, systemUserEdits, setLoading);

  const initialValues = merge({}, (detail && detail) || {});

  useEffect(() => {
    setLoading(res.loading);
    if (!res.loading) {
      form.setFieldsValue(initialValues && initialValues.sysUser);
      form.setFieldsValue({
        roleIds: initialValues && initialValues.sysUser && initialValues.sysUser.roles[0] && initialValues.sysUser.roles[0].roleId
      })
    }
  }, [detail, res.loading]);


  const forms: CustomFromItem[] = [
    {
      label: fieldLabels.loginName,
      key: 'loginName',
      requiredType: 'input' as any,
    },
    {
      label: fieldLabels.userName,
      key: 'userName',
      requiredType: 'input' as any,
    },
    {
      ...getCustomSelectFromItemData({
        label: fieldLabels.roleIds,
        key: 'roleIds',
        list: roleList,
        valueKey: 'roleId',
        nameKey: 'roleName',
        required: true,
      })
    },
    {
      label: fieldLabels.deptId,
      key: 'deptId',
      requiredType: 'select',
      render: () => renderTreeSelect(
        {
          placeholder: '请选择所属机构',
          formName: 'deptId',
          formType: FormItmeType.TreeSelect,
          treeSelectData: deptTreeData,
          span: 24
        } as any
      )
    },
    {
      label: fieldLabels.phone,
      key: 'phone',
      requiredType: 'input' as any,
      rules: [
        { validator: checkPhoneNumber },
        {
          required: true,
          message: '请输入E-mail',
        },
      ]
    },
    {
      label: fieldLabels.email,
      key: 'email',
      requiredType: 'input' as any,
      rules: [
        {
          type: 'email',
          message: '请输入正确的E-mail',
        },
        {
          required: true,
          message: '请输入E-mail',
        },
      ]
    },
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
      if (id) {
        param = {
          ...param,
          userId: id
        }
        const res = await systemUserEdit(param);
        setLoading(false);
        if (res && res.code === RESPONSE_CODE.success) {
          notification.success({ message: '修改用户成功！' });
          history.goBack();
        } else {
          notification.error({ message: res.msg || '修改用户失败，请重试！' });
        }
      } else {
        const res = await systemUserAdd(param);
        setLoading(false);
        if (res && res.code === RESPONSE_CODE.success) {
          notification.success({ message: '添加用户成功！' });
          history.goBack();
        } else {
          notification.error({ message: res.msg || '添加用户失败，请重试！' });
        }
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
        <Button type="primary" loading={loading} onClick={onSubmit} htmlType='submit'>
          提交
        </Button>
        <Button onClick={() => history.goBack()}>返回</Button>
      </FixedFoot>
    </Spin>
  )
}