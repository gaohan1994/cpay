/**
 * 侧边栏Menu的配置
 * @Author: Ghan
 * @Date: 2020-07-20 17:29:06
 * @Last Modified by: Ghan
 * @Last Modified time: 2020-07-20 17:39:16
 */
import { ILayoutSiderMenu } from '@/modules/layout-container/types';

const menuConfig: ILayoutSiderMenu[] = [
  {
    name: '主页',
    icon: '',
    path: 'home',
    value: 'home'
  },
  {
    name: '广告管理',
    icon: '',
    path: 'adver',
    value: 'adver',
    subMenus: [
      {
        name: '广告审核',
        value: 'adver/sh',
        path: 'adver/sh'
      },
      {
        name: '广告申请',
        value: 'adver/sq',
        path: 'adver/sq'
      }
    ]
  },
  {
    name: '终端管理',
    icon: '',
    path: 'terminal',
    value: 'terminal',
    subMenus: [
      {
        name: '终端信息管理',
        value: 'terminal/message',
        path: 'terminal/message'
      }
    ]
  }
];

export { menuConfig };
