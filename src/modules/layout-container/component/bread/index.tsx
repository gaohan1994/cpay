import React, { useState, useEffect } from 'react';
import { useMount } from 'ahooks';
import { Breadcrumb } from 'antd';
import { withRouter } from 'react-router';
import { menuConfig } from '@/common/menu-config';
import {
  ILayoutSiderMenu,
  ILayoutSiderSubMenu,
  isSiderMenu,
} from '@/modules/layout-container/types';
import { Link } from 'react-router-dom';

const { Item } = Breadcrumb;

type Props = {
  location: any;
};

function Bread(props: Props) {
  const [breadData, setBreadData] = useState(
    [] as Array<ILayoutSiderMenu | ILayoutSiderSubMenu>
  );
  const getBreadData = (path: string) => {
    /**
     * isFirstLevel === 1时是一级目录
     */
    const pathNames = path.split('/').filter((item) => !!item);
    const isFirstLevel = pathNames.length === 1;

    if (!!isFirstLevel) {
      const currentBreadData = menuConfig.find(
        (menu) => menu.path === pathNames[0]
      );
      currentBreadData && setBreadData([currentBreadData]);
    } else {
      const firstBreadData = menuConfig.find(
        (menu) => menu.path === pathNames[0]
      );
      const secondBreadData =
        firstBreadData &&
        firstBreadData.subMenus &&
        firstBreadData.subMenus.find(
          (firstBreadDataSubMenuItem) =>
            firstBreadDataSubMenuItem.path.indexOf(pathNames[1]) !== -1
        );
      firstBreadData &&
        secondBreadData &&
        setBreadData([firstBreadData, secondBreadData]);
    }
  };

  useMount(() => {
    const { pathname } = props.location;
    getBreadData(pathname);
  });

  useEffect(() => {
    const { pathname } = props.location;
    getBreadData(pathname);
  }, [props.location.pathname]);

  return (
    <Breadcrumb>
      {breadData.map((breadItem) => {
        if (isSiderMenu(breadItem)) {
          return <Item key={breadItem.name}>{breadItem.name}</Item>;
        } else {
          return (
            <Link
              to={`/${breadItem.path}`}
              key={breadItem.name}
              // style={{ color: '#1890ff !important' }}
            >
              {breadItem.name}
            </Link>
          );
        }
      })}
    </Breadcrumb>
  );
}

export default withRouter(Bread);
