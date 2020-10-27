/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-09-07 11:23:39 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-09-22 17:11:02
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
import SystemDictList from '@/pages/system/dict/list';
import SystemParam from '@/pages/system/param';
import SystemNotice from '@/pages/system/notice';
import SystemNoticeAdd from '@/pages/system/notice/add';
import SystemLogSet from '@/pages/system/log-set/index'
import SystemLog from '@/pages/system/log';
import SystemLogDetail from '@/pages/system/log/log.operation.detail';

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
    path: '/system/user/add',
    name: '用户新增',
    component: SystemUserAdd,
    exact: true,
    inMenu: false,
  },
  {
    path: '/system/user/edit',
    name: '用户修改',
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
    path: '/system/role/add',
    name: '角色新增',
    component: SystemRoleAdd,
    exact: true,
    inMenu: false,
  },
  {
    path: '/system/role/edit',
    name: '角色修改',
    component: SystemRoleAdd,
    exact: true,
    inMenu: false,
  },
  {
    path: '/system/param',
    name: '参数设置',
    component: SystemParam,
    exact: true
  },
  {
    path: '/system/menu',
    name: '菜单管理',
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
    path: '/system/dict/list',
    name: '字典数据',
    component: SystemDictList,
    exact: true,
    inMenu: false,
  },
  {
    path: '/system/notice',
    name: '通知公告',
    component: SystemNotice,
    exact: true
  },
  {
    path: '/system/notice/add',
    name: '添加公告',
    component: SystemNoticeAdd,
    exact: true,
    inMenu: false,
  },
  {
    path: '/system/notice/edit',
    name: '修改公告',
    component: SystemNoticeAdd,
    exact: true,
    inMenu: false,
  },
  {
    path: '/system/logSet',
    name: '日志配置',
    component: SystemLogSet,
    exact: true
  },
  {
    path: '/system/log',
    name: '日志管理',
    component: SystemLog,
    exact: true
  },
  {
    path: '/system/log/detail',
    name: '操作日志详情',
    component: SystemLogDetail,
    exact: true,
    inMenu: false,
  },
];

export default routerConfig;