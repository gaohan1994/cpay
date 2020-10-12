import { jsonToQueryString } from '@/common/request-util';
import ApiRequest from '@/common/request-util';
import { RESPONSE_CODE } from '@/common/config';


/**
 * @todo 获取用户列表
 * @param param 
 */
export const systemRoleList = async (param: any, callback?: any) => {
  // const jsonToQueryString = (json: any) => {
  //   const field = Object.keys(json)
  //     .map(function (key: any) {
  //       if (key === 'params[beginTime]' || key === 'params[endTime]') {
  //         return encodeURIComponent(`${key}=${json[key]}`);
  //       }
  //       if (json[key] !== undefined) {
  //         return key + '=' + json[key];
  //       }
  //     })
  //     .filter((item) => !!item)
  //     .join('&');
  //   return field.length > 0 ? `?${field}` : '';
  // };
  const res = await ApiRequest.post(`/cpay-admin/system/role/roleList`, param);
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
  const result = await ApiRequest.post(`/cpay-admin/system/role/roleEditDetail`, { roleId: id });
  callback && callback(result);
  return result;
};

/**
 * @todo 系统角色新增
 * @param param 
 */
export const systemRoleAdd = (param: any) =>
  ApiRequest.post(`/cpay-admin/system/role/roleAdd`, param);

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

/**
 * @todo 更改角色状态（0-启用，1-停用）
 * @param param 
 */
export const systemRoleChangeStatus = (param: any) =>
  ApiRequest.post(`/cpay-admin/system/role/roleChangeStatus`, param);

/**
* @todo 系统角色导出
* @param param 
*/
export const systemRoleExport = (param: any) =>
  ApiRequest.post(`/cpay-admin/system/role/roleExport`, param);