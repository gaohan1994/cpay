import React, { PureComponent, useState } from 'react';
import { Spin, Tag, Menu, Dropdown } from 'antd';
import { LogoutOutlined, LockOutlined } from '@ant-design/icons';
import ForgetPassword from '@/pages/user/resetPwd'
import './index.scss'
import { useRedux, useSelectorHook } from '@/common/redux-util';
import { logout } from '@/pages/user/constants/api';


export default () => {
  const [forgetShow, setForgetShow] = useState<boolean>(false);
  const [useSelector, dispatch] = useRedux();
  const user = useSelectorHook(state => state.user)

  const onMenuClick = (item : any ) => {
    if(!item?.key) {
      return
    }
    switch(item.key) {
      case 'resetPwd': {
        setForgetShow(true)
        break
      }
      case 'logout' : {
        logout(dispatch)
        window.location.hash = '#/login'
        break
      }
    }
    
  };

  const menu = (
    <Menu onClick={onMenuClick}>
      <Menu.Item key='resetPwd'>
        <LockOutlined /> 修改密码
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key='logout'>
        <LogoutOutlined /> 退出登录
      </Menu.Item>
    </Menu>
  );

  return (
    <div>
      <Dropdown overlay={menu} placement='bottomCenter'>
        <div className='right'>{user?.user?.loginName || ''}</div>
      </Dropdown>
      <ForgetPassword show={forgetShow} onCancel={() => setForgetShow(false)}/>
    </div>
  );
};
