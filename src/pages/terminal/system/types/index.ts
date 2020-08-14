export interface ISysDetail {
  osVer: string;
  safeModVer: string;
  androidVer: string;
  tmsSDK: string;
  paySDK: string;
  emvVer: string;
  imageResolution: string;
  screenSize: string;
  screenDensity: string;
  ppi: string;
  frontCamera: string;
  backCamera: string;
  ram: string;
  rom: string;
  sd: string;
  paramVer: string;
  pbocVer: string;
  model: string;
  blueTooth: string;
  baseVer: string;
  tmsAppVersionOutSide: string;
}

export interface ITerminalSysDetail {
  id: string;
  tusn: string;
  sysDetail: ISysDetail;
  commParaVersion: string;
  createTime: string;
  updateTime: string;
}

export declare module FetchField {
  interface ITerminalSysdetailList {
    commParaVersion: string;
    createTime: string;
    id: string;
    launcherParaVersion: string;
    osVersion: string;
    sysDetail: string;
    tusn: string;
  }
}
