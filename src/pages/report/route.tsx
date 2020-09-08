/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-09-07 11:23:39 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-09-07 13:38:43
 * 
 * @todo 报表中心模块路由配置
 */
import { FundOutlined } from '@ant-design/icons';
import ReportTerminal from './terminal';

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
];

export default routerConfig;