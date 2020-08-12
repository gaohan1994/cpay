import { UserDept } from "@/common/type";

export interface DeptItem {
  checked: boolean;
  pId: number;
  id: number;
  name: string;
  title: string;
}

export interface DeptTreeData extends DeptItem {
  children?: DeptItem[];
}

export interface DictItem {
  createBy: string;
  createTime: string;
  remark: string;
  dictName: string;
  dictType: string;
  params: any;
  dictId: number;
  status: number;
  data: DictDetailItem[];
}

export interface DictDetailItem {
  createBy: string;
  createTime: string;
  dictLabel: string;
  dictValue: string;
  dictType: string;
  isDefault: string;
  params: any;
  dictCode: number;
  dictSort: number;
  status: number;
}

export interface CommonHooksState {
  deptList: DeptItem[];
  deptTreeList: DeptTreeData[];
  dictList: {
    [key: string]: DictItem;
  };
}

export declare module CommonReducerInterface {
  // common reducer 的类型定义
  interface ICommonReducerState {
    deptData: DeptItem[];
    deptTreeData: DeptTreeData[];
    dictList: {
      [key: string]: DictItem;
    };
    userDept: UserDept;
  }

  // connect common的类型定义
  interface IConnectReducerState {
    common: ICommonReducerState;
  }
}
