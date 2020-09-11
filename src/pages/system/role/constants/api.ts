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
