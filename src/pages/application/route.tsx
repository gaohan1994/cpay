/**
 * 应用模块路由配置
 * @Author: Ghan
 * @Date: 2020-07-20 17:28:31
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-08-12 09:38:35
 */

import { AppstoreAddOutlined } from '@ant-design/icons';

import Applicationmanage from '@/pages/application/manage';
import Applicationupload from '@/pages/application/manage/upload';
import ApplicationRecycle from '@/pages/application/manage/delete';
import Applicationdetail from '@/pages/application/manage/detail';
import Applicationpublish from '@/pages/application/publish';
import ApplicationPublishForm from '@/pages/application/publish/publish';
import Applicationreview from '@/pages/application/review';
import ApplicationReviewForm from '@/pages/application/review/review';
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
    path: '/application/manage/upload',
    name: '应用上传',
    component: Applicationupload,
    exact: true,
    inMenu: false,
  },
  {
    path: '/application/manage/edit',
    name: '应用修改',
    component: Applicationupload,
    exact: true,
    inMenu: false,
  },
  {
    path: '/application/manage/recycle',
    name: '应用回收站',
    component: ApplicationRecycle,
    exact: true,
    inMenu: false,
  },
  {
    path: '/application/manage/detail',
    name: '应用详情',
    component: Applicationdetail,
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
    path: '/application/publish/detail',
    name: '应用详情',
    component: Applicationdetail,
    exact: true,
    inMenu: false,
  },
  {
    path: '/application/publish/publish',
    name: '发布',
    component: ApplicationPublishForm,
    exact: true,
    inMenu: false,
  },
  {
    path: '/application/review',
    name: '应用审核',
    component: Applicationreview,
    exact: true
  },
  {
    path: '/application/review/review',
    name: '审核',
    component: ApplicationReviewForm,
    exact: true,
    inMenu: false,
  },
  {
    path: '/application/type',
    name: '应用分类',
    component: Applicationtype,
    exact: true
  },

];

export default routerConfig;
