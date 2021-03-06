import ApiRequest, { jsonToQueryString } from '@/common/request-util';
import { FetchField, TerminalGroupItem } from '../types';
import { RESPONSE_CODE } from '@/common/config';

/**
 * 查询终端参数信息列表
 * @param params
 * @param callback
 */
export const terminalGroupList = async (
  params?: FetchField,
  callback?: (data: TerminalGroupItem[]) => void
): Promise<any> => {
  const result = await ApiRequest.post(
    `/cpay-admin/terminal/group/groupList`,
    params
  );
  callback && result &&
    result.code === RESPONSE_CODE.success &&
    callback(result.data.rows);
  return result;
};

/**
 * 查询终端参数信息列表
 * @param params
 * @param callback
 */
export const terminalGroupAdd = async (
  params?: FetchField,
  callback?: (data: TerminalGroupItem[]) => void
): Promise<any> => {
  const result = await ApiRequest.post(
    `/cpay-admin/terminal/group/groupAdd`,
    params
  );
  callback && result.code === RESPONSE_CODE.success && callback(result);
  return result;
};

/**
 * 查询终端参数信息列表
 * @param params
 * @param callback
 */
export const terminalGroupDelete = async (
  params?: FetchField,
  callback?: (data: TerminalGroupItem[]) => void
): Promise<any> => {
  const result = await ApiRequest.post(
    `/cpay-admin/terminal/group/groupRemove`,
    params
  );
  callback && result.code === RESPONSE_CODE.success && callback(result);
  return result;
};

/**
 * 查询终端参数信息列表
 * @param params
 * @param callback
 */
export const terminalGroupEdit = async (
  params?: FetchField,
  callback?: (data: TerminalGroupItem[]) => void
): Promise<any> => {
  const result = await ApiRequest.post(
    `/cpay-admin/terminal/group/groupEdit`,
    params
  );
  callback && result.code === RESPONSE_CODE.success && callback(result);
  return result;
};
