/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-09-14 13:54:26 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-09-14 14:39:13
 * 
 * @todo 角色管理新增
 */
import React, { useState, useEffect } from 'react';
import { Spin, Form, Button, notification } from 'antd';
import { useStore } from '@/pages/common/costom-hooks';
import { CustomFormItems, getCustomSelectFromItemData } from '@/component/custom-form';
import { useForm } from 'antd/lib/form/Form';
import { useFormSelectData } from './costom-hooks';
import { CustomFromItem } from '@/common/type';
import { useQueryParam } from '@/common/request-util';
import { useHistory } from 'react-router-dom';
import { useDetail } from '@/pages/common/costom-hooks/use-detail';
import { merge } from 'lodash';
import FixedFoot, { ErrorField } from '@/component/fixed-foot';
import { systemRoleEdits, systemRoleEdit, systemRoleAdd } from '../constants/api';
import TextArea from 'antd/lib/input/TextArea';
import { RESPONSE_CODE } from '@/common/config';

const fieldLabels = {
  roleName: '角色名称',
  remark: '备注',
  menu: '菜单权限复制对象',
  function: '功能授权复制对象',
}

export default function Page() {
  const id = useQueryParam('id');
  const [form] = useForm();
  const history = useHistory();
  const res = useStore([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorField[]>([]);

  const {
    roleList,
  } = useFormSelectData({}, form);

  /**
   * @todo 获取详情数据
   */
  const { detail } = useDetail(id, systemRoleEdits, setLoading);

  const initialValues = merge({}, (detail && detail) || {});

  useEffect(() => {
    setLoading(res.loading);
    if (!res.loading) {
      form.setFieldsValue(initialValues);
    }
  }, [detail, res.loading]);

  const checkRoleName = (rule: any, value: any, callback: any) => {
    let flag = false;
    for (let i = 0; i < roleList.length; i++) {
      if (roleList[i].roleName === value) {
        flag = true;
        break;
      }
    }
    if (!flag) {
      callback();
    } else {
      callback('角色名称已经存在');
    }
  }


  const forms: CustomFromItem[] = [
    {
      label: fieldLabels.roleName,
      key: 'roleName',
      rules: [
        { validator: checkRoleName },
        {
          required: true,
          message: '请输入角色名称',
        },
      ]
    },
    {
      label: fieldLabels.remark,
      key: 'remark',
      render: () => <TextArea />
    },
    {
      ...getCustomSelectFromItemData({
        label: fieldLabels.menu,
        key: 'menu',
        list: roleList,
        valueKey: 'roleId',
        nameKey: 'roleName',
      })
    },
    {
      ...getCustomSelectFromItemData({
        label: fieldLabels.function,
        key: 'function',
        list: roleList,
        valueKey: 'roleId',
        nameKey: 'roleName',
      })
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
          roleId: id
        }
        const res = await systemRoleEdit(param);
        setLoading(false);
        if (res && res.code === RESPONSE_CODE.success) {
          notification.success({ message: '修改角色成功！' });
          history.goBack();
        } else {
          notification.error({ message: res.msg || '修改角色失败，请重试！' });
        }
      } else {
        const res = await systemRoleAdd(param);
        setLoading(false);
        if (res && res.code === RESPONSE_CODE.success) {
          notification.success({ message: '添加角色成功！' });
          history.goBack();
        } else {
          notification.error({ message: res.msg || '添加角色失败，请重试！' });
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