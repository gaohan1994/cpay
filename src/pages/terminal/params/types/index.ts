import { ITerminalParams } from '../detail/types';

export interface FetchField {
  deptId: string;
  deptName: string;
  groupId: string;
  groupName: string;
  id: string;
  paramContent: string;
  paramVersion: string;
  remark: string;
}

export interface TerminalParamItem {
  id: number;
  deptId: number;
  groupId: number;
  paramContent: ITerminalParams;
  paramVersion: string;
  createBy: string;
  updateBy: string;
  createTime: string;
  updateTime: string;
  deptName: string;
}

/**
 * 详情页面的三种状态
 */
export enum DetailType {
  ADD = 'ADD',
  EDIT = 'EDIT',
  COPY = 'COPY',
}
