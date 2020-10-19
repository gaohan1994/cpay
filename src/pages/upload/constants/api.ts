import { jsonToQueryString } from '@/common/request-util';
import ApiRequest from '@/common/request-util';
import { RESPONSE_CODE } from '@/common/config';
import { ISoftAddField } from '../types';


/**
 * @todo 请求软件信息列表
 * @param params
 */
export const taskSoftList = (params: any) =>
  ApiRequest.post(`/cpay-admin/task/soft/softList`, params);

/**
* @todo 请求软件信息详情
* @param params
*/
export const taskSoftDetail = async (
  id: number,
  callback?: (params: any) => void
): Promise<any> => {
  const result = await ApiRequest.post(`/cpay-admin/task/soft/softDetail`, { id });
  callback && callback(result);
  return result;
};

/**
 * @todo 增加软件信息
 * @param params 
 */
export const softInfoAdd = (params: ISoftAddField) =>
  ApiRequest.post(`/cpay-admin/task/soft/softAdd`, params);

/**
 * @todo 修改软件信息
 * @param params 
 */
export const softInfoEdit = (params: ISoftAddField) =>
  ApiRequest.post(`/cpay-admin/task/soft/softEdit`, params);

/**
* @todo 修改软件信息
* @param params 
*/
export const softInfoRemove = (params: { ids: string }) =>
  ApiRequest.post(`/cpay-admin/task/soft/softRemove`, params);

/**
 * @todo 请求软件版本列表
 * @param params
 */
export const taskSoftVersionList = (params: any) =>
  ApiRequest.post(`/cpay-admin/task/softVersion/softVersionList`, params);

/**
* @todo 修改软件版本信息
* @param params 
*/
export const softVersionEdit = (params: any) =>
  ApiRequest.post(`/cpay-admin/task/softVersion/softVersionEdit`, params);

/**
 * @todo 根据终端型号查询软件版本
 * @param params 
 */
export const taskSoftVersionListByType = async (
  parma: any,
  callback?: (params: any[]) => void
): Promise<any> => {
  const result = await ApiRequest.post(
    `/cpay-admin/task/softVersion/softVersionListByType`,
    parma
  );
  callback && result && result.code === RESPONSE_CODE.success && callback(result.data);
  return result;
};

/**
* @todo 删除软件版本信息
* @param params 
*/
export const softVersionRemove = (params: { ids: string }) =>
  ApiRequest.post(`/cpay-admin/task/softVersion/softVersionRemove`, params);

/**
 * @todo 查询终端上传任务列表(日志提取)
 * @param params 
 */
export const taskUploadJobList = (params: any) =>
  ApiRequest.post(`/cpay-admin/task/uploadJob/uploadJobList`, params);

/**
* @todo 查询终端上传任务详情(日志提取详情)
* @param id 
*/
export const taskUploadJobDetail = async (
  id: number,
  callback?: (params: any) => void
): Promise<any> => {
  const result = await ApiRequest.post(`/cpay-admin/task/uploadJob/downloadJobDetail`, { id });
  callback && callback(result);
  return result;
};

/**
* @todo 添加终端上传任务(日志提取新增)
* @param params 
*/
export const taskUploadJobAdd = (params: any) =>
  ApiRequest.post(`/cpay-admin/task/uploadJob/downloadJobAdd`, params);

/**
* @todo 修改终端上传任务(日志提取修改)
* @param params 
*/
export const taskUploadJobEdit = (params: any) =>
  ApiRequest.post(`/cpay-admin/task/uploadJob/downloadJobEdit`, params);

/**
* @todo 删除终端上传任务删除（日志提取删除）
* @param params
*/
export const taskUploadJobRemove = (params: { ids: string }) =>
  ApiRequest.post(`/cpay-admin/task/uploadJob/downloadJobRemove`, params);

/**
* @todo 删除终端上传任务发布（日志提取执行任务）
* @param params
*/
export const taskUploadJobPublish = (id: number) =>
  ApiRequest.post(`/cpay-admin/task/uploadJob/downloadJobPublish`, { id });

/**
 * @todo 导入终端信息
 */
export const taskUploadJobImportData = (param: any) =>
  ApiRequest.postFormData(`/cpay-admin/task/uploadJob/downloadJobImportData`, param);

