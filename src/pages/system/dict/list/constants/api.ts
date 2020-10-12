import ApiRequest, { jsonToQueryString } from '@/common/request-util';

/**
 * @todo 请求字典数据列表
 * @param param 
 */
export const systemDictDataList = (param: any) =>
  ApiRequest.post(`/cpay-admin/system/dict/data/dictDataList`, param);

/**
 * @todo 字典信息修改前获取数据
 * @param deptId 
 */
export const systemDictDataEdits = (deptId: number) =>
  ApiRequest.post(`/cpay-admin/system/dict/data/dictDataEditDetail`, { deptId });

/**
* @todo 字典数据修改
* @param param 
*/
export const systemDictDataEdit = (param: any) =>
  ApiRequest.post(`/cpay-admin/system/dict/data/dictDataEdit`, param);

/**
* @todo 字典数据新增
* @param param 
*/
export const systemDictDataAdd = (param: any) =>
  ApiRequest.post(`/cpay-admin/system/dict/data/dictDataAdd`, param);

/**
* @todo 字典数据删除
* @param param 
*/
export const systemDictDataRemove = (param: any) =>
  ApiRequest.post(`/cpay-admin/system/dict/data/dictDataRemove`, param);

/**
* @todo 系统字典数据导出
* @param param 
*/
export const systemDictDataExport = (param: any) =>
  ApiRequest.post(`/cpay-admin/system/dict/data/dictDataExport`, param);

/**
* @todo 字典数据键值校验是否唯一
* @param param 
*/
export const checkKeyUniqueByType = (param: any) =>
  ApiRequest.post(`/cpay-admin/system/dict/data/checkKeyUniqueByType`, param);
