import React from 'react';
import { Layout, ConfigProvider, Menu } from 'antd';
import './index.scss';
import LayoutHeader from './component/header';
import LayoutMenu from './component/menu';
import LayoutBread from './component/bread';
import { ILayoutSiderMenu, ILayoutSiderSubMenu } from './types';
import locale from 'antd/es/locale/zh_CN';

const { Content, Footer, Header } = Layout;

type Props = {
  menus: ILayoutSiderMenu[];
  children: any;
};

function LayoutContainer(props: Props) {
  const { menus } = props;

  return (
    <ConfigProvider locale={locale}>
      <Layout>
        <Header className="header">
          <div className="logo" />
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

    </ConfigProvider>
  );
}

export default LayoutContainer;