/**
 * @todo 查询终端上传任务列表(日志提取)
 * @param params 
 */
export const taskUploadTaskList = (params: any) =>
  ApiRequest.post(`/cpay-admin/task/uploadTask/uploadTaskList`, params);

/**
* @todo 重置终端上传任务
* @param params
*/
export const taskUploadTaskReset = (params: { ids: string }) =>
  ApiRequest.post(`/cpay-admin/task/uploadTask/uploadTaskReset`, params);

/**
* @todo 取消终端上传任务
* @param params
*/
export const taskUploadTaskCancel = (params: { ids: string }) =>
  ApiRequest.post(`/cpay-admin/task/uploadTask/uploadTaskCancel`, params);

/**
* @todo 查询终端操作任务列表(远程运维)
* @param params 
*/
export const taskOperationJobList = (params: any) =>
  ApiRequest.post(`/cpay-admin/task/operationJob/operationJobList`, params);

/**
* @todo 查询终端操作任务详情(远程运维详情)
* @param id 
*/
export const taskOperationJobDetail = async (
  id: number,
  callback?: (params: any) => void
): Promise<any> => {
  const result = await ApiRequest.post(`/cpay-admin/task/operationJob/operationJobDetail`, { id });
  callback && callback(result);
  return result;
};

/**
 * @todo 添加终端操作任务(远程运维新增)
 * @param params 
 */
export const taskOperationJobAdd = (params: any) =>
  ApiRequest.post(`/cpay-admin/task/operationJob/operationJobAdd`, params);

/**
* @todo 修改终端操作任务(远程运维修改)
* @param params 
*/
export const taskOperationJobEdit = (params: any) =>
  ApiRequest.post(`/cpay-admin/task/operationJob/operationJobEdit`, params);

/**
* @todo 删除终端操作任务
* @param params
*/
export const taskOperationJobRemove = (params: { ids: string }) =>
  ApiRequest.post(`/cpay-admin/task/operationJob/operationJobRemove`, params);

/**
* @todo 启动终端操作任务(远程运维启动)
* @param id 
*/
export const taskOperationJobPublish = (id: number) =>
  ApiRequest.post(`/cpay-admin/task/operationJob/operationJobPublish`, { id });

/**
 * @todo 暂停终端操作任务(远程运维暂停)
 * @param id 
 */
export const taskOperationJobPuase = (id: number) =>
  ApiRequest.post(`/cpay-admin/task/operationJob/operationJobPause`, { id });

/**
* @todo 查询终端操作任务列表(远程运维执行情况)
* @param params 
*/
export const taskOperationTaskList = (params: any) =>
  ApiRequest.post(`/cpay-admin/task/operationTask/operationTaskList`, params);

/**
* @todo 终端操作任务列表导出(远程运维执行情况导出)
* @param params 
*/
export const taskOperationTaskExport = (params: any) =>
  ApiRequest.post(`/cpay-admin/task/operationTask/operationTaskExport`, params);

/**
 * @todo 终端操作任务重置(远程运维执行情况启动任务)
 * @param params 
 */
export const taskOperationTaskReset = (params: any) =>
  ApiRequest.post(`/cpay-admin/task/operationTask/operationTaskReset`, params);

/**
* @todo 终端操作任务暂停(远程运维执行情况暂停任务)
* @param params 
*/
export const taskOperationTaskPause = (params: any) =>
  ApiRequest.post(`/cpay-admin/task/operationTask/operationTaskPause`, params);

/**
* @todo 查询任务执行限制情况列表
* @param params
*/
export const taskCountList = (params: any) =>
  ApiRequest.post(`/cpay-admin/task/count/taskCountList`, params);

/**
* @todo 删除任务执行限制情况
* @param params
*/
export const taskCountRemove = (params: { ids: string }) =>
  ApiRequest.post(`/cpay-admin/task/count/taskCountRemove`, params);

/**
* @todo 查询任务执行限制情况列表
* @param params
*/
export const taskLogSetList = (params: any) =>
  ApiRequest.post(`/cpay-admin/task/logSet/taskLogSetList`, params);


/**
* @todo 查询参数下发信息列表
* @param params
*/
export const issueJobList = (params: any) =>
  ApiRequest.post(`/cpay-admin/issue/job/issueJobList`, params);