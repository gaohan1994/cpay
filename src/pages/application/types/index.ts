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

export interface IAppType {
  createBy: string; // 创建人
  createTime: string; // 创建时间
  deptCode: string; // 机构号
  deptId: number; // 机构ID
  deptName: string; // 机构名称
  iconPath: string; // 图标路径
  id: number; // 应用类型id
  typeCode: string; // 类型编号
  typeName: string; // 应用名称
  updateBy: string; // 更新人
  updateTime: string; // 更新时间
  userId: number;
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