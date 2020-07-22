/**
 * 终端模块路由配置
 * @Author: Ghan
 * @Date: 2020-07-20 17:28:31
 * @Last Modified by: Ghan
 * @Last Modified time: 2020-07-20 17:29:02
 */

import { AppstoreAddOutlined } from '@ant-design/icons';

import Applicationmanage from '@/pages/application/manage';
import Applicationpublish from '@/pages/application/publish';
import Applicationreview from '@/pages/application/review';
import Applicationtype from '@/pages/application/type';

export const ApplicationMenu = {
  name: '应用管理',
  icon: AppstoreAddOutlined,
  path: 'application',
  value: 'application'
};

const routerConfig: any[] = [
  {
    path: '/application/manage',
    name: '应用管理',
    component: Applicationmanage,
    exact: true
  },
  {
    path: '/application/publish',
    name: '应用发布',
    component: Applicationpublish,
    exact: true
  },
  {
    path: '/application/review',
    name: '应用审核',
    component: Applicationreview,
    exact: true
  },
  {
    path: '/application/type',
    name: '应用分类',
    component: Applicationtype,
    exact: true
  }
];

export default routerConfig;
