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
  ApiRequest.post(`/cpay-admin/task/softVersion/edit`, params);

/**
 * @todo 根据终端型号查询软件版本
 * @param params 
 */
export const taskSoftVersionListByType = async (
  parma: any,
  callback?: (params: any[]) => void
): Promise<any> => {
  const result = await ApiRequest.get(
    `/cpay-admin/task/softVersion/listByType${jsonToQueryString(parma)}`
  );
  callback && result.code === RESPONSE_CODE.success && callback(result.data);
  return result;
};

/**
* @todo 删除软件版本信息
* @param params 
*/
export const softVersionRemove = (params: { ids: string }) =>
  ApiRequest.post(`/cpay-admin/task/softVersion/remove`, params);

/**
 * @todo 查询终端上传任务列表(日志提取)
 * @param params 
 */
export const taskUploadJobList = (params: any) =>
  ApiRequest.get(`/cpay-admin/task/uploadJob/list${jsonToQueryString(params)}`);

/**
* @todo 查询终端上传任务详情(日志提取详情)
* @param id 
*/
export const taskUploadJobDetail = async (
  id: number,
  callback?: (params: any) => void
): Promise<any> => {
  const result = await ApiRequest.get(`/cpay-admin/task/uploadJob/detail/${id}`);
  callback && callback(result);
  return result;
};

/**
* @todo 添加终端上传任务(日志提取新增)
* @param params 
*/
export const taskUploadJobAdd = (params: any) =>
  ApiRequest.post(`/cpay-admin/task/uploadJob/add`, params);

/**
* @todo 修改终端上传任务(日志提取修改)
* @param params 
*/
export const taskUploadJobEdit = (params: any) =>
  ApiRequest.post(`/cpay-admin/task/uploadJob/edit`, params);

/**
* @todo 删除终端上传任务删除（日志提取删除）
* @param params
*/
export const taskUploadJobRemove = (params: { ids: string }) =>
  ApiRequest.post(`/cpay-admin/task/uploadJob/remove`, params);

/**
* @todo 删除终端上传任务发布（日志提取执行任务）
* @param params
*/
export const taskUploadJobPublish = (id: number) =>
  ApiRequest.post(`/cpay-admin/task/uploadJob/publish/${id}`, {});

/**
 * @todo 导入终端信息
 */
export const taskUploadJobImportData = (param: any) =>
  ApiRequest.postFormData(`/cpay-admin/task/uploadJob/importData`, param);

/**
 * @todo 查询终端上传任务列表(日志提取)
 * @param params 
 */
export const taskUploadTaskList = (params: any) =>
  ApiRequest.get(`/cpay-admin/task/uploadTask/list${jsonToQueryString(params)}`);

/**
* @todo 重置终端上传任务
* @param params
*/
export const taskUploadTaskReset = (params: { ids: string }) =>
  ApiRequest.post(`/cpay-admin/task/uploadTask/reset`, params);

/**
* @todo 取消终端上传任务
* @param params
*/
export const taskUploadTaskCancel = (params: { ids: string }) =>
  ApiRequest.post(`/cpay-admin/task/uploadTask/cancel`, params);

/**
* @todo 查询终端操作任务列表(远程运维)
* @param params 
*/
export const taskOperationJobList = (params: any) =>
  ApiRequest.get(`/cpay-admin/task/operationJob/list${jsonToQueryString(params)}`);

/**
* @todo 查询终端操作任务详情(远程运维详情)
* @param id 
*/
export const taskOperationJobDetail = async (
  id: number,
  callback?: (params: any) => void
): Promise<any> => {
  const result = await ApiRequest.get(`/cpay-admin/task/operationJob/detail/${id}`);
  callback && callback(result);
  return result;
};

/**
 * @todo 添加终端操作任务(远程运维新增)
 * @param params 
 */
export const taskOperationJobAdd = (params: any) =>
  ApiRequest.post(`/cpay-admin/task/operationJob/add`, params);

/**
* @todo 修改终端操作任务(远程运维修改)
* @param params 
*/
export const taskOperationJobEdit = (params: any) =>
  ApiRequest.post(`/cpay-admin/task/operationJob/edit`, params);

/**
* @todo 删除终端操作任务
* @param params
*/
export const taskOperationJobRemove = (params: { ids: string }) =>
  ApiRequest.post(`/cpay-admin/task/operationJob/remove`, params);

/**
* @todo 启动终端操作任务(远程运维启动)
* @param id 
*/
export const taskOperationJobPublish = (id: number) =>
  ApiRequest.post(`/cpay-admin/task/operationJob/publish/${id}`, {});

/**
 * @todo 暂停终端操作任务(远程运维暂停)
 * @param id 
 */
export const taskOperationJobPuase = (id: number) =>
  ApiRequest.post(`/cpay-admin/task/operationJob/pause/${id}`, {});

/**
* @todo 查询终端操作任务列表(远程运维执行情况)
* @param params 
*/
export const taskOperationTaskList = (params: any) =>
  ApiRequest.get(`/cpay-admin/task/operationTask/list${jsonToQueryString(params)}`);

/**
* @todo 终端操作任务列表导出(远程运维执行情况导出)
* @param params 
*/
export const taskOperationTaskExport = (params: any) =>
  ApiRequest.post(`/cpay-admin/task/operationTask/export`, params);

/**
 * @todo 终端操作任务重置(远程运维执行情况启动任务)
 * @param params 
 */
export const taskOperationTaskReset = (params: any) =>
  ApiRequest.post(`/cpay-admin/task/operationTask/reset`, params);

/**
* @todo 终端操作任务暂停(远程运维执行情况暂停任务)
* @param params 
*/
export const taskOperationTaskPause = (params: any) =>
  ApiRequest.post(`/cpay-admin/task/operationTask/pause`, params);

/**
* @todo 查询任务执行限制情况列表
* @param params
*/
export const taskCountList = (params: any) =>
  ApiRequest.get(`/cpay-admin/task/count/list${jsonToQueryString(params)}`);

/**
* @todo 删除任务执行限制情况
* @param params
*/
export const taskCountRemove = (params: { ids: string }) =>
  ApiRequest.post(`/cpay-admin/task/count/remove`, params);

/**
* @todo 查询任务执行限制情况列表
* @param params
*/
export const taskLogSetList = (params: any) =>
  ApiRequest.get(`/cpay-admin/task/logSet/list${jsonToQueryString(params)}`);