import { IListField } from '@/common/type';
export interface ITerminalListField extends IListField {
  // 终端序列号
  tusn: string;
}

export interface ITerminalGroupByDeptId {
  id: number;
  deptId: number;
  name: string;
  remark: string;
  createTime: string;
}
