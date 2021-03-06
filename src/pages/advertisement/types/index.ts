import { IListField } from '@/common/type';
import { DictItem } from '@/pages/common/type';

export interface IAvertisementListField extends IListField {
  deptId?: number; // 机构号
  adName?: string; // 广告名称
  type?: number; // 广告类型
  adFileType?: number; // 广告文件类型
}

export interface AdvertisementDetail {
  adName: string;
  adPath: string;
  createTime: string;
  deptName: string;
  description: string;
  endTime: string;
  picPath: string;
  reviewMsg: string;
  reviewTime: string;
  reviewUser: string;
  startTime: string;
  terminalTypes: string;
  updateTime: string;
  adFileType: number;
  advertCopsSign: number;
  deptId: number;
  deviceType: number;
  firmId: number;
  groupId: number;
  id: number;
  isDisabled: number;
  status: number;
  type: number;
  groupName: string;
  firmName: string;
}

export declare module IAdvertReducerInterface {
  // common reducer 的类型定义
  interface IReducerState {}

  // connect common的类型定义
  interface IConnectReducerState {}
}

export const advertisementType = [
  {
    title: '应用商店广告',
    value: '1',
  },
  {
    title: '桌面广告',
    value: '2',
  },
  {
    title: '应用商店广告',
    value: '3',
  },
  {
    title: '应用启动广告',
    value: '4',
  },
  {
    title: '营销活动广告',
    value: '5',
  },
];

export const advertisementFileType = [
  {
    title: '图片广告',
    value: '0',
  },
  {
    title: 'h5广告',
    value: '1',
  },
];
