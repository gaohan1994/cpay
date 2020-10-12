import { jsonToQueryString } from '@/common/request-util';
import ApiRequest from '@/common/request-util';
import { RESPONSE_CODE } from '@/common/config';

/**
 * @todo 请求软件更新任务基本信息列表
 * @param params
 */
export const taskDownloadJobList = (params: any) =>
  ApiRequest.post(`/cpay-admin/task/downloadJob/downloadJobList`, params);

/**
 * @todo 请求软件更新任务基本信息详情
 * @param id 
 * @param callback 
 */
export const taskDownloadJobDetail = async (
  id: number,
  callback?: (params: any) => void
): Promise<any> => {
  const result = await ApiRequest.post(`/cpay-admin/task/downloadJob/downloadJobDetail`, { id });
  callback && callback(result);
  return result;
};

/**
* @todo 新增软件更新任务信息
* @param params
*/
export const taskDownloadJobAdd = (params: any) =>
  ApiRequest.post(`/cpay-admin/task/downloadJob/downloadJobAdd`, params);

/**
* @todo 修改软件更新任务信息
* @param params
*/
export const taskDownloadJobEdit = (params: any) =>
  ApiRequest.post(`/cpay-admin/task/downloadJob/downloadJobEdit`, params);

/**
 * @todo 删除软件更新任务基本信息
 * @param params
 */
export const taskDownloadJobRemove = (params: { ids: string }) =>
  ApiRequest.post(`/cpay-admin/task/downloadJob/downloadJobRemove`, params);

/**
 * 
 * @param id 发布软件更新的任务
 */
export const taskDownloadJobPublish = (id: number) =>
  ApiRequest.post(`/cpay-admin/task/downloadJob/downloadJobPublish`, { id });

/**
* 
* @param id 暂停软件更新的任务
*/
export const taskDownloadJobPause = (id: number) =>
  ApiRequest.post(`/cpay-admin/task/downloadJob/downloadJobPause`, { id });

/**
* @todo 软件更新执行情况任务启动
* @param params
*/
export const taskDownloadJobDelay = (params: { ids: string }) =>
  ApiRequest.post(`/cpay-admin/task/downloadJob/delay`, params);

/**
* @todo 软件更新执行情况任务启动
* @param params
*/
export const taskDownloadJobImportTemplate = () =>
  ApiRequest.post(`/cpay-admin/task/downloadJob/downloadJobImportTemplate`, {});

/**
* @todo 软件更新执行情况任务启动
* @param params
*/
export const taskDownloadTaskReset = (params: { ids: string }) =>
  ApiRequest.post(`/cpay-admin/task/downloadTask/downloadTaskReset`, params);

/**
 * @todo 删除软件更新任务基本信息
 * @param params
 */
export const taskDownloadTaskPause = (params: { ids: string }) =>
  ApiRequest.post(`/cpay-admin/task/downloadTask/pause`, params);

/**
 * @todo 根据软件类型获取软件名称
 * @param params 
 * @param callback 
 */
export const taskSoftListByType = async (
  params: any,
  callback?: (data: any[]) => void
): Promise<any> => {
  const result = await ApiRequest.post(
    `/cpay-admin/task/soft/getSoftListByType`,
    params
  );
  callback && result &&
    result.code === RESPONSE_CODE.success &&
    callback(result.data);
  return result;
};

/**
 * @todo 请求软件更新任务执行情况列表
 * @param params
 */
export const taskDownloadTaskList = (params: any) =>
  ApiRequest.get(`/cpay-admin/task/downloadTask/downloadTaskList`, params);

/**
* @todo 请求软件更新任务执行情况列表
* @param params
*/
export const taskDownloadTaskExport = (params: any) =>
  ApiRequest.post(`/cpay-admin/task/downloadTask/downloadTaskExport`, params);