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

export declare module CommonReducerInterface {
  // common reducer 的类型定义
  interface ICommonReducerState {
    deptData: DeptItem[];
    deptTreeData: DeptTreeData[];
  }

  // connect common的类型定义
  interface IConnectReducerState {
    common: ICommonReducerState;
  }
}
