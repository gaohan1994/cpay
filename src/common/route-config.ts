/**
 * 路由配置
 * @Author: Ghan
 * @Date: 2020-07-20 17:28:31
 * @Last Modified by: Ghan
 * @Last Modified time: 2020-07-20 17:29:02
 */
import { RouteProps } from 'react-router-dom';
import Home from '@/pages/home';

import TerminalMessage from '@/pages/terminal/message';

export const routerConfig: RouteProps[] = [
  {
    path: '/',
    component: Home,
    exact: true
  },
  {
    path: '/home',
    component: Home,
    exact: true
  },
  {
    // 终端信息管理
    path: '/terminal/message',
    component: TerminalMessage,
    exact: true
  }
];
