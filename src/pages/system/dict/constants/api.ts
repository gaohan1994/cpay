import ApiRequest, { jsonToQueryString } from '@/common/request-util';

/**
 * @todo 请求字典列表
 * @param param 
 */
export const systemDictList = (param: any) =>
  ApiRequest.post(`/cpay-admin/system/dict/type/dictTypeList`, param);

/**
* @todo 请求字典列表
* @param param 
*/
export const systemDictListCallback = async (param: any, callback?: any) => {
  const res = await ApiRequest.post(`/cpay-admin/system/dict/type/dictTypeList`, param);
  if (callback) {
    callback(res);
  }
}

/**
 * @todo 字典信息修改前获取数据
 * @param deptId 
 */
export const systemDictEdits = (deptId: number) =>
  ApiRequest.get(`/cpay-admin/system/dict/edits/${deptId}`);

/**
* @todo 字典信息修改
* @param param 
*/
export const systemDictEdit = (param: any) =>
  ApiRequest.post(`/cpay-admin/system/dict/type/dictTypeEdit`, param);

/**
* @todo 字典信息新增
* @param param 
*/
export const systemDictAdd = (param: any) =>
  ApiRequest.post(`/cpay-admin/system/dict/type/dictTypeAdd`, param);

/**
* @todo 字典信息删除
* @param param 
*/
export const systemDictRemove = (param: any) =>
  ApiRequest.post(`/cpay-admin/system/dict/type/dictTypeRemove`, param);

/**
* @todo 系统字典导出
* @param param 
*/
export const systemDictExport = (param: any) =>
  ApiRequest.post(`/cpay-admin/system/dict/type/dictTypeExport`, param);

/**
* @todo 字典类型校验是否唯一
* @param param 
*/
export const checkDictTypeUnique = (param: any) =>
  ApiRequest.post(`/cpay-admin/system/dict/checkDictTypeUnique`, param);