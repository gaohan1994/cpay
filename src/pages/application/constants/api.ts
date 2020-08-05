import { jsonToQueryString } from '@/common/request-util';
import ApiRequest from '@/common/request-util';
import { IAppInfoListField, IAppType } from '../types';
import { RESPONSE_CODE } from '@/common/config';

/**
 * @todo 请求应用列表
 * @param params
 */
export const appInfoList = (params: IAppInfoListField) =>
  ApiRequest.get(`/cpay-admin/app/info/list${jsonToQueryString(params)}`);

/**
 * @todo 请求应用审核列表
 * @param params
 */
export const appAuditList = (params: IAppInfoListField) =>
  ApiRequest.get(`/cpay-admin/app/audit/list${jsonToQueryString(params)}`);

export const appInfoAdd = (params: any) =>
  ApiRequest.post(`/cpay-admin/app/info/add`, params);

export const getAppTypeList = async (
  callback?: (params: IAppType[]) => void
): Promise<any> => {
  const result = await ApiRequest.get(
    `/cpay-admin/app/type/list`
  );
  callback && result.code === RESPONSE_CODE.success && callback(result.data.rows);
  return result;
};