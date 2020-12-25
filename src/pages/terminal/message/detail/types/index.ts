export interface ITerminalSystemDetail {
  id: number,
  androidVersion: string;
  commParaVersion: string;
  createTime: string;
  emvVersion: string;
  launcherParaVersion: string;
  networkType: string;
  osVersion: string;
  payAppCode: string;
  payAppName: string;
  payAppVersion: string;
  payAppVersionOutside: string;
  paySdk: string;
  safeModelVersion: string;
  tmsAppVersion: string;
  tmsAppVersionOutside: string;
  tmsSdk: string;
  tusn: string;
  updateTime: string;
  blueTooth: string;
}

export interface ITerminalApp { }

export interface ITerminalInfo {
  address: string;
  city: string;
  county: string;
  createBy: string;
  createTime: string;
  deptName: string;
  firmName: string;
  terminalTypeName: string;
  tusn: string;
  updateTime: string;
  firmId: number;
  deptId: number;
  id: number;
  status: number;
  terminalCopsSign: number;
  terminalTypeId: number;
  groupNames: string;
  merchantId: string;
  merchantName: string;
  imei: string;
  imsi: string;
  netMark: string;
  merchantCode?: string;
  cupConnMode?: number;
  dccSupFlag?: number;
  terminalCode?: string;
  bussType?: string;
  legalPerson?: string;
  merchantAddress?: string;
  applyPhone?: number;
}

export interface ITerminalSystemDetailInfo {
  systemDetail: ITerminalSystemDetail;
  terminalAppList: any[];
  terminalFlowMonthList: any[];
  terminalInfo: ITerminalInfo;
  terminalPowerList: any[];
  terminalSysdetail: any;
  terminalInfoInOutput: ITerminalInfo
}
