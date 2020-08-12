/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-08-12 09:38:09 
 * @Last Modified by:   centerm.gaozhiying 
 * @Last Modified time: 2020-08-12 09:38:09 
 * 
 * @todo 应用模块的类型文件
 */
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
  iconPath: string; // 图标路径（有前缀）
  id: number; // 应用类型id
  typeCode: string; // 类型编号
  typeName: string; // 应用名称
  updateBy: string; // 更新人
  updateTime: string; // 更新时间
  userId: number;
}

export interface IAppTypeAddField {
	id: number;	// 应用类型id
	typeCode: string;	// 类型编号
	typeName: string;	// 类型名称
	iconPath: string;	// 应用图标地址（无前缀）
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

export interface IAppInfoDetail {
  apkCode: string;  // 应用编号
	apkCopsId: number; // 开放平台所属应用id标识
	apkCopsSign: number;  // 应用所属平台 0:运维平台，1:开放平台
	apkCopsUserid: string;  // 所属开发者id标识
	apkDescription: string; // 应用描述
	apkName: string;  // 应用名称
	apkPath: string;  // apk文件存储路径
	appSize: number; // 应用大小
	createBy: string; // 创建者
	createTime: string; // 创建时间
	deptId: number; // 机构ID
  deptName: string; // 机构名
	downloadNum: number;  // 应用下载量
	firmId: number; // 终端厂商id
	firmName: string; // 终端组别id
	groupId: number;  // 终端组别id
	groupName: string;  // 终端组别名称
	iconPath: string; // icon文件存储路径
	id: number; // 主键id
	isDeleted: number;  // 是否删除
	isUninstall: number;  // 是否可卸载
	isUniversal: number;  // 是否通用
	keyWord: string;  // 关键字
	labelId: number; // 应用标签id
	labelName: string;  // 应用标签名称
	labels: string; // 应用标签
	permissions: string;  // 权限列表
	picPaths: string; // 应用图片地址
	picViewPaths: string; // 图片原始地址
	publishTime: string;  // 应用发布时间
	reDegree: number; // 推荐度
	remark: string; // 备注
	reviewMsg: string;  // 审核信息
	reviewTime: string; // 审核时间
	reviewUser: string; // 审核人
	signMd5: string;  // 签名md5
	signType: number;
	status: number; // 状态
	statusList: number;
	termTypeId: string; // 查询终端类型id
	terminalTypes: string;  // 终端类型名称
	typeId: number; // 应用类型id
	typeName: string; // 应用类型名称
	updateBy: string; // 更新者
	updateTime: string; // 更新时间
	versionCode: number;  // 应用版本号
	versionDescription: string; // 版本描述
	versionName: string;  // 外部版本号
}