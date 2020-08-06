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
  paramContent: string;
  paramVersion: string;
  createBy: string;
  updateBy: string;
  createTime: string;
  updateTime: string;
  deptName: string;
}
