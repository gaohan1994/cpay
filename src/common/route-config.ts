/**
 * 路由配置
 * @Author: Ghan
 * @Date: 2020-07-20 17:28:31
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-09-09 11:46:06
 */
import { RouteProps } from 'react-router-dom';
import Home from '@/pages/home';

import TerminalRoute from '@/pages/terminal/route';
import ApplicationRoute from '@/pages/application/route';
import UploadRoute from '@/pages/upload/route';
import advertisement from '@/pages/advertisement/route';
import Login from '@/pages/sign/login';
import MotionRoute from '@/pages/motion/route';
import ReportRoute from '@/pages/report/route';
import SystemRoute from '@/pages/system/route';

export const routerConfig: RouteProps[] = [
  {
    path: '/',
    component: Home,
    exact: true,
  },
  {
    path: '/home',
    component: Home,
    exact: true,
  },
  {
    path: '/login',
    component: Login,
    exact: true,
  },
  ...advertisement,
  ...TerminalRoute,
  ...ApplicationRoute,
  ...UploadRoute,
  ...MotionRoute,
  ...ReportRoute,
  ...SystemRoute
];
