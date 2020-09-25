import React, { useEffect, useRef, useState } from 'react';
import { Layout, ConfigProvider, Menu, Divider } from 'antd';
import './index.scss';
import LayoutMenu from './component/menu';
import LayoutBread from './component/bread';
import { ILayoutSiderMenu, ILayoutSiderSubMenu } from './types';
import logo from '../../assets/logo.png';
import { useSelectorHook, useRedux } from '@/common/redux-util';
import { getUserDept } from '@/common/api';
import './index.less';
import { useHistory } from 'react-router-dom';

const prefix = 'component-layout';

const { Header } = Layout;

type Props = {
  menus: ILayoutSiderMenu[];
  children: any;
};

function LayoutContainer(props: Props) {
  const { menus } = props;
  const [useSelector, dispatch] = useRedux();
  const common = useSelectorHook((state) => state.common);
  const history = useHistory();
  const pathname = history.location.pathname;

  const breadContainerRef: any = useRef(null);
  const [breadHeight, setBreadHeight] = useState(0);

  const contentContainerRef: any = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    setBreadHeight(breadContainerRef.current?.clientHeight);
  }, [breadContainerRef.current?.clientHeight]);

  useEffect(() => {
    setContentHeight(contentContainerRef.current?.clientHeight);
  }, [contentContainerRef.current?.clientHeight]);

  /**
   * @todo 获取机构数据
   */
  useEffect(() => {
    getUserDept(dispatch);
  }, []);

  return (
    <Layout>
      <Header className="header">
        <img className="header-logo" src={logo} />
        <Divider type="vertical" className="header-divider" />
        <div className="header-title-dept">
          {(common.userDept && common.userDept.deptName) || ''}
        </div>
      </Header>
      <Layout>
        <LayoutMenu menus={menus} />
        {
          pathname !== '/' && pathname !== '/home' ? (
            <Layout className="site-layout" style={{ position: 'relative' }}>
              <div className={`${prefix}-bread`} ref={breadContainerRef}>
                <LayoutBread />
              </div>
              <div
                ref={contentContainerRef}
                style={{
                  padding: '0px 12px 12px 12px',
                  position: 'relative',
                  display: 'flex',
                  flex: 1,
                  marginTop: `${breadHeight + 6}px`,
                  height: `${contentHeight}px`,
                }}
              >
                <div
                  className="site-layout-background"
                  style={{
                    padding: 12,
                    marginTop: 8,
                    height: `${contentHeight - 24}px`,
                    width: '100%',
                    overflow: 'auto',
                  }}
                >
                  {props.children}
                </div>
              </div>
            </Layout>
          ) : (
              <div style={{ width: '100%', margin: 24, backgroundColor: 'white' }}>
                {props.children}
              </div>
            )
        }

      </Layout>
    </Layout>
  );
}

export default LayoutContainer;
