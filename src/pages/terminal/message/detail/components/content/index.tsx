import React, { useState } from 'react';
import { useAntdTable } from 'ahooks';
import { ITerminalSystemDetailInfo } from '../../types';
import { Descriptions, Row, Col, Table, Form } from 'antd';
import { merge } from 'lodash';
import Forms from '@/component/form';
import { FormItem, FormItmeType } from '@/component/form/type';
import Application from '../application';
import Traffic from '../traffic';
import Power from '../power';
import SystemInfo from '../system'
import { getDictText } from '@/pages/common/util';

type Props = {
  currentTab: { title: string; key: string };
  terminalDetailInfo: ITerminalSystemDetailInfo;
};

export function renderColumns(array: any[]) {
  const mergeArray = merge([], array);
  const secondArr = mergeArray.splice(0, array.length / 2);
  return (
    <Row style={{ padding: 12 }}>
      {[mergeArray, secondArr].map((array, index) => {
        return (
          <Col span={10} style={{ marginLeft: index === 1 ? '24px' : '' }}>
            <Descriptions bordered column={1}>
              {array.length > 0 &&
                array.map((item: any) => {
                  return (
                    <Descriptions.Item
                      label={<div style={{ width: '100px' }}>{item.label}</div>}
                    >
                      {item.value}
                    </Descriptions.Item>
                  );
                })}
            </Descriptions>
          </Col>
        );
      })}
    </Row>
  );
}

export default (props: Props) => {
  const { currentTab, terminalDetailInfo } = props;
  const terminalInfo = terminalDetailInfo?.terminalInfoInOutput || {}
  /**
   * 基础信息
   */
  if (currentTab.key === '1') {
    const detailArr: any[] = [];
    detailArr.push({
      label: '终端序列号',
      value:
        (terminalInfo &&
          terminalInfo.tusn) ||
        '--',
    });
    detailArr.push({
      label: '所属组别',
      value:
        (terminalInfo &&
          terminalInfo.groupNames) ||
        '--',
    });
    detailArr.push({
      label: '终端类型',
      value:
        (terminalInfo &&
          terminalInfo.terminalTypeName) ||
        '--',
    });
    detailArr.push({
      label: 'IMSI',
      value:
        (terminalInfo &&
          terminalInfo.imsi) ||
        '--',
    });
    detailArr.push({
      label: '终端状态',
      value:
        (terminalInfo &&
          typeof terminalInfo.status === 'number' &&
          terminalInfo.status === 1
          ? '已激活'
          : '未激活') || '--',
    });
    detailArr.push({
      label: '商户编号',
      value:
        (terminalInfo &&
          terminalInfo.merchantCode) ||
        '--',
    });
    detailArr.push({
      label: '商户名称',
      value:
        (terminalInfo &&
          terminalInfo.merchantName) ||
        '--',
    });
    detailArr.push({
      label: '手机号',
      value: terminalInfo?.applyPhone || '--',
    });
    detailArr.push({
      label: '银联间直连',
      value: (!terminalInfo.cupConnMode ? '间连' : '直连'),
    });
    detailArr.push({
      label: '商户地址',
      value:
        terminalInfo &&
          terminalInfo?.merchantAddress || '--'
          // ? `${terminalInfo.county} ${terminalInfo.city} ${terminalInfo.address}`
          // : '--',
    });
    detailArr.push({
      label: '是否支持DCC',
      value: (!terminalInfo.dccSupFlag ? '支持' : '不支持'),
    });
    detailArr.push({
      label: '所属机构',
      value:
        (terminalInfo &&
          terminalInfo.deptName) ||
        '--',
    });
    detailArr.push({
      label: '终端厂商',
      value:
        (terminalInfo &&
          terminalInfo.firmName) ||
        '--',
    });
    detailArr.push({
      label: 'IMEI',
      value:
        (terminalInfo &&
          terminalInfo.imei) ||
        '--',
    });
    detailArr.push({
      label: '无线地址',
      value:
        (terminalInfo &&
          terminalInfo.netMark) ||
        '--',
    });
    detailArr.push({
      label: '终端编号',
      value: terminalInfo?.terminalCode || '--',
    });
    detailArr.push({
      label: '商户姓名',
      value: terminalInfo?.legalPerson || '--',
    });
    detailArr.push({
      label: '激活时间',
      value:
        (terminalInfo &&
          terminalInfo.createTime) ||
        '--',
    });
    detailArr.push({
      label: '业务类型',
      value: getDictText(terminalInfo.bussType || '', 'buss_type')
    });
    console.log('arr:', detailArr);
    return renderColumns(detailArr);
  }

  /**
   * 系统信息
   */
  if (currentTab.key === '2') {
    return <SystemInfo terminalSystemDetail={terminalDetailInfo?.terminalSysdetail || {}}/>
  }

  /**
   * 应用信息
   */
  if (currentTab.key === '3') {
    return <Application terminalDetailInfo={{terminalInfo: terminalInfo} as any} />;
  }

  /**
   * 流量信息
   */
  if (currentTab.key === '4') {
    return <Traffic terminalDetailInfo={{terminalInfo: terminalInfo} as any} />;
  }

  /**
   * 开机记录
   */
  if (currentTab.key === '5') {
    return <Power terminalDetailInfo={{terminalInfo: terminalInfo} as any} />;
  }
  return <div>500</div>;
};
