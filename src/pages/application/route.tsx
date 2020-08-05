/**
 * 终端模块路由配置
 * @Author: Ghan
 * @Date: 2020-07-20 17:28:31
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-08-03 16:35:14
 */

import { AppstoreAddOutlined } from '@ant-design/icons';

import Applicationmanage from '@/pages/application/manage';
import Applicationupload from '@/pages/application/manage/upload';
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
    path: '/application/manage-upload',
    name: '广告审核详情',
    component: Applicationupload,
    exact: true,
    inMenu: false,
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
  },
  
];

export default routerConfig;
