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
import AdvertisementApplyUpdate from '@/pages/advertisement/apply/update';

export const AdvertisementMenu = {
  name: '广告管理',
  icon: GlobalOutlined,
  path: 'advertisement',
  value: 'advertisement',
};

const routerConfig: any[] = [
  {
    path: '/advertisement/review',
    name: '广告审核',
    component: Advertisementreview,
    exact: true,
  },
  {
    path: '/advertisement/apply',
    name: '广告申请',
    component: Advertisementapple,
    exact: true,
  },
  {
    path: '/advertisement/review-detail',
    name: '广告审核详情',
    component: Advertisementreviewdetail,
    exact: true,
    inMenu: false,
  },
  {
    path: '/advertisement/apply-update',
    name: '',
    component: AdvertisementApplyUpdate,
    exact: true,
    inMenu: false,
  },
];

export default routerConfig;
