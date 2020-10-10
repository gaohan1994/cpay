import ApiRequest, { jsonToQueryString } from '@/common/request-util';
import { RESPONSE_CODE } from '@/common/config';

/**
 * @param params
 * @param callback
 */
export const terminalTypeList = async (
  params: any,
  callback?: (data: any) => void
): Promise<any> => {
  const result = await ApiRequest.post(`/cpay-admin/terminal/type/terminalTypeList`, params);
  callback && result &&
    result.code === RESPONSE_CODE.success &&
    callback(result.data.rows);
  return result;
};

/**
 * @param params
 * @param callback
 */
export const terminalTypeAdd = async (
  params: any,
  callback?: (data: any) => void
): Promise<any> => {
  const result = await ApiRequest.post(`/cpay-admin/terminal/type/terminalTypeAdd`, params);
  callback && callback(result);
  return result;
};

/**
 * @param params
 * @param callback
 */
export const terminalTypeEdit = async (
  params: any,
  callback?: (data: any) => void
): Promise<any> => {
  const result = await ApiRequest.post(
    `/cpay-admin/terminal/type/terminalTypeEdit`,
    params
  );
  callback && callback(result);
  return result;
};

/**
 * @param params
 * @param callback
 */
export const terminalTypeRemove = async (
  params: any,
  callback?: (data: any) => void
): Promise<any> => {
  const result = await ApiRequest.post(
    `/cpay-admin/terminal/type/terminalTypeRemove`,
    params
  );
  callback && callback(result);
  return result;
};

/**
 * @param params
 * @param callback
 */
export const terminalTypeDetail = async (
  params: any,
  callback?: (data: any) => void
): Promise<any> => {
  const result = await ApiRequest.post(
    `/cpay-admin/terminal/type/terminalTypeDetail`,
    { id: params.id }
  );
  callback && callback(result);
  return result;
};
