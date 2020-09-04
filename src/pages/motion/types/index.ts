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

export interface MapItem {
  longidude: string;
  latitude: string;
}

export interface RecordListItem extends MapItem {
  id: number;
  deptId: number;
  moveStatus: number;
  lockStatus: number;
  moveCount: number;
  operationType: number;
  tusn: string;
  curAddress: string;
  distance: string;
  lockTime: string;
  createTime: string;
  updateTime: string;
}

export interface KeyListItem {
  dayCanUsedCount: string;
  dayUsedCount: string;
  id: string;
  mapKey: string;
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

  type KeyList = KeyListItem;
}
