import React, { useState, useEffect } from 'react';
import { Layout, Menu } from 'antd';
import { useMount } from 'ahooks';
// import History from 'react-router-dom'
import './index.scss';
import { ILayoutSiderMenu } from '../../types';
import { MenuInfo } from 'rc-menu/lib/interface';
import { history } from '@/common/history-util';

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
  // const history = History.useHistory();
  const { menus } = props;
  const [rootSubmenuKeys, setRootSubmenuKeys] = useState([] as string[]);
  const [collapsed, setCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = useState([] as string[]);
  const [selectedKeys, setSelectedKeys] = useState([] as string[]);

  useMount(() => {
    let rootKeys: string[] = [];
    menus.map((item, index) => {
      if (!!item.subMenus) {
        rootKeys.push(item.value);
      }
    });
    setRootSubmenuKeys(rootKeys);
    const keys = window.location.hash.split('/')[1];
    onOpenChange([keys]);

    const secondKey = window.location.hash.split('/')[2];
    const didSelectKeys = [
      keys,
      secondKey
        ? secondKey.indexOf('-') !== -1
          ? secondKey.split('-')[0]
          : secondKey
        : '',
    ];
    onSelect({ key: didSelectKeys.join('/') });
  });

  const onCollapse = () => {
    setCollapsed(!collapsed);
  };

  const onOpenChange = (keys: any) => {
    console.log('keys', keys);
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

  const onSelect = (keys: any) => {
    setSelectedKeys(keys.key);
  };
  return (
    <Sider
      theme="light"
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
    >
      <div className="layout-container-menu">
        {menus && (
          <Menu
            onClick={onMenuClick}
            mode="inline"
            openKeys={openKeys}
            onOpenChange={onOpenChange}
            onSelect={onSelect}
            selectedKeys={selectedKeys}
          >
            {menus.map((menuItem: ILayoutSiderMenu) => {
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
      </div>
    </Sider>
  );
}
export default LayoutMenu;
