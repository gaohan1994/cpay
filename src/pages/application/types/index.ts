import { IListField } from '@/common/type';

export declare module IAppReducerInterface {
  // common reducer 的类型定义
  interface IReducerState {
    appInfo: IUploadAppInfo;
  }

  // connect common的类型定义
  interface IConnectReducerState {}
}

export interface IAppInfoListField extends IListField {
  apkCode?: string; // 应用编号
}

export interface IUploadAppInfo {
  apkPath: string;
  appCode: string;
  appName: string;
  appSize: number;
  iconPath: string;
  permissions: string;
  signMd5: string;
  versionCode: number;
  versionName: string;
}