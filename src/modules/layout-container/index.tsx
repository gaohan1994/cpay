import React from 'react';
import { Layout } from 'antd';
import './index.scss';
import LayoutHeader from './component/header';
import LayoutMenu from './component/menu';
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
      <Layout className='site-layout' style={{ paddingTop: '45px' }}>
        <Content style={{ margin: '24px 16px', padding: 24 }}>
          <div
            className='site-layout-background'
            style={{ padding: 24, textAlign: 'center' }}
          >
            {props.children}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Ant Design ©2018 Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
}

export default LayoutContainer;
