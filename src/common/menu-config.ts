/**
 * 侧边栏Menu的配置
 * @Author: Ghan
 * @Date: 2020-07-20 17:29:06
 * @Last Modified by: Ghan
 * @Last Modified time: 2020-07-20 17:39:16
 */
import { ILayoutSiderMenu } from '@/modules/layout-container/types';
import { merge } from 'lodash';

import TerminalRoute, { TerminalMenu } from '@/pages/terminal/route';
import ApplicationRoute, { ApplicationMenu } from '@/pages/application/route';
import UploadRoute, { UploadMenu } from '@/pages/upload/route';
import {
  HomeOutlined,
  GlobalOutlined,
  AndroidOutlined,
  AppstoreAddOutlined,
  CloudUploadOutlined,
  FundViewOutlined
} from '@ant-design/icons';

function formartRouteToMenu(routeConfig: any[]) {
  const newConfig: any[] = merge([], routeConfig);
  return newConfig.map(route => {
    return {
      name: route.name,
      value: route.path && route.path.substring(1, route.path.length),
      path: route.path && route.path.substring(1, route.path.length)
    };
  });
}

const menuConfig: ILayoutSiderMenu[] = [
  {
    name: '主页',
    icon: HomeOutlined,
    path: 'home',
    value: 'home'
  },
  {
    name: '广告管理',
    icon: GlobalOutlined,
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
    ...TerminalMenu,
    subMenus: formartRouteToMenu(TerminalRoute)
  },
  {
    ...ApplicationMenu,
    subMenus: formartRouteToMenu(ApplicationRoute)
  },
  {
    ...UploadMenu,
    subMenus: formartRouteToMenu(UploadRoute)
  },
  {
    name: '移机监控',
    icon: FundViewOutlined,
    path: '1',
    value: '1'
  }
];

export { menuConfig };
