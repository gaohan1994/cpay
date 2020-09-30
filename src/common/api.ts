import { jsonToQueryString } from '@/common/request-util';
import ApiRequest from '@/common/request-util';
import { RESPONSE_CODE } from '@/common/config';
import { useRedux } from './redux-util';
import { ACTION_TYPES_COMMON } from '@/pages/common/reducer';

/**
 * @todo 请求用户所属机构
 * @param params
 */
export async function getUserDept(dispatch?: any) {
  const res = await ApiRequest.post(`/cpay-admin/system/dept/userDeptDetail`, {});
  if (res && res.code === RESPONSE_CODE.success) {
    dispatch({
      type: ACTION_TYPES_COMMON.RECEIVE_USER_DEPT,
      payload: res.data,
    });
  }
  return res;
}
