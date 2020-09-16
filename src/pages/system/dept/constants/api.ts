import ApiRequest from '@/common/request-util';

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
* @todo 机构信息新增
* @param param 
*/
export const systemDeptAdd = (param: any) =>
  ApiRequest.post(`/cpay-admin/system/dept/add`, param);
