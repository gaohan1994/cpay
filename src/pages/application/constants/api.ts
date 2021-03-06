/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-08-12 09:09:15 
 * @Last Modified by:   centerm.gaozhiying 
 * @Last Modified time: 2020-08-12 09:09:15
 * 
 * @todo 应用模块所使用的接口 
 */
import { jsonToQueryString } from '@/common/request-util';
import ApiRequest from '@/common/request-util';
import { IAppInfoListField, IAppType, IAppTypeAddField } from '../types';
import { RESPONSE_CODE } from '@/common/config';

/**
 * @todo 请求应用列表
 * @param params
 */
export const appInfoList = (params: IAppInfoListField) =>
  ApiRequest.post(`/cpay-admin/app/info/appInfoList`, params);

/**
 * @todo 请求应用详情
 * @param params
 */
export const appInfoDetail = async (
  id: number,
  callback?: (params: any) => void,
  params?: object,
): Promise<any> => {
  const result = await ApiRequest.post(`/cpay-admin/app/info/appInfoDetail`, { id, ...params });
  callback && callback(result);
  return result;
};

/**
 * @todo 请求回收站列表
 * @param params
 */
export const appInfoDeleteList = (params: IAppInfoListField) =>
  ApiRequest.post(`/cpay-admin/app/info/appInfoDeleteList`, params);

/**
 * @todo 请求应用审核列表
 * @param params
 */
export const appAuditList = (params: IAppInfoListField) =>
  ApiRequest.post(`/cpay-admin/app/audit/appAuditList`, params);

/**
* @todo 应用审核操作
* @param params
*/
export const appAuditApk = (params: any) =>
  ApiRequest.post(`/cpay-admin/app/audit/appAuditApk`, params);

/**
 * @todo 增加应用信息
 * @param params 
 */
export const appInfoAdd = (params: any) =>
  ApiRequest.post(`/cpay-admin/app/info/appInfoAdd`, params);

/**
* @todo 修改应用信息
* @param params 
*/
export const appInfoEdit = (params: any) =>
  ApiRequest.post(`/cpay-admin/app/info/appInfoEdit`, params);

/**
 * @todo 应用删除放入回收站
 * @param params 
 */
export const appInfoRemove = (params: any) =>
  ApiRequest.post(`/cpay-admin/app/info/appInfoRemove`, params);

/**
* @todo 应用从回收站还原
* @param params 
*/
export const appInfoRecove = (params: any) =>
  ApiRequest.post(`/cpay-admin/app/info/appInfoRecover`, params);

/**
 * @todo 应用从回收站删除
 * @param params 
 */
export const appInfoDelete = (params: any) =>
  ApiRequest.post(`/cpay-admin/app/info/appInfoDelete`, params);

/**
 * @todo 应用提交审核
 * @param params 
 */
export const appAuditSubmit = (params: any) =>
  ApiRequest.post(`/cpay-admin/app/audit/appSubmitAudit`, params);

/**
* @todo 请求发布应用列表
* @param params
*/
export const appPublishList = (params: IAppInfoListField) =>
  ApiRequest.post(`/cpay-admin/app/publish/appPublishList`, params);

/**
 * @todo 应用下架
 * @param params 
 */
export const appShelve = (params: any) =>
  ApiRequest.post(`/cpay-admin/app/publish/appPublishSubmit`, params);

/**
 * @todo 获取应用类别
 * @param callback 
 */
export const getAppTypeList = async (
  params: any,
  callback?: (params: IAppType[]) => void
): Promise<any> => {
  const result = await ApiRequest.post(`/cpay-admin/app/type/appTypeList`, params);
  callback && result && result.code === RESPONSE_CODE.success && callback(result.data.rows);
  return result;
};

/**
* @todo 新增应用类型
* @param params 
*/
export const appTypeAdd = (params: IAppTypeAddField) =>
  ApiRequest.post(`/cpay-admin/app/type/appTypeAdd`, params);

/**
* @todo 修改应用类型
* @param params 
*/
export const appTypeEdit = (params: IAppTypeAddField) =>
  ApiRequest.post(`/cpay-admin/app/type/appTypeEdit`, params);

/**
* @todo 删除应用类型
* @param params 
*/
export const appTypeRemove = (params: { ids: string }) =>
  ApiRequest.post(`/cpay-admin/app/type/appTypeRemove`, params);