import ApiRequest, { jsonToQueryString } from '@/common/request-util';

/**
 * @todo 请求参数列表
 * @param param 
 */
export const systemConfigList = (param: any) =>
  ApiRequest.get(`/cpay-admin/system/config/list/${jsonToQueryString(param)}`);

/**
 * @todo 参数信息修改前获取数据
 * @param deptId 
 */
export const systemConfigEdits = (deptId: number) =>
  ApiRequest.get(`/cpay-admin/system/config/edits/${deptId}`);

/**
* @todo 参数信息修改
* @param param 
*/
export const systemConfigEdit = (param: any) =>
  ApiRequest.post(`/cpay-admin/system/config/edit`, param);

/**
* @todo 参数信息新增
* @param param 
*/
export const systemConfigAdd = (param: any) =>
  ApiRequest.post(`/cpay-admin/system/config/add`, param);

/**
* @todo 参数信息删除
* @param param 
*/
export const systemConfigRemove = (param: any) =>
  ApiRequest.post(`/cpay-admin/system/config/remove`, param);

/**
* @todo 参数信息导出
* @param param 
*/
export const systemConfigExport = (param: any) =>
  ApiRequest.post(`/cpay-admin/system/config/export`, param);

/**
* @todo 参数键名校验是否唯一
* @param param 
*/
export const checkConfigKeyUnique = (param: any) =>
  ApiRequest.post(`/cpay-admin/system/config/checkConfigKeyUnique`, param);