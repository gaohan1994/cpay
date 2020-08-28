/**
 * 终端模块路由配置
 * @Author: Ghan
 * @Date: 2020-07-20 17:28:31
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-08-20 16:16:03
 */

import { AppstoreAddOutlined } from '@ant-design/icons';
import Motion from '@/pages/motion';

export const MotionMenu = {
  name: '移机监控',
  icon: AppstoreAddOutlined,
  path: 'motion',
  value: 'motion',
};

const routerConfig: any[] = [
  {
    path: '/motion/list',
    name: '移机记录',
    component: Motion,
    exact: true,
  },
];

export default routerConfig;
