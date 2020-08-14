import { jsonToQueryString } from '@/common/request-util';
import ApiRequest from '@/common/request-util';
import { RESPONSE_CODE } from '@/common/config';
import { ISoftAddField } from '../types';


/**
 * @todo 请求软件信息列表
 * @param params
 */
export const taskSoftList = (params: any) =>
  ApiRequest.get(`/cpay-admin/task/soft/list${jsonToQueryString(params)}`);

/**
* @todo 请求软件信息详情
* @param params
*/
export const taskSoftDetail = async (
  id: number,
  callback?: (params: any) => void
): Promise<any> => {
  const result = await ApiRequest.get(`/cpay-admin/task/soft/details/${id}`);
  callback && callback(result);
  return result;
};

/**
 * @todo 增加软件信息
 * @param params 
 */
export const softInfoAdd = (params: ISoftAddField) =>
  ApiRequest.post(`/cpay-admin/task/soft/add`, params);

/**
 * @todo 修改软件信息
 * @param params 
 */
export const softInfoEdit = (params: ISoftAddField) =>
  ApiRequest.post(`/cpay-admin/task/soft/edit`, params);

/**
* @todo 修改软件信息
* @param params 
*/
export const softInfoRemove = (params: { ids: string }) =>
  ApiRequest.post(`/cpay-admin/task/soft/remove`, params);

/**
 * @todo 请求软件版本列表
 * @param params
 */
export const taskSoftVersionList = (params: any) =>
  ApiRequest.get(`/cpay-admin/task/softVersion/list${jsonToQueryString(params)}`);

/**
* @todo 修改软件版本信息
* @param params 
*/
export const softVersionEdit = (params: any) =>
  ApiRequest.post(`/cpay-admin/task/softVersion/edits/${params.id}`, params);

/**
* @todo 删除软件版本信息
* @param params 
*/
export const softVersionRemove = (params: { ids: string }) =>
  ApiRequest.post(`/cpay-admin/task/softVersion/remove`, params);

/**
 * @todo 请求软件更新任务基本信息列表
 * @param params
 */
export const taskDownloadJobList = (params: any) =>
  ApiRequest.get(`/cpay-admin/task/downloadJob/list${jsonToQueryString(params)}`);

/**
 * @todo 删除软件更新任务基本信息列表
 * @param params
 */
export const taskDownloadJobRemove = (params: { ids: string }) =>
  ApiRequest.post(`/cpay-admin/task/downloadJob/remove`, params);

/**
 * @todo 查询终端上传任务列表(日志提取)
 * @param params 
 */
export const taskUploadJobList = (params: any) =>
  ApiRequest.get(`/cpay-admin/task/uploadJob/list${jsonToQueryString(params)}`);

/**
* @todo 添加终端上传任务(日志提取新增)
* @param params 
*/
export const taskUploadJobAdd = (params: any) =>
  ApiRequest.post(`/cpay-admin/task/uploadJob/add`, params);