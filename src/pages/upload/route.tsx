/**
 * 终端模块路由配置
 * @Author: Ghan
 * @Date: 2020-07-20 17:28:31
 * @Last Modified by: Ghan
 * @Last Modified time: 2020-07-20 17:29:02
 */

import { AppstoreAddOutlined } from '@ant-design/icons';

import Uploadmanage from '@/pages/upload/manage';
import Uploaddownload from '@/pages/upload/download';
import Uploadlog from '@/pages/upload/log';
import Uploadoperation from '@/pages/upload/operation';
import Uploadupload from '@/pages/upload/upload';

export const UploadMenu = {
  name: '远程更新',
  icon: AppstoreAddOutlined,
  path: 'upload',
  value: 'upload'
};

const routerConfig: any[] = [
  {
    path: '/upload/manage',
    name: '软件管理',
    component: Uploadmanage,
    exact: true
  },
  {
    path: '/upload/download',
    name: '远程下载',
    component: Uploaddownload,
    exact: true
  },
  {
    path: '/upload/log',
    name: '日志提取',
    component: Uploadlog,
    exact: true
  },
  {
    path: '/upload/operation',
    name: '远程运维',
    component: Uploadoperation,
    exact: true
  },
  {
    path: '/upload/upload',
    name: '软件更新',
    component: Uploadupload,
    exact: true
  }
];

export default routerConfig;
