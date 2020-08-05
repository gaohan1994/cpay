export declare module FetchField {
  interface ITerminalGroupSetExport {
    groupId: string;
    id: string;
    terminalId: string;
  }

  interface ITerminalGroupSetList {
    groupId: string;
    id: string;
    terminalId: string;
  }

  interface ITerminalGroupSetEdit {
    id: string;
    mmap: string;
  }

  interface ITerminalGroupSetDetail {
    id: string;
  }

  interface ITerminalGroupSetAdd {
    groupId: string;
    ids: string;
  }

  interface ITerminalGroupSetRemove {
    ids: string;
  }

  interface ITerminalInfoList {
    address: string;
    city: string;
    county: string;
    deptId: string;
    deptName: string;
    firmId: string;
    firmName: string;
    groupFlag: string;
    groupId: string;
    groupName: string;
    id: string;
    imei: string;
    imsi: string;
    merchantId: string;
    merchantName: string;
    netMark: string;
    province: string;
    status: string;
    terminalCode: string;
    terminalCopsDevid: string;
    terminalCopsSign: string;
    terminalId: string;
    terminalTypeId: string;
    terminalTypeName: string;
    tusn: string;
  }
}
