import React, { useState, useEffect } from 'react';
import { Breadcrumb } from 'antd';
import { withRouter } from 'react-router';
import { menuConfig } from '@/common/menu-config';
import { ILayoutSiderSubMenu } from '@/modules/layout-container/types';
import { Link } from 'react-router-dom';
import { routerConfig } from '@/common/route-config';

const { Item } = Breadcrumb;

type Props = {
  location: any;
};

/**
 * 传入url 返回一个数组，里面是该pathname对应的面包屑
 * @param pathname string
 */
function fomartBreadData(pathname: string): ILayoutSiderSubMenu[] {
  /**
   * @param {breads} 要返回的面包屑数据
   */
  let breads: ILayoutSiderSubMenu[] = [];
  /**
   * 第一步 分解 pathname /advertisement/review/detail => [advertisement, review, detail]
   */
  const paths = pathname.split('/').filter((item) => !!item);

  /**
   * @param {pathLevel} number;
   * 当前url属于几级目录
   */
  const pathLevel = paths.length;

  for (let i = 0; i < pathLevel; i++) {
    /**
     * 遍历path
     * @param {i=0} 注意i=0的时候从menuconfig拿数据吧
     *
     * @param {currentPathData} 目前遍历到第几个就取到第几个数据
     * @param {currentMenu} 当前menu
     */
    const currentPathData = paths.slice(0, i + 1);

    if (i === 0) {
      const firstBread = menuConfig.find(
        (menu) => menu.path === currentPathData[0]
      );
      if (firstBread) {
        breads.push(firstBread);
      }
    } else {
      const currentMenu = routerConfig.find(
        (menu) => menu.path === `/${currentPathData.join('/')}`
      );
      if (currentMenu) {
        breads.push(currentMenu as any);
      }
    }
  }
  return breads;
}

function Bread(props: Props) {
  const [breads, setBreads] = useState([] as Array<any>);
  useEffect(() => {
    const { pathname } = props.location;
    const fomartBread = fomartBreadData(pathname);
    setBreads(fomartBread);
  }, [props.location.pathname]);

  return (
    <Breadcrumb>
      {breads.map((breadItem, index) => {
        return (
          <Item key={breadItem.name}>
            {index === 0 || index === breads.length - 1 ? (
              breadItem.name
            ) : (
              <Link
                to={`${
                  (breadItem.path as string).startsWith('/')
                    ? breadItem.path
                    : `/${breadItem.path}`
                }`}
              >
                {breadItem.name}
              </Link>
            )}
          </Item>
        );
      })}
    </Breadcrumb>
  );
}

export default withRouter(Bread);
