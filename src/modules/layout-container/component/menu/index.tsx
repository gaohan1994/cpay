import React, { useState, useEffect } from 'react';
import { Layout, Menu } from 'antd';
import './index.less';
import { ILayoutSiderMenu } from '../../types';
import { MenuInfo } from 'rc-menu/lib/interface';
import { history } from '@/common/history-util';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

const { Sider } = Layout;
const { SubMenu } = Menu;

type Props = {
  menus: ILayoutSiderMenu[];
};

/**
 * 设置最多允许显示一个子分类
 *
 * @author Ghan
 * @param {Props} props
 * @returns
 */
function LayoutMenu(props: Props) {
  const { menus } = props;
  const [rootSubmenuKeys, setRootSubmenuKeys] = useState([] as string[]);
  const [collapsed, setCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = useState([] as string[]);

  useEffect(() => {
    let rootKeys: string[] = [];
    menus.map((item, index) => {
      if (!!item.subMenus) {
        rootKeys.push(item.value);
      }
    });
    setRootSubmenuKeys(rootKeys);
  }, []);

  const onCollapse = () => {
    setCollapsed(!collapsed);
  };

  const onOpenChange = (keys: any) => {
    const latestOpenKey: any = keys.find(
      (key: any) => openKeys.indexOf(key) === -1
    );
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  /**
   * 当菜单点击
   * @param menu
   */
  const onMenuClick = (menu: MenuInfo) => {
    (history as any).push(`/${menu.key}`);
  };

  const triggerResizeEvent = () => {
    // eslint-disable-line
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }
  const toggle = (e: any) => {
    triggerResizeEvent();
  };

  const renderTrigger = () => {
    return (
      <div style={{  textAlign: 'left', zIndex: 999 }}>
        <span className={'trigger'} onClick={toggle}>

          {
            collapsed ? (
              <MenuUnfoldOutlined />
            ) : (
                <MenuFoldOutlined />
              )
          }
        </span>
      </div>

    )
  }

  return (
    <Sider
      theme='light'
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      trigger={renderTrigger()}
      style={{ zIndex: 999 }}
    >
      {menus && (
        <Menu
          onClick={onMenuClick}
          mode='inline'
          openKeys={openKeys}
          onOpenChange={onOpenChange}
        >
          {menus.map((menuItem: ILayoutSiderMenu, index: number) => {
            if (!!menuItem.subMenus) {
              return (
                <SubMenu
                  key={menuItem.value}
                  icon={<menuItem.icon />}
                  title={menuItem.name}
                >
                  {menuItem.subMenus.map((subMenuItem, subIndex) => {
                    return (
                      <Menu.Item key={subMenuItem.value}>
                        {subMenuItem.name}
                      </Menu.Item>
                    );
                  })}
                </SubMenu>
              );
            }
            return (
              <Menu.Item key={menuItem.value} icon={<menuItem.icon />}>
                {menuItem.name}
              </Menu.Item>
            );
          })}
        </Menu>
      )}
    </Sider>
  );
}
export default LayoutMenu;
