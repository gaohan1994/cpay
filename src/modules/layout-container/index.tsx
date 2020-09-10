import React, { useEffect } from 'react';
import { Layout, ConfigProvider, Menu, Divider } from 'antd';
import './index.scss';
import LayoutHeader from './component/header';
import LayoutMenu from './component/menu';
import LayoutBread from './component/bread';
import { ILayoutSiderMenu, ILayoutSiderSubMenu } from './types';
import logo from '../../assets/logo.png';
import { useSelectorHook, useRedux } from '@/common/redux-util';
import { getUserDept } from '@/common/api';

const { Content, Footer, Header } = Layout;

type Props = {
  menus: ILayoutSiderMenu[];
  children: any;
};

function LayoutContainer(props: Props) {
  const { menus } = props;
  const [useSelector, dispatch] = useRedux();
  const common = useSelectorHook((state) => state.common);

  /**
   * @todo 获取机构数据
   */
  useEffect(() => {
    getUserDept(dispatch);
  }, []);

  return (
    <Layout>
      <Header className="header">
        {/* <div className="header-logo" /> */}
        <img className="header-logo" src={logo} />
        <Divider type="vertical" className="header-divider" />
        <div className="header-title-dept">{common.userDept && common.userDept.deptName || ''}</div>
      </Header>
      <Layout>
        <LayoutMenu menus={menus} />
        <Layout className="site-layout">
          <Content style={{ padding: 12 }}>
            <LayoutBread />
            <div
              className="site-layout-background"
              style={{ padding: 12, marginTop: 8, marginBottom: 100 }}
            >
              {props.children}
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default LayoutContainer;
