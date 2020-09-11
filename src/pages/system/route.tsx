/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-09-07 11:23:39 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-09-11 16:27:39
 * 
 * @todo 报表中心模块路由配置
 */
import { SettingOutlined } from '@ant-design/icons';
import SystemDept from '@/pages/system/dept';
import SystemUser from '@/pages/system/user';
import SystemUserAdd from '@/pages/system/user/add';
import SystemRolePage from '@/pages/system/role';

export const SystemMenu = {
  name: '系统管理',
  icon: SettingOutlined,
  path: 'system',
  value: 'system'
};

const routerConfig: any[] = [
  {
    path: '/system/dept',
    name: '机构管理',
    component: SystemDept,
    exact: true
  },
  {
    path: '/system/user',
    name: '用户管理',
    component: SystemUser,
    exact: true
  },
  {
    path: '/system/user-add',
    name: '用户管理新增',
    component: SystemUserAdd,
    exact: true,
    inMenu: false,
  },
  {
    path: '/system/role',
    name: '角色管理',
    component: SystemRolePage,
    exact: true
  },
  {
    path: '/system/menu',
    name: '菜单功能',
    component: SystemRolePage,
    exact: true
  },
  {
    path: '/system/dict',
    name: '字典管理',
    component: SystemRolePage,
    exact: true
  },
  {
    path: '/system/system',
    name: '系统配置',
    component: SystemRolePage,
    exact: true
  },
  {
    path: '/system/log',
    name: '日志配置',
    component: SystemRolePage,
    exact: true
  },
  {
    path: '/system/operation',
    name: '操作日志',
    component: SystemRolePage,
    exact: true
  },
];

export default routerConfig;