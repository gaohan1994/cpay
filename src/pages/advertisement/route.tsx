/**
 * 模块路由配置
 * @Author: Ghan
 * @Date: 2020-07-20 17:28:31
 * @Last Modified by: Ghan
 * @Last Modified time: 2020-07-20 17:29:02
 */
import { GlobalOutlined } from '@ant-design/icons';
import Advertisementapple from '@/pages/advertisement/apply';
import Advertisementreview from '@/pages/advertisement/review';
import Advertisementreviewdetail from '@/pages/advertisement/review/detail';

export const AdvertisementMenu = {
  name: '广告管理',
  icon: GlobalOutlined,
  path: 'advertisement',
  value: 'advertisement'
};

const routerConfig: any[] = [
  {
    path: '/advertisement/apply',
    name: '广告管理',
    component: Advertisementapple,
    exact: true
  },
  {
    path: '/advertisement/review-detail/:id',
    name: '广告审核详情',
    component: Advertisementreviewdetail,
    exact: true,
    inMenu: false
  },
  {
    path: '/advertisement/review',
    name: '广告审核',
    component: Advertisementreview,
    exact: true
  }
];

export default routerConfig;
