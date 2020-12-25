import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { formatSearch } from '@/common/request-util';
import invariant from 'invariant';
import { Tabs, notification } from 'antd';
import { terminalInfoDetail, DetailTabs,  } from './constants';
import {terminalBaseInfo} from './components/constants'
import { RESPONSE_CODE } from '@/common/config';
import Content from './components/content';
import { ITerminalSystemDetailInfo } from './types';
import { useStore } from '@/pages/common/costom-hooks';

const { TabPane } = Tabs;

interface State {
  data: ITerminalSystemDetailInfo;
  currentTab: string;
}

export default () => {
  useStore(['buss_type'])
  const history = useHistory();
  const initState: State = {
    currentTab: '1',
    data: {} as any,
  };
  const [currentTab, setCurrentTab] = useState(initState.currentTab);
  const [data, setData] = useState(initState.data);

  useEffect(() => {
    const { search } = history.location;
    const field = formatSearch(search);
    console.log('field:', field);
    terminalBaseInfo({id: field.id}).then((result: any) => {
      try {
        console.log('result:', result);
        invariant(result.code === RESPONSE_CODE.success, result.msg || ' ');
        setData(result.data);
      } catch (error) {
        notification.warn({ message: error.message });
      }
    })
  }, [history.location.search]);

  /**
   * 切换tab
   * @param key
   */
  const onChangeTab = (key: string) => {
    setCurrentTab(key);
  };
  return (
    <div>
      <Tabs defaultActiveKey="1" activeKey={currentTab} onChange={onChangeTab}>
        {DetailTabs.map((item) => {
          return (
            <TabPane tab={item.title} key={item.key}>
              <Content
                terminalDetailInfo={data}
                currentTab={
                  DetailTabs.find((t) => t.key === currentTab) || DetailTabs[0]
                }
              />
            </TabPane>
          );
        })}
      </Tabs>
    </div>
  );
};
