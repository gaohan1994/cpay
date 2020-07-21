import React, { useState, useEffect } from 'react';
import { Breadcrumb } from 'antd';
import { withRouter } from 'react-router';
import { menuConfig } from '@/common/menu-config';
import {
  ILayoutSiderMenu,
  ILayoutSiderSubMenu
} from '@/modules/layout-container/types';

const { Item } = Breadcrumb;

type Props = {
  location: any;
};

function Bread(props: Props) {
  const [breadData, setBreadData] = useState(
    [] as Array<ILayoutSiderMenu | ILayoutSiderSubMenu>
  );
  useEffect(() => {
    const { pathname } = props.location;
    function getBreadData(path: string) {
      /**
       * isFirstLevel === 1时是一级目录
       */
      const pathNames = path.split('/').filter(item => !!item);
      console.log('pathNames', pathNames);
      const isFirstLevel = pathNames.length === 1;

      if (!!isFirstLevel) {
        const currentBreadData = menuConfig.find(
          menu => menu.path === pathNames[0]
        );
        currentBreadData && setBreadData([currentBreadData]);
      } else {
        const firstBreadData = menuConfig.find(
          menu => menu.path === pathNames[0]
        );
        const secondBreadData =
          firstBreadData &&
          firstBreadData.subMenus &&
          firstBreadData.subMenus.find(
            firstBreadDataSubMenuItem =>
              firstBreadDataSubMenuItem.path.indexOf(pathNames[1]) !== -1
          );
        firstBreadData &&
          secondBreadData &&
          setBreadData([firstBreadData, secondBreadData]);
      }
    }
    getBreadData(pathname);
  }, [props.location.pathname]);

  return (
    <Breadcrumb>
      {breadData.map(breadItem => {
        return <Item>{breadItem.name}</Item>;
      })}
    </Breadcrumb>
  );
}

export default withRouter(Bread);
