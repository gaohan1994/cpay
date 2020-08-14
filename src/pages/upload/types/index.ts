/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-08-12 14:49:27 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-08-12 15:36:39
 * 
 * @todo 远程更新模块的类型文件
 */

export declare module IUploadReducerInterface {
  // common reducer 的类型定义
  interface IReducerState {

  }

  // connect common的类型定义
  interface IConnectReducerState { }
}

/**
 * @todo 新增软件信息参数
 */
export interface ISoftAddField {
  id?: number;      // 软件id，修改信息时候用
  appName: string;
  appPath: string;
  appSize: number;
  code: string;
  fileMd5: string;
  firmId: number;
  remark?: string;
  iconPath?: string;
  terminalTypes: string;
  type: number;
  versionCode: string;
  versionName: string;
  description: string;
}

/**
 * @todo 软件信息
 */
export interface ISoftInfo {
  id: number;
  appName: string;
  appPath: string;
  appSize: number;
  code: string;
  fileMd5: string;
  firmId: number;
  remark: string;
  iconPath: string;
  terminalTypes: string;
  type: number;
  versionCode: string;
  versionName: string;
  description: string;
}

/**
 * @todo 软件版本信息
 */
export interface ISoftVersionInfo {
  appId: number;  // 软件信息id
  appPath: string;  // 软件路径
  appSize: number;  // 软件大小
  createBy: string; // 创建人
  createTime: string; // 创建时间
  deptCode: string; // 机构号
  deptId: number; // 机构ID
  deptName: string; // 机构名称
  fileMd5: string;  // 文件md5
  firmId: number; // 厂商id
  iconPath: string; // 图标文件
  id: number; // 主键id
  remark: string; // 版本更新说明
  terminalTypes: string;  // 终端型号
  updateBy: string; // 更新人
  updateTime: string;
  userId: number;
  versionCode: string;
  versionName: string;
}