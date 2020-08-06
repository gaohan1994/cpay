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
 * @todo 请求回收站列表
 * @param params
 */
export const appInfoDeleteList = (params: IAppInfoListField) =>
  ApiRequest.get(`/cpay-admin/app/info/deleteList${jsonToQueryString(params)}`);

/**
 * @todo 请求应用审核列表
 * @param params
 */
export const appAuditList = (params: IAppInfoListField) =>
  ApiRequest.get(`/cpay-admin/app/audit/list${jsonToQueryString(params)}`);

/**
 * @todo 请求应用列表
 * @param params
 */
export const appPublishList = (params: IAppInfoListField) =>
  ApiRequest.get(`/cpay-admin/app/publish/publishList${jsonToQueryString(params)}`);

/**
 * @todo 增加应用信息
 * @param params 
 */
export const appInfoAdd = (params: any) =>
  ApiRequest.post(`/cpay-admin/app/info/add`, params);

/**
 * @todo 获取应用类别
 * @param callback 
 */
export const getAppTypeList = async (
  callback?: (params: IAppType[]) => void
): Promise<any> => {
  const result = await ApiRequest.get(
    `/cpay-admin/app/type/list`
  );
  callback && result.code === RESPONSE_CODE.success && callback(result.data.rows);
  return result;
};

/**
 * @todo 应用删除放入回收站
 * @param params 
 */
export const appInfoRemove = (params: any) =>
  ApiRequest.post(`/cpay-admin/app/info/remove`, params);

/**
* @todo 应用从回收站还原
* @param params 
*/
export const appInfoRecove = (params: any) =>
  ApiRequest.post(`/cpay-admin/app/info/recove`, params);

/**
 * @todo 应用从回收站删除
 * @param params 
 */
export const appInfoDelete = (params: any) =>
  ApiRequest.post(`/cpay-admin/app/info/delete`, params);

/**
 * @todo 应用提交审核
 * @param params 
 */
export const appAuditSubmit = (params: any) =>
  ApiRequest.post(`/cpay-admin/app/audit/submit`, params);

/**
 * @todo 应用发布
 * @param params 
 */
export const appPublish = (params: any) =>
  ApiRequest.post(`/cpay-admin/app/publish/publish`, params);

/**
 * @todo 应用上下架
 * @param params 
 */
export const appShelve = (params: any) =>
  ApiRequest.post(`/cpay-admin/app/publish/submit`, params);