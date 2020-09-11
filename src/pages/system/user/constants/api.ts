import { jsonToQueryString } from '@/common/request-util';
import ApiRequest from '@/common/request-util';
import { RESPONSE_CODE } from '@/common/config';


/**
 * @todo 获取用户列表
 * @param param 
 */
export const systemUserList = (param: any) =>
  ApiRequest.get(`/cpay-admin/system/user/list/${jsonToQueryString(param)}`);

/**
 * @todo 更改用户状态（0-启用，1-停用）
 * @param param 
 */
export const systemUserChangeStatus = (param: any) =>
  ApiRequest.post(`/cpay-admin/system/user/changeStatus`, param);

/**
* @todo 用户信息修改获取数据
* @param deptId 
*/
export const systemUserEdits = (id: number) =>
  ApiRequest.get(`/cpay-admin/system/user/edits/${id}`);

