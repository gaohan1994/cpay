export interface TerminalInfo {
  createBy: string;
  createTime: string;
  deptName: string;
  firmName: string;
  merchantName: string;
  terminalTypeName: string;
  tusn: string;
  updateTime: string;
  deptId: number;
  firmId: number;
  id: number;
  merchantId: number;
  status: number;
  terminalCopsSign: number;
  terminalTypeId: number;
}

export interface ITerminalFirmItem {
  id: number;
  code: string;
  firmName: string;
  address: string;
  contacts: string;
  phoneNum: string;
  remark: string;
  publicKey: string;
  createTime: string;
  updateTime: string;
}

export interface ITerminalType {
  id: number;
  firmId: number;
  typeCode: string;
  typeName: string;
  remark: string;
  createTime: string;
  firmName: string;
}

export declare module FetchField {
  /**
   * 查询终端厂商列表不分页的请求参数
   *
   * @interface TerminalFirmListAll
   */
  interface TerminalFirmListAll {
    address?: string;
    code?: string;
    contacts?: string;
    firmName?: string;
    id?: string;
    phoneNum?: string;
    publicKey?: string;
    remark?: string;
  }

  /**
   * 根据终端厂商查询型号列表请求参数
   *
   * @interface TerminalTypeListByFirm
   */
  interface TerminalTypeListByFirm {
    firmId: string;
  }
}
