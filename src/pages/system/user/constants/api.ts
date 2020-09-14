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
* @param id 
*/
export const systemUserEdits = async (
  id: number,
  callback?: (params: any) => void
): Promise<any> => {
  const result = await ApiRequest.get(`/cpay-admin/system/user/edits/${id}`);
  callback && callback(result);
  return result;
};

/**
 * @todo 系统用户新增
 * @param param 
 */
export const systemUserAdd = (param: any) =>
  ApiRequest.post(`/cpay-admin/system/user/add`, param);

/**
 * @todo 系统用户修改
 * @param param 
 */
export const systemUserEdit = (param: any) =>
  ApiRequest.post(`/cpay-admin/system/user/edit`, param);

/**
* @todo 系统用户删除
* @param param 
*/
export const systemUserRemove = (param: any) =>
  ApiRequest.post(`/cpay-admin/system/user/remove`, param);

/**
* @todo 系统用户导出
* @param param 
*/
export const systemUserExport = (param: any) =>
  ApiRequest.post(`/cpay-admin/system/user/export`, param);

/**
* @todo 系统用户重置密码
* @param param 
*/
export const systemUserResetPwd = (param: any) =>
  ApiRequest.post(`/cpay-admin/system/user/resetPwd`, param);