import ApiRequest, { jsonToQueryString } from '@/common/request-util';

/**
 * @todo 请求字典数据列表
 * @param param 
 */
export const systemDictDataList = (param: any) =>
  ApiRequest.get(`/cpay-admin/system/dict/data/list/${jsonToQueryString(param)}`);

/**
 * @todo 字典信息修改前获取数据
 * @param deptId 
 */
export const systemDictDataEdits = (deptId: number) =>
  ApiRequest.get(`/cpay-admin/system/dict/data/edits/${deptId}`);

/**
* @todo 字典数据修改
* @param param 
*/
export const systemDictDataEdit = (param: any) =>
  ApiRequest.post(`/cpay-admin/system/dict/data/edit`, param);

/**
* @todo 字典数据新增
* @param param 
*/
export const systemDictDataAdd = (param: any) =>
  ApiRequest.post(`/cpay-admin/system/dict/data/add`, param);

/**
* @todo 字典数据删除
* @param param 
*/
export const systemDictDataRemove = (param: any) =>
  ApiRequest.post(`/cpay-admin/system/dict/data/remove`, param);

/**
* @todo 系统字典数据导出
* @param param 
*/
export const systemDictDataExport = (param: any) =>
  ApiRequest.post(`/cpay-admin/system/dict/data/export`, param);

/**
* @todo 字典数据键值校验是否唯一
* @param param 
*/
export const checkKeyUniqueByType = (param: any) =>
  ApiRequest.post(`/cpay-admin/system/dict/data/checkKeyUniqueByType`, param);
