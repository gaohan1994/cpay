import ApiRequest, { jsonToQueryString } from '@/common/request-util';
import { FetchField } from '../types';
import { RESPONSE_CODE } from '@/common/config';

/**
 * 查询终端参数信息列表
 * @param params
 * @param callback
 */
export const terminalAcquiringList = async (
  params?: FetchField.List
): Promise<any> => {
  const result = await ApiRequest.get(
    `/cpay-admin/terminal/acquiring/list${jsonToQueryString(params)}`
  );
  return result;
};

/**
 * @param params
 * @param callback
 */
export const terminalAcquiringRemove = async (params?: {
  ids: string;
}): Promise<any> => {
  const result = await ApiRequest.post(
    `/cpay-admin/terminal/acquiring/remove`,
    params
  );
  return result;
};

/**
 * @param params
 * @param callback
 */
export const terminalAcquiringExport = async (
  params?: FetchField.Export
): Promise<any> => {
  const result = await ApiRequest.post(
    `/cpay-admin/terminal/acquiring/export`,
    params
  );
  return result;
};

/**
 * @param params
 * @param callback
 */
export const terminalAcquiringEditData = async (params: {
  id: string;
}): Promise<any> => {
  const result = await ApiRequest.get(
    `/cpay-admin/terminal/acquiring/edit/${params.id}`
  );
  return result;
};

/**
 * @param params
 * @param callback
 */
export const terminalAcquiringEdit = async (
  params?: FetchField.Export
): Promise<any> => {
  const result = await ApiRequest.post(
    `/cpay-admin/terminal/acquiring/edit`,
    params
  );
  return result;
};

/**
 * @param params
 * @param callback
 */
export const terminalAcquiringAdd = async (
  params?: FetchField.Export
): Promise<any> => {
  const result = await ApiRequest.post(
    `/cpay-admin/terminal/acquiring/add`,
    params
  );
  return result;
};
