/**
 * 终端模块路由配置
 * @Author: Ghan
 * @Date: 2020-07-20 17:28:31
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-09-08 13:56:45
 */

import { ToolOutlined } from '@ant-design/icons';

import Uploadmanage from '@/pages/upload/manage';
import UploadManageAdd from '@/pages/upload/manage/add';
import UploadManageDetail from '@/pages/upload/manage/detail';
import Uploaddownload from '@/pages/upload/download';
import Uploadoperation from '@/pages/upload/operation';
import UploadOperationAdd from '@/pages/upload/operation/add';
import UploadOperationDetail from '@/pages/upload/operation/detail';
import UploadOperationOperation from '@/pages/upload/operation/operation';
import Uploadupload from '@/pages/upload/upload';
import UploadUploadAdd from '@/pages/upload/upload/add';
import UploadUploadOperation from '@/pages/upload/upload/operation';
import UploadUploadDetail from '@/pages/upload/upload/detail';
import Uploadlog from '@/pages/upload/log';
import UploadLogDetail from '@/pages/upload/log/detail';
import UploadLogAdd from '@/pages/upload/log/add';
import UploadLogOperation from '@/pages/upload/log/operation';
import UploadCount from '@/pages/upload/count';
import UploadParams from '@/pages/upload/params';
import UploadParamsAdd from '@/pages/upload/params/add'
import UploadParamsDetail from '@/pages/upload/params/detail'
import UploadParamsOperation from '@/pages/upload/params/operation'

export const UploadMenu = {
  name: '远程更新',
  icon: 'ToolOutlined',
  path: 'upload',
  value: 'upload'
};

const routerConfig: any[] = [
  // {
  //   path: '/upload/download',
  //   name: '远程下载',
  //   component: Uploaddownload,
  //   exact: true
  // },
  {
    path: '/upload/manage',
    name: '软件管理',
    component: Uploadmanage,
    exact: true
  },
  {
    path: '/upload/manage/add',
    name: '软件新增',
    component: UploadManageAdd,
    exact: true,
    inMenu: false,
  },
  {
    path: '/upload/manage/detail',
    name: '软件详情',
    component: UploadManageDetail,
    exact: true,
    inMenu: false,
  },
  {
    path: '/upload/manage/edit',
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
    path: '/upload/update/detail',
    name: '任务详情',
    component: UploadUploadDetail,
    exact: true,
    inMenu: false,
  },
  {
    path: '/upload/update/add',
    name: '任务新增',
    component: UploadUploadAdd,
    exact: true,
    inMenu: false,
  },
  {
    path: '/upload/update/edit',
    name: '任务修改',
    component: UploadUploadAdd,
    exact: true,
    inMenu: false,
  },
  {
    path: '/upload/update/copy',
    name: '任务复制',
    component: UploadUploadAdd,
    exact: true,
    inMenu: false,
  },
  {
    path: '/upload/update/operation',
    name: '执行情况',
    component: UploadUploadOperation,
    exact: true,
    inMenu: false,
  },
  {
    path: '/upload/operation',
    name: '远程运维',
    component: Uploadoperation,
    exact: true
  },
  {
    path: '/upload/operation/add',
    name: '远程运维指令',
    component: UploadOperationAdd,
    exact: true,
    inMenu: false,
  },
  {
    path: '/upload/operation/edit',
    name: '远程运维指令修改',
    component: UploadOperationAdd,
    exact: true,
    inMenu: false,
  },
  {
    path: '/upload/operation/copy',
    name: '远程运维指令复制',
    component: UploadOperationAdd,
    exact: true,
    inMenu: false,
  },
  {
    path: '/upload/operation/detail',
    name: '远程运维详情',
    component: UploadOperationDetail,
    exact: true,
    inMenu: false,
  },
  {
    path: '/upload/operation/operation',
    name: '执行情况',
    component: UploadOperationOperation,
    exact: true,
    inMenu: false,
  },
  {
    path: '/upload/log',
    name: '日志提取',
    component: Uploadlog,
    exact: true
  },
  {
    path: '/upload/log/detail',
    name: '终端日志提取详情',
    component: UploadLogDetail,
    exact: true,
    inMenu: false,
  },
  {
    path: '/upload/log/add',
    name: '终端日志提取新增',
    component: UploadLogAdd,
    exact: true,
    inMenu: false,
  },
  {
    path: '/upload/log/edit',
    name: '终端日志提取修改',
    component: UploadLogAdd,
    exact: true,
    inMenu: false,
  },
  {
    path: '/upload/log/operation',
    name: '执行情况',
    component: UploadLogOperation,
    exact: true,
    inMenu: false,
  },
  {
    path: '/upload/count',
    name: '更新试点',
    component: UploadCount,
    exact: true
  },
  {
    path: '/upload/params',
    name: '参数下发',
    component: UploadParams,
    exact: true
  },
  {
    path: '/upload/params/add',
    name: '新增',
    component: UploadParamsAdd,
    exact: true,
    inMenu: false
  },
  {
    path: '/upload/params/edit',
    name: '修改',
    component: UploadParamsAdd,
    exact: true,
    inMenu: false
  },
  {
    path: '/upload/params/detail',
    name: '详情',
    component: UploadParamsDetail,
    exact: true,
    inMenu: false
  },
  {
    path: '/upload/params/copy',
    name: '复制',
    component: UploadParamsAdd,
    exact: true,
    inMenu: false
  },
  {
    path: '/upload/params/operation',
    name: '执行情况',
    component: UploadParamsOperation,
    exact: true,
    inMenu: false
  },
];

export default routerConfig;
