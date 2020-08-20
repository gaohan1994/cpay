import { TerminalGroupItem } from '@/pages/terminal/group/types';
import { TerminalParamItem } from '@/pages/terminal/params/types';

export interface ITerminalParams {
  sysUpRequiresNoOperTime: string;
  tmsDomainName: string;
  locationIntvl: string;
  moveCheckIntvl: string;
  fileDownloadHtval: string;
  upFlowIntvl: string;
  casDomainName: string;
  tmsDomainNameBakFirst: string;
  appUpdateRequiredPower: string;
  htIntvl: string;
  tmsDomainNameBakSecond: string;
  fileTraTimeout: string;
  systemUpdateRequiredPower: string;
  reDownNum: string;
  appUpRequiresNoOperTime: string;
  mapPswd: string;
  isWifi: string;
  upInfoIntvl: string;
  amsDomainName: string;
  managePwd: string;
  broadcastTime: string;
  reHtIntvl: string;
}

export interface ITerminalParam {
  terminalGroupList: TerminalGroupItem[];
  terminalParam: TerminalParamItem;
  params: ITerminalParams;
}

export interface ComponentItem {
  title: string;
  key: string;
  setCurrentCallback?: (params: string) => void;
  render?: () => any;
}

export declare module FetchField {
  interface TerminalParam {
    id: string;
  }
}
