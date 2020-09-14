import { jsonToQueryString } from '@/common/request-util';
import ApiRequest from '@/common/request-util';
import { RESPONSE_CODE } from '@/common/config';


/**
 * @todo 获取用户列表
 * @param param 
 */
export const systemRoleList = async (param: any, callback?: any) => {
  const res = await ApiRequest.get(`/cpay-admin/system/role/list/${jsonToQueryString(param)}`);
  if (callback && res && res.code === RESPONSE_CODE.success) {
    callback(res);
  }

  return res;
}

/**
* @todo 角色信息修改获取数据
* @param id 
*/
export const systemRoleEdits = async (
  id: number,
  callback?: (params: any) => void
): Promise<any> => {
  const result = await ApiRequest.get(`/cpay-admin/system/role/edits/${id}`);
  callback && callback(result);
  return result;
};

/**
 * @todo 系统角色新增
 * @param param 
 */
export const systemRoleAdd = (param: any) =>
  ApiRequest.post(`/cpay-admin/system/role/add`, param);

/**
 * @todo 系统角色修改
 * @param param 
 */
export const systemRoleEdit = (param: any) =>
  ApiRequest.post(`/cpay-admin/system/role/edit`, param);

/**
* @todo 系统角色删除
* @param param 
*/
export const systemRoleRemove = (param: any) =>
  ApiRequest.post(`/cpay-admin/system/role/remove`, param);