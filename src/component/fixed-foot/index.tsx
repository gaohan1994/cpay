/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-09-03 14:37:17 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-09-03 17:28:14
 * 
 * @todo 固定底部
 */
import React, { useState, useEffect } from 'react';
import FooterToolbar from '../foot-tool-bar';
import './index.less';
import { Popover } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import { InternalNamePath } from 'antd/lib/form/interface';

export interface ErrorField {
  name: InternalNamePath;
  errors: string[];
}

export default function FixedFoot(props: any) {
  const { children, errors, fieldLabels } = props;

  const getErrorInfo = (errors: ErrorField[], fieldLabels: any) => {
    const errorCount = errors?.filter((item) => item.errors.length > 0).length;
    if (!errors || errorCount === 0) {
      return null;
    }
    const scrollToField = (fieldKey: string) => {
      const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
      if (labelNode) {
        labelNode.scrollIntoView(true);
      }
    };
    const errorList = errors.map((err) => {
      if (!err || err.errors.length === 0) {
        return null;
      }
      const key = err.name[0] as string;
      return (
        <li key={key} className={'errorListItem'} onClick={() => scrollToField(key)}>
          <CloseCircleOutlined className={'errorIcon'} />
          <div className={'errorMessage'}>{err.errors[0]}</div>
          <div className={'errorField'}>{fieldLabels[key]}</div>
        </li>
      );
    });

    return (
      <span className={'errorIcon'} style={{}}>
        <Popover
          title="表单校验信息"
          content={errorList}
          overlayClassName={'errorPopover'}
          trigger="click"
          getPopupContainer={(trigger: HTMLElement) => {
            if (trigger && trigger.parentNode) {
              return trigger.parentNode as HTMLElement;
            }
            return trigger;
          }}
        >
          <CloseCircleOutlined />
        </Popover>
        {errorCount}
      </span>
    );
  };
  return (
    <FooterToolbar >
      {getErrorInfo(errors, fieldLabels)}
      {children}
    </FooterToolbar>
  )
}