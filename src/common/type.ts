/**
 * 列表请求接口field的范型
 */
export type IListField = {
  pageNum: number;
  pageSize: number;
};

/**
 * 接口返回数据的范型
 */
export interface IResponseResult<T> {
  code: string;
  data: T;
  msg: string;
  serverTime?: string;
}

export interface IResponseListResult<T> {
  code: string;
  data: {
    rows: Array<T>;
    total: number;
  };
  msg: string;
}

/**
 * 使用useantdtable的格式化数据格式
 */
export interface IFormatResult<T> {
  list: T[];
  total: number;
}

export type UserDept = {
  deptId: number;     // 所属机构id
  deptName: string;   // 所属机构名称
  leader: string;
  phone: string;
  email: string;
}