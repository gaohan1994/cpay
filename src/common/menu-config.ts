/**
 * 侧边栏Menu的配置
 * @Author: Ghan
 * @Date: 2020-07-20 17:29:06
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-09-09 11:46:30
 */
import { ILayoutSiderMenu } from '@/modules/layout-container/types';
import { merge } from 'lodash';

import TerminalRoute, { TerminalMenu } from '@/pages/terminal/route';
import ApplicationRoute, { ApplicationMenu } from '@/pages/application/route';
import UploadRoute, { UploadMenu } from '@/pages/upload/route';
import MotionRoute, { MotionMenu } from '@/pages/motion/route';
import ReportRoute, { ReportMenu } from '@/pages/report/route';
import SystemRoute, { SystemMenu } from '@/pages/system/route';
import AdvertisementRoute, {
  AdvertisementMenu,
} from '@/pages/advertisement/route';
import { HomeOutlined, FundViewOutlined } from '@ant-design/icons';

// const icon = require('@ant-design/icons')['HomeOutlined']

function formartRouteToMenu(routeConfig: any[]): any[] {
  const newConfig: any[] = merge([], routeConfig);
  return newConfig
    .map((route) => {
      if (route.inMenu !== false) {
        return {
          name: route.name,
          value: route.path && route.path.substring(1, route.path.length),
          path: route.path && route.path.substring(1, route.path.length),
        };
      }
    })
    .filter((item) => !!item);
}

const menuConfig: ILayoutSiderMenu[] = [
  {
    name: '主页',
    icon: 'HomeOutlined',
    path: 'home',
    value: 'home',
  },
  {
    ...AdvertisementMenu,
    subMenus: formartRouteToMenu(AdvertisementRoute),
  },
  {
    ...TerminalMenu,
    subMenus: formartRouteToMenu(TerminalRoute),
  },
  {
    ...ApplicationMenu,
    subMenus: formartRouteToMenu(ApplicationRoute),
  },
  {
    ...UploadMenu,
    subMenus: formartRouteToMenu(UploadRoute),
  },
  {
    ...MotionMenu,
    subMenus: formartRouteToMenu(MotionRoute),
    icon: 'FundViewOutlined',
  },
  {
    ...ReportMenu,
    subMenus: formartRouteToMenu(ReportRoute),
  },
  {
    ...SystemMenu,
    subMenus: formartRouteToMenu(SystemRoute),
  },
];

function formartChildren(routeConfig: any[]): any[] {
  const newConfig: any[] = merge([], routeConfig);
  return newConfig
    .map((route) => {
      // if (route.visible === '0') {
        return {
          name: route.menuName,
          value: route.url && route.url.substring(1, route.url.length),
          path: route.url && route.url.substring(1, route.url.length),
        };
      // }
    })
    .filter((item) => !!item);
}

const formatMenuConfig = (menuList: any[]) => {
  if(!Array.isArray(menuList) || !menuList.length) {
    return []
  }
  const arr = menuList.map((item) => {
    const obj: ILayoutSiderMenu = {
      name: item.menuName,
      icon: item.icon,
      path: item.url && item.url.substring(1, item.url.length),
      value: item.url && item.url.substring(1, item.url.length)
    }
    Array.isArray(item.children) && item.children.length && (obj.subMenus = formartChildren(item.children))
    return obj
  })
  arr.unshift({
    name: '主页',
    icon: 'HomeOutlined',
    path: 'home',
    value: 'home',
  })  
  return arr
}

export { menuConfig, formatMenuConfig };
