/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-09-14 15:35:22 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-09-14 16:14:24
 * 
 * @todo 操作日志页面
 */
import React, { useState } from 'react';
import { Spin, Tabs } from 'antd';
import { useStore } from '@/pages/common/costom-hooks';
import OperationLog from './log-operation';
import LoginLog from './log-login';

const { TabPane } = Tabs;

const tabsData = [
  {
    tab: "操作日志",
    key: '1',
    component: <OperationLog />
  },
  {
    tab: '登录日志',
    key: '2',
    component: <LoginLog />
  },
];

type Props = {};

function Page(props: Props) {
  // 请求dept数据
  useStore(['sys_common_status']);

  const [loading, setLoading] = useState(false);

  const onChangeTab = () => {

  }

  return (
    <Spin spinning={loading}>
      <Tabs defaultActiveKey={'1'} onChange={onChangeTab}>
        {tabsData &&
          tabsData.map((tab) => {
            return (
              <TabPane tab={tab.tab} key={tab.key}>
                {tab.component}
              </TabPane>
            );
          })}
      </Tabs>
    </Spin>
  );
}
export default Page;


