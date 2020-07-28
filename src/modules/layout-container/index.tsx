import React from 'react';
import { Layout } from 'antd';
import './index.scss';
import LayoutHeader from './component/header';
import LayoutMenu from './component/menu';
import LayoutBread from './component/bread';
import { ILayoutSiderMenu, ILayoutSiderSubMenu } from './types';

const { Content, Footer } = Layout;

type Props = {
  menus: ILayoutSiderMenu[];
  children: any;
};

function LayoutContainer(props: Props) {
  const { menus } = props;

  return (
    <Layout>
      <LayoutHeader />
      <LayoutMenu menus={menus} />
      <Layout className="site-layout" style={{ paddingTop: '45px' }}>
        <Content style={{ padding: 12 }}>
          <LayoutBread />
          <div
            className="site-layout-background"
            style={{ padding: 12, marginTop: 8, textAlign: 'center' }}
          >
            {props.children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default LayoutContainer;
