import React, { useState } from 'react';
import { Modal, Form, Input, notification } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { CustomFormItems } from '@/component/custom-form';
import invariant from 'invariant'
import {resetPwd} from '../constants/api'
import md5 from 'js-md5'
import { RESPONSE_CODE } from '@/common/config';


type Props = {
  show: boolean;
  onCancel: Function;
};

const customFormLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 14
  }
}

export default (props: Props) => {
  const { show } = props;
  const [form] = useForm();

  const onOk = async () => {
    try {
      const values = await form.validateFields();
      invariant(values.newPassword === values.newPasswordConfig, '两次输入的新密码不一致')
      const result = await resetPwd({
        oldPassword: md5(values.oldPassword),
        newPassword: md5(values.newPassword)
      })
      invariant(result.code === RESPONSE_CODE.success, result.msg || '修改密码失败')
      notification.success({message: '修改成功'})
      props.onCancel()
    } catch (error) {
      if(error.errorFields) {
        return
      }
      notification.warn({ message: error.message });
    }
  };

  const onCancle = () => {
    props.onCancel();
  };

  const forms = [
    {
      label: '原密码',
      key: 'oldPassword',
      requiredText: '请输入原密码',
      type: 'password',
      render: () => <Input.Password placeholder = {'请输入原密码'}/>
    },
    {
      label: '新密码',
      key: 'newPassword',
      requiredText: '请输入新密码',
      render: () => <Input.Password placeholder = {'请输入新密码'}/>

    },
    {
      label: '重复密码',
      key: 'newPasswordConfig',
      requiredText: '请重复输入密码',
      render: () => <Input.Password placeholder = {'请重复输入密码'}/>
    },
  ];

  return (
    <Modal visible={show} onCancel={onCancle} onOk={onOk} title='修改密码' okText='保存'>
      <Form
          form={form}
          style={{ backgroundColor: 'white' }}
        >
          <CustomFormItems items={forms} singleCol={true} customFormLayout={customFormLayout}/>
        </Form>
    </Modal>
  );
};
