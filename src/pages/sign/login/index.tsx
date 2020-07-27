import React from 'react';
import { Button } from 'antd';
import { adminLogin } from './constants/api';
import { useHistory } from 'react-router-dom';

export default () => {
  const history = useHistory();
  const onLogin = async () => {
    await adminLogin({
      password: '96e79218965eb72c92a549dd5a330112',
      rememberMe: true,
      username: 'admin',
    });

    history.push('/home');
  };
  return (
    <div>
      <Button onClick={onLogin}>login</Button>
    </div>
  );
};
