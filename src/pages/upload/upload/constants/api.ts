import { jsonToQueryString } from '@/common/request-util';
import ApiRequest from '@/common/request-util';
import { RESPONSE_CODE } from '@/common/config';

/**
 * @todo 请求软件更新任务基本信息列表
 * @param params
 */
export const taskDownloadJobList = (params: any) =>
  ApiRequest.get(`/cpay-admin/task/downloadJob/list${jsonToQueryString(params)}`);

/**
 * @todo 请求软件更新任务基本信息详情
 * @param id 
 * @param callback 
 */
export const taskDownloadJobDetail = async (
  id: number,
  callback?: (params: any) => void
): Promise<any> => {
  const result = await ApiRequest.get(`/cpay-admin/task/downloadJob/detail/${id}`);
  callback && callback(result);
  return result;
};

/**
* @todo 新增软件更新任务信息
* @param params
*/
export const taskDownloadJobAdd = (params: any) =>
  ApiRequest.post(`/cpay-admin/task/downloadJob/add`, params);

/**
 * @todo 删除软件更新任务基本信息
 * @param params
 */
export const taskDownloadJobRemove = (params: { ids: string }) =>
  ApiRequest.post(`/cpay-admin/task/downloadJob/remove`, params);

/**
 * @todo 根据软件类型获取软件名称
 * @param params 
 * @param callback 
 */
export const taskSoftListByType = async (
  params: any,
  callback?: (data: any[]) => void
): Promise<any> => {
  const result = await ApiRequest.get(
    `/cpay-admin/task/soft/listByType${jsonToQueryString(params)}`
  );
  callback &&
    result.code === RESPONSE_CODE.success &&
    callback(result.data);
  return result;
};