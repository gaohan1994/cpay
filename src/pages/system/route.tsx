/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-09-07 11:23:39 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-09-14 14:37:39
 * 
 * @todo 报表中心模块路由配置
 */
import { SettingOutlined } from '@ant-design/icons';
import SystemDept from '@/pages/system/dept';
import SystemUser from '@/pages/system/user';
import SystemUserAdd from '@/pages/system/user/add';
import SystemRole from '@/pages/system/role';
import SystemRoleAdd from '@/pages/system/role/add';
import SystemMenuPage from '@/pages/system/menu';
import SystemDict from '@/pages/system/dict';
import SystemSetting from '@/pages/system/setting';
import SystemLog from '@/pages/system/log';
import SystemOperation from '@/pages/system/operation';

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
    name: '新增用户',
    component: SystemUserAdd,
    exact: true,
    inMenu: false,
  },
  {
    path: '/system/role',
    name: '角色管理',
    component: SystemRole,
    exact: true
  },
  {
    path: '/system/role-add',
    name: '新增角色',
    component: SystemRoleAdd,
    exact: true,
    inMenu: false,
  },
  {
    path: '/system/menu',
    name: '菜单功能',
    component: SystemMenuPage,
    exact: true
  },
  {
    path: '/system/dict',
    name: '字典管理',
    component: SystemDict,
    exact: true
  },
  {
    path: '/system/setting',
    name: '系统配置',
    component: SystemSetting,
    exact: true
  },
  {
    path: '/system/log',
    name: '日志配置',
    component: SystemLog,
    exact: true
  },
  {
    path: '/system/operation',
    name: '操作日志',
    component: SystemOperation,
    exact: true
  },
];

export default routerConfig;