export interface FlowItem {
  monthFlow: number;
  recordMonth: string;
  tusn: string;
}

export interface ITerminalPower {
  createTime: string;
  firmName: string;
  idsInput: string;
  remark: string;
  typeCode: string;
  typeName: string;
  updateTime: string;
  firmId: number;
  id: number;
}

export declare module FetchField {
  interface TerminalFlowList {
    monthFlow: string;
    recordMonth: string;
    tusn: string;
  }

  interface TerminalPowerList {
    closeTime: string;
    createTime: string;
    id: string;
    openTime: string;
    tusn: string;
    updateTime: string;
  }
}
