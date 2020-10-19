export interface ITerminalSystemDetail {
  ram: number;
  rom: number;
  sd: number;
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
}

export interface ITerminalSystemDetailInfo {
  systemDetail: ITerminalSystemDetail;
  terminalAppList: any[];
  terminalFlowMonthList: any[];
  terminalInfo: ITerminalInfo;
  terminalPowerList: any[];
  terminalSysdetail: any;
}
