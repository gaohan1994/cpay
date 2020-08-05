import React from 'react';
import { Button, notification } from 'antd';
import invariant from 'invariant';
import { adminLogin } from './constants/api';
import { useHistory } from 'react-router-dom';
import { RESPONSE_CODE } from '@/common/config';

export default () => {
  const history = useHistory();
  const onLogin = async () => {
    try {
      const result = await adminLogin({
        password: '96e79218965eb72c92a549dd5a330112',
        rememberMe: true,
        username: 'admin',
      });

      invariant(result.code === RESPONSE_CODE.success, result.msg || ' ');
      history.push('/home');
    } catch (error) {
      notification.warn({ message: error.message });
    }
  };
  return (
    <div>
      <Button onClick={onLogin}>login</Button>
    </div>
  );
};
