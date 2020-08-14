/**
 * 终端模块路由配置
 * @Author: Ghan
 * @Date: 2020-07-20 17:28:31
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-08-13 11:38:38
 */

import { AppstoreAddOutlined } from '@ant-design/icons';

import Uploadmanage from '@/pages/upload/manage';
import UploadManageAdd from '@/pages/upload/manage/add';
import UploadManageDetail from '@/pages/upload/manage/detail';
import Uploaddownload from '@/pages/upload/download';
import Uploadoperation from '@/pages/upload/operation';
import Uploadupload from '@/pages/upload/upload';
import Uploadlog from '@/pages/upload/log';
import UploadLogDetail from '@/pages/upload/log/detail';
import UploadLogAdd from '@/pages/upload/log/add';

export const UploadMenu = {
  name: '远程更新',
  icon: AppstoreAddOutlined,
  path: 'upload',
  value: 'upload'
};

const routerConfig: any[] = [
  {
    path: '/upload/download',
    name: '远程下载',
    component: Uploaddownload,
    exact: true
  },
  {
    path: '/upload/manage',
    name: '软件管理',
    component: Uploadmanage,
    exact: true
  },
  {
    path: '/upload/manage-add',
    name: '软件新增',
    component: UploadManageAdd,
    exact: true,
    inMenu: false,
  },
  {
    path: '/upload/manage-detail',
    name: '软件详情',
    component: UploadManageDetail,
    exact: true,
    inMenu: false,
  },
  {
    path: '/upload/manage-edit',
    name: '软件修改',
    component: UploadManageDetail,
    exact: true,
    inMenu: false,
  },
  {
    path: '/upload/update',
    name: '软件更新',
    component: Uploadupload,
    exact: true
  },
  {
    path: '/upload/operation',
    name: '远程运维',
    component: Uploadoperation,
    exact: true
  },
  {
    path: '/upload/log',
    name: '日志提取',
    component: Uploadlog,
    exact: true
  },
  {
    path: '/upload/log-detail',
    name: '终端日志提取详情',
    component: UploadLogDetail,
    exact: true,
    inMenu: false,
  },
  {
    path: '/upload/log-add',
    name: '终端日志提取新增',
    component: UploadLogAdd,
    exact: true,
    inMenu: false,
  },
];

export default routerConfig;
