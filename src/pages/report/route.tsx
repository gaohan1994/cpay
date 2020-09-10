/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-09-07 11:23:39 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-09-09 11:35:05
 * 
 * @todo 报表中心模块路由配置
 */
import { FundOutlined } from '@ant-design/icons';
import ReportTerminal from '@/pages/report/terminal';
import ReportApp from '@/pages/report/app';
import ReportDownloadJob from '@/pages/report/download-job';
import ReportDownloadJobOperation from '@/pages/report/download-job/operation';

export const ReportMenu = {
  name: '报表中心',
  icon: FundOutlined,
  path: 'report',
  value: 'report'
};

const routerConfig: any[] = [
  {
    path: '/report/terminal',
    name: '终端信息统计',
    component: ReportTerminal,
    exact: true
  },
  {
    path: '/report/app',
    name: '终端应用统计',
    component: ReportApp,
    exact: true
  },
  {
    path: '/report/downloadJob',
    name: '软件更新统计',
    component: ReportDownloadJob,
    exact: true
  },
  {
    path: '/report/downloadJob-operation',
    name: '执行情况',
    component: ReportDownloadJobOperation,
    exact: true,
    inMenu: false,
  },
];

export default routerConfig;