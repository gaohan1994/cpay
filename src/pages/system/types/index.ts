import { IListField } from '@/common/type';

export declare module ISystemReducerInterface {
  // common reducer 的类型定义
  interface IReducerState {
    menuList: IMenuItem[];
    menuTreeData: any[];
  }

  // connect common的类型定义
  interface IConnectReducerState {}
}


export interface IMenuItem {

}