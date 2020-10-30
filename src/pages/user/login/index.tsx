import React from 'react';
import { Button, notification, Form, Checkbox, Input } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import invariant from 'invariant';
import { login, getUserAndMenu } from '../constants/api';
import { useHistory } from 'react-router-dom';
import { RESPONSE_CODE } from '@/common/config';
import { useDispatch } from 'react-redux';
import './index.scss';
import md5 from 'js-md5'

export default () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const onLogin = async (params: any) => {
    try { 
      const result = await login({
        ...params,
        password: md5(params.password),
      });
      invariant(result.code === RESPONSE_CODE.success, result.msg || ' ');
      getUserAndMenu(dispatch);
      history.push('/home');
    } catch (error) {
      notification.warn({ message: error.message });
    }
  };
  return (
    <div className='login'>
      <div className='login-container'>
        <div className='logo'>
          智能终端远程管理平台
          <div className='sub'>REMOTE MANAGEMENT PLATFORM</div>
        </div>
        <div className='login-input'>
          <div className='logo'></div>
          <Form initialValues={{ rememberMe: true }} onFinish={onLogin}>
            <Form.Item name='username' rules={[{ required: true, message: '账号不能为空' }]}>
              <Input size="large" prefix={<UserOutlined />} placeholder='用户名 / 手机 / 邮箱' />
            </Form.Item>
            <Form.Item name='password' rules={[{ required: true, message: '密码不能为空' }]}>
              <Input size="large" prefix={<LockOutlined />} type='password' placeholder='密码' />
            </Form.Item>
            <Form.Item>
              <Form.Item name='rememberMe' valuePropName='checked' noStyle>
                <Checkbox>记住账号</Checkbox>
              </Form.Item>
            </Form.Item>
            <Form.Item>
              <Button  size="large" type='primary' htmlType='submit' style={{ width: '100%' }}>
                登录
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};
