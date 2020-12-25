import React, { useState, useEffect } from 'react'
import {renderColumns} from '../content/index'
import { ITerminalSystemDetail} from '../../types'

export default (props: {terminalSystemDetail: ITerminalSystemDetail}) => {
  const terminalSystemDetail = props.terminalSystemDetail
  const detailArr: any[] = [];
  detailArr.push({
    label: '系统版本',
    value: terminalSystemDetail?.osVersion || '--',
  });
  detailArr.push({
    label: '安全模块版本',
    value:  terminalSystemDetail?.safeModelVersion || '--',
  });
  detailArr.push({
    label: '运维SDK版本',
    value:  terminalSystemDetail?.tmsSdk || '--',
  });
  detailArr.push({
    label: '收单SDK版本',
    value:  terminalSystemDetail?.paySdk || '--',
  });
  detailArr.push({
    label: 'POS管家内部版本',
    value:  terminalSystemDetail?.tmsAppVersion || '--',
  });
  detailArr.push({
    label: '收单应用',
    value:  terminalSystemDetail?.payAppName || '--',
  });
  detailArr.push({
    label: '网络类型',
    value:  terminalSystemDetail?.networkType || '--',
  });
  detailArr.push({
    label: '蓝牙地址',
    value:  terminalSystemDetail?.blueTooth || '--',
  });
  detailArr.push({
    label: 'Android版本',
    value:  terminalSystemDetail?.androidVersion || '--',
  });
  detailArr.push({
    label: '参数版本',
    value:  terminalSystemDetail?.commParaVersion || '--',
  });
  detailArr.push({
    label: 'EMV版本',
    value:  terminalSystemDetail?.emvVersion || '--',
  });
  detailArr.push({
    label: 'POS管家外部版本',
    value:  terminalSystemDetail?.payAppVersionOutside || '--',
  });
  return renderColumns(detailArr);
}