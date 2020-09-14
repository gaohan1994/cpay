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

const prefix = 'component-layout';

const { Header } = Layout;

type Props = {
  menus: ILayoutSiderMenu[];
  children: any;
};

function LayoutContainer(props: Props) {
  const breadContainerRef: any = useRef(null);
  const { menus } = props;
  const [useSelector, dispatch] = useRedux();
  const common = useSelectorHook((state) => state.common);
  const [breadHeight, setBreadHeight] = useState(0);

  useEffect(() => {
    setBreadHeight(breadContainerRef.current?.offsetHeight);
  }, [breadContainerRef.current?.clientHeight]);

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
        <Layout className="site-layout" style={{ position: 'relative' }}>
          <div className={`${prefix}-bread`} ref={breadContainerRef}>
            <LayoutBread />
          </div>
          <div
            style={{
              padding: '0px 12px 12px 12px',
              position: 'relative',
              marginTop: `${breadHeight + 12}px`,
              overflow: 'auto',
            }}
          >
            <div
              className="site-layout-background"
              style={{ padding: 12, marginTop: 8, marginBottom: 100 }}
            >
              {props.children}
            </div>
          </div>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default LayoutContainer;
