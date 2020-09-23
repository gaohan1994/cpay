import ApiRequest, { jsonToQueryString } from '@/common/request-util';

export const systemDeptList = (param: any) =>
  ApiRequest.get(`/cpay-admin/system/dept/list/${jsonToQueryString(param)}`);

/**
 * @todo 机构信息修改前获取数据
 * @param deptId 
 */
export const systemDeptEdits = (deptId: number) =>
  ApiRequest.get(`/cpay-admin/system/dept/edits/${deptId}`);

/**
* @todo 机构信息修改
* @param param 
*/
export const systemDeptEdit = (param: any) =>
  ApiRequest.post(`/cpay-admin/system/dept/edit`, param);

/**
* @todo 机构删除
* @param param 
*/
export const systemDeptRemove = (id: number) =>
  ApiRequest.get(`/cpay-admin/system/dept/remove/${id}`);

/**
* @todo 机构信息新增
* @param param 
*/
export const systemDeptAdd = (param: any) =>
  ApiRequest.post(`/cpay-admin/system/dept/add`, param);


/**
* @todo 机构名称校验是否唯一
* @param param 
*/
export const checkDeptNameUnique = (param: any) =>
  ApiRequest.post(`/cpay-admin/system/dept/checkDeptName`, param);

/**
* @todo 机构号校验是否唯一
* @param param 
*/
export const checkDeptCodeUnique = (param: any) =>
  ApiRequest.post(`/cpay-admin/system/dept/checkDeptCode`, param);