/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-08-12 14:49:27 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-08-20 16:13:18
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

/** 终端上传任务详情 */
export interface TaskUploadJobDetail {
  appCode: string;  // 应用编号
  createBy: string;  // 创建人
  createTime: string; // 创建时间
  deptCode: string; // 机构号
  deptId: number; // 机构ID
  deptName: string; // 机构名称
  firmId: number; // 厂商id
  firmName: string; // 厂商名称
  id: number; // 主键id
  jobName: string;  // 任务名称
  logBeginTime: string; // 日志开始时间
  logEndTime: string; // 日志结束时间
  remark: string; // 备注
  status: number;  // 状态
  terminalType: string; // 终端型号
  tusns: string;  // 终端集合
  type: string; // 类型
  updateBy: string; // 更新人
  updateTime: string; // 更新时间
  userId: number; // 
  validEndTime: string; // 有效截止日期
  validStartTime: string; // 有效起始日期
}

export interface ITaskOperationJobDetail {
  createTime: string;       // 创建时间
  deptId: number;           // 所属机构编码
  deptName: string;         // 所属机构名称
  firmId: number;           // 终端厂商编码
  firmName: string;         // 终端厂商名称
  id: string;               // 主键id
  jobName: string;          // 任务名称
  groupIds: string;         // 组别id集合
  operatorCommand: string;  // 操作指令
  releaseType: number;      // 发布类型
  status: number;           // 发布状态
  updateTime: string;       // 更新时间
  terminalTypeId: number;   // 终端型号id
  typeName: string;         // 终端型号
  isGroupUpdate: number;    // 组别更新方式(0:无 1:指定 2:排除)
  tusns: string;            // 终端集合
}