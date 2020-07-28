/**
 * 列表请求接口field的范型
 */
export type IListField = {
  page: number;
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

/**
 * 使用useantdtable的格式化数据格式
 */
export interface IFormatResult<T> {
  list: T[];
  total: number;
}
