import ApiRequest, { jsonToQueryString } from '@/common/request-util';
import { merge } from 'lodash';
import { FetchField } from '../types';
import { IResponseListResult } from '@/common/type';

/**
 * 查询终端应用信息列表
 * @param params
 * @param callback
 */
export const terminalAppList = async (
  params: FetchField.ITerminalAppList,
  callback?: (data: any) => void
) => {
  const result = await ApiRequest.get(
    `/cpay-admin/terminal/app/list${jsonToQueryString(params)}`
  );
  callback && result && callback(result);
  return result;
};

/**
 * 导出终端应用信息列表
 * @param params
 * @param callback
 */
export const terminalAppExport = async (
  params: FetchField.ITerminalAppList,
  callback?: (data: any) => void
) => {
  const result = await ApiRequest.post(
    `/cpay-admin/terminal/app/export`,
    params
  );
  callback && result && callback(result);
  return result;
};
