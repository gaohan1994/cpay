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
import MotionRoute, { MotionMenu } from '@/pages/motion/route';
import AdvertisementRoute, {
  AdvertisementMenu,
} from '@/pages/advertisement/route';
import { HomeOutlined, FundViewOutlined } from '@ant-design/icons';

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
    icon: HomeOutlined,
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
    icon: FundViewOutlined,
  },
];

export { menuConfig };
