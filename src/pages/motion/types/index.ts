export interface ShiftItem {
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
  interface List {
    latitude: string;
    longitude: string;
    power: string;
    termStatus: string;
    tusn: string;
  }
  interface Exp extends List {}
}
