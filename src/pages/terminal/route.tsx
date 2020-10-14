/**
 * 终端模块路由配置
 * @Author: Ghan
 * @Date: 2020-07-20 17:28:31
 * @Last Modified by: centerm.gaohan
 * @Last Modified time: 2020-10-14 10:08:27
 */

import { AndroidOutlined } from '@ant-design/icons';

import Terminalmessage from '@/pages/terminal/message';
import TerminalmessageDetail from '@/pages/terminal/message/detail';
import Terminalapplication from '@/pages/terminal/application';
import Terminalfactory from '@/pages/terminal/factory';
import TerminalfactoryDetail from '@/pages/terminal/factory/detail';
import Terminalgroup from '@/pages/terminal/group';
import Terminalgrouping from '@/pages/terminal/grouping';
import Terminalmerchant from '@/pages/terminal/merchant';
import Terminalmodel from '@/pages/terminal/model';
import TerminalmodelAdd from '@/pages/terminal/model/add';
import Terminalparams from '@/pages/terminal/params';
import TerminalparamsDetail from '@/pages/terminal/params/detail';
import Terminalquery from '@/pages/terminal/query';
import Terminalsystem from '@/pages/terminal/system';
import TerminalAcquiring from '@/pages/terminal/acquiring';
import TerminalAcquiringDetail from '@/pages/terminal/acquiring/detail';

export const TerminalMenu = {
  name: '终端管理',
  icon: AndroidOutlined,
  path: 'terminal',
  value: 'terminal',
};

const routerConfig: any[] = [
  {
    // 终端信息管理
    path: '/terminal/message',
    name: '终端信息管理',
    component: Terminalmessage,
    exact: true,
  },
  {
    // 终端信息管理
    path: '/terminal/message/detail',
    name: '终端信息管理详情',
    component: TerminalmessageDetail,
    inMenu: false,
    exact: true,
  },
  {
    // 终端参数查询
    name: '终端参数管理',
    path: '/terminal/params',
    component: Terminalparams,
    exact: true,
  },
  {
    // 终端参数查询
    name: '终端参数管理',
    path: '/terminal/params/detail',
    component: TerminalparamsDetail,
    exact: true,
    inMenu: false,
  },
  {
    // 终端组别管理
    name: '终端组别管理',
    path: '/terminal/group',
    component: Terminalgroup,
    exact: true,
  },
  {
    // 终端分组管理
    name: '终端分组管理',
    path: '/terminal/makeGroup',
    component: Terminalgrouping,
    exact: true,
  },
  {
    // 终端厂商管理
    name: '终端厂商管理',
    path: '/terminal/factory',
    component: Terminalfactory,
    exact: true,
  },
  {
    // 终端厂商管理
    name: '终端厂商新增',
    path: '/terminal/factory/add',
    component: TerminalfactoryDetail,
    exact: true,
    inMenu: false,
  },
  {
    // 终端厂商管理
    name: '终端厂商修改',
    path: '/terminal/factory/edit',
    component: TerminalfactoryDetail,
    exact: true,
    inMenu: false,
  },
  {
    // 终端型号管理
    name: '终端型号管理',
    path: '/terminal/model',
    component: Terminalmodel,
    exact: true,
  },
  {
    name: '型号新增',
    path: '/terminal/model/add',
    component: TerminalmodelAdd,
    inMenu: false,
    exact: true,
  },
  {
    name: '型号修改',
    path: '/terminal/model/edit',
    component: TerminalmodelAdd,
    inMenu: false,
    exact: true,
  },
  {
    // 终端系统信息
    name: '终端系统管理',
    path: '/terminal/system',
    component: Terminalsystem,
    exact: true,
  },
  {
    // 终端应用信息
    path: '/terminal/application',
    name: '终端应用信息',
    component: Terminalapplication,
    exact: true,
  },
  // {
  //   // 商户信息查询
  //   name: '商户信息查询',
  //   path: '/terminal/merchant',
  //   component: Terminalmerchant,
  //   exact: true
  // },
  // {
  //   // 终端高级查询
  //   name: '终端高级查询',
  //   path: '/terminal/query',
  //   component: Terminalquery,
  //   exact: true,
  // },
  {
    path: '/terminal/acquiring',
    name: '终端收单信息',
    component: TerminalAcquiring,
    exact: true,
  },

  {
    path: '/terminal/acquiring/detail',
    name: '终端收单信息详情',
    component: TerminalAcquiringDetail,
    exact: true,
    inMenu: false,
  },
];

export default routerConfig;
