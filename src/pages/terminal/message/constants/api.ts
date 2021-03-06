import {
  formartQuery,
  jsonToQueryString,
  jsonToForm,
} from '@/common/request-util';
import ApiRequest from '@/common/request-util';
import { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { ITerminalListField, ITerminalGroupByDeptId } from '../types';
import { RESPONSE_CODE } from '@/common/config';
import { result } from 'lodash';

export const getTableData = (
  { current, pageSize }: any,
  formData: Object
): Promise<any> => {
  let query = `page=${current}&size=${pageSize}`;
  Object.entries(formData).forEach(([key, value]) => {
    if (value) {
      query += `&${key}=${value}`;
    }
  });

  return fetch(`https://randomuser.me/api?results=55&${query}`)
    .then((res) => res.json())
    .then((res) => ({
      total: res.info.results,
      list: res.results,
    }));
};

export const merchantQueryBocoms = (
  params: any,
  formData: any
): Promise<any> => {
  formartQuery(params);
  return ApiRequest.get(`/merchant/query.bocoms${jsonToQueryString(params)}`);
};

export const terminalInfoList = (tableProps: ITerminalListField) =>
  ApiRequest.post(
    `/cpay-admin/terminal/info/terminalInfoList`,
    tableProps
  );

/**
 * 查询机构本级及上级组别列表
 * @param deptId
 */
export const terminalGroupListByDept = async (
  deptId: number,
  callback?: (params: ITerminalGroupByDeptId[]) => void
): Promise<any> => {
  const result = await ApiRequest.post(
    `/cpay-admin/terminal/group/groupListByDepts`,
    { deptId }
  );
  callback && result && result.code === RESPONSE_CODE.success && callback(result.data);
  return result;
};

/**
 * 导出终端信息列表
 * @param params
 */
export const terminalInfoExport = async (params?: any) => {
  const result = await ApiRequest.post(`/cpay-admin/terminal/info/terminalInfoExport`, params);
  return result;
};

/**
 * @todo 导入终端信息
 * @param params
 */
export const terminalInfoImport = async (params?: any) => {
  const result = await ApiRequest.postFormData(`/cpay-admin/terminal/info/terminalInfoImportData`, params);
  return result;
};

/**
 * @todo 导入终端模板
 * @param params
 */
export const terminalInfoImportTemplate = async (params?: any) => {
  const result = await ApiRequest.post(`/cpay-admin/terminal/info/terminalInfoImportTemplate`, params);
  return result
}