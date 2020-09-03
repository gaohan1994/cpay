/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-09-02 17:09:11 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-09-03 17:28:10
 * 
 * @todo 固定底部组件
 */
import React, { useState, useEffect } from 'react';
import './index.less';

export default function FooterToolbar(props: any) {
  const { children, className, extra, ...restProps } = props;
  const [width, setWidth] = useState('100%');

  useEffect(() => {
    window.addEventListener('resize', resizeFooterToolbar);
    resizeFooterToolbar();
    return () => {
      window.removeEventListener('resize', resizeFooterToolbar);
    }
  });

  const resizeFooterToolbar = () => {
    setTimeout(() => {
      const sider: any = document.querySelector('.ant-layout-sider');
      if (sider == null) {
        return;
      }
      const realWidth: any = `calc(100% - ${sider.style.width})`;
      if (realWidth !== width) {
        setWidth(realWidth);
      }
    }, 0);

  };

  return (
    <div className={`toolbar ${className}`} {...restProps} style={{ width: width }}>
      <div className={'left'}>{extra}</div>
      <div className={'right'}>{children}</div>
    </div>
  )
}