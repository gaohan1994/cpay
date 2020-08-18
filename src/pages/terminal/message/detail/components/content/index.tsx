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

type Props = {
  currentTab: { title: string; key: string };
  terminalDetailInfo: ITerminalSystemDetailInfo;
};

function renderColumns(array: any[]) {
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
  console.log('currentTab', currentTab);
  /**
   * 基础信息
   */
  if (currentTab.key === '1') {
    const detailArr: any[] = [];
    detailArr.push({
      label: '终端序列号',
      value:
        (terminalDetailInfo &&
          terminalDetailInfo.terminalInfo &&
          terminalDetailInfo.terminalInfo.tusn) ||
        '--',
    });
    detailArr.push({
      label: '所属组别',
      value:
        (terminalDetailInfo &&
          terminalDetailInfo.terminalInfo &&
          terminalDetailInfo.terminalInfo.groupNames) ||
        '--',
    });
    detailArr.push({
      label: '终端类型',
      value:
        (terminalDetailInfo.terminalInfo &&
          terminalDetailInfo.terminalInfo.terminalTypeName) ||
        '--',
    });
    detailArr.push({
      label: 'IMSI',
      value:
        (terminalDetailInfo.terminalInfo &&
          terminalDetailInfo.terminalInfo.imsi) ||
        '--',
    });
    detailArr.push({
      label: '终端状态',
      value:
        (terminalDetailInfo.terminalInfo &&
        typeof terminalDetailInfo.terminalInfo.status === 'number' &&
        terminalDetailInfo.terminalInfo.status === 1
          ? '已激活'
          : '未激活') || '--',
    });
    detailArr.push({
      label: '商户编号',
      value:
        (terminalDetailInfo.terminalInfo &&
          terminalDetailInfo.terminalInfo.merchantId) ||
        '--',
    });
    detailArr.push({
      label: '商户名称',
      value:
        (terminalDetailInfo.terminalInfo &&
          terminalDetailInfo.terminalInfo.merchantName) ||
        '--',
    });
    detailArr.push({
      label: '手机号',
      value: '--',
    });
    detailArr.push({
      label: '银联间直连',
      value: '--',
    });
    detailArr.push({
      label: '商户地址',
      value:
        terminalDetailInfo.terminalInfo &&
        terminalDetailInfo.terminalInfo.county
          ? `${terminalDetailInfo.terminalInfo.county} ${terminalDetailInfo.terminalInfo.city} ${terminalDetailInfo.terminalInfo.address}`
          : '--',
    });
    detailArr.push({
      label: '是否支持DCC',
      value: '--',
    });
    detailArr.push({
      label: '所属机构',
      value:
        (terminalDetailInfo.terminalInfo &&
          terminalDetailInfo.terminalInfo.deptName) ||
        '--',
    });
    detailArr.push({
      label: '终端厂商',
      value:
        (terminalDetailInfo.terminalInfo &&
          terminalDetailInfo.terminalInfo.firmName) ||
        '--',
    });
    detailArr.push({
      label: 'IMEI',
      value:
        (terminalDetailInfo.terminalInfo &&
          terminalDetailInfo.terminalInfo.imei) ||
        '--',
    });
    detailArr.push({
      label: '无线地址',
      value:
        (terminalDetailInfo.terminalInfo &&
          terminalDetailInfo.terminalInfo.netMark) ||
        '--',
    });
    detailArr.push({
      label: '终端类型',
      value:
        (terminalDetailInfo.terminalInfo &&
          terminalDetailInfo.terminalInfo.terminalTypeName) ||
        '--',
    });
    detailArr.push({
      label: '终端编号',
      value: '--',
    });
    detailArr.push({
      label: '商户姓名',
      value: '--',
    });
    detailArr.push({
      label: '激活时间',
      value:
        (terminalDetailInfo.terminalInfo &&
          terminalDetailInfo.terminalInfo.createTime) ||
        '--',
    });
    detailArr.push({
      label: '业务类型',
      value: '--',
    });
    console.log('arr:', detailArr);
    return renderColumns(detailArr);
  }

  /**
   * 系统信息
   */
  if (currentTab.key === '2') {
    const detailArr: any[] = [];
    detailArr.push({
      label: '系统版本',
      value: '--',
    });
    detailArr.push({
      label: '安全模块版本',
      value: '--',
    });
    detailArr.push({
      label: '运维SDK版本',
      value: '--',
    });
    detailArr.push({
      label: '收单SDK版本',
      value: '--',
    });
    detailArr.push({
      label: 'POS管家内部版本',
      value: '--',
    });
    detailArr.push({
      label: '收单应用',
      value: '--',
    });
    detailArr.push({
      label: '网络类型',
      value: '--',
    });
    detailArr.push({
      label: '蓝牙地址',
      value: '--',
    });
    detailArr.push({
      label: 'Android版本',
      value: '--',
    });
    detailArr.push({
      label: '参数版本',
      value: '--',
    });
    detailArr.push({
      label: 'EMV版本',
      value: '--',
    });
    detailArr.push({
      label: 'POS管家外部版本',
      value: '--',
    });
    return renderColumns(detailArr);
  }

  /**
   * 应用信息
   */
  if (currentTab.key === '3') {
    return <Application terminalDetailInfo={terminalDetailInfo} />;
  }

  /**
   * 流量信息
   */
  if (currentTab.key === '4') {
    return <Traffic terminalDetailInfo={terminalDetailInfo} />;
  }

  /**
   * 开机记录
   */
  if (currentTab.key === '5') {
    return <Power terminalDetailInfo={terminalDetailInfo} />;
  }
  return <div>500</div>;
};
