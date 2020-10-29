import ApiRequest, { jsonToForm } from '@/common/request-util';
import { RESPONSE_CODE } from '@/common/config';
import { ACTION_TYPES_USER } from '../reducers';

export const login = (params: any) => ApiRequest.post(`/cpay-admin/login`, params);

export const logout = (params: any) => ApiRequest.post(`/cpay-admin/system/user/logout`, {});

export const getUserAndMenu = async (dispatch: ({}) => void): Promise<any> => {
  const result = await ApiRequest.post(`/cpay-admin/index`, {});
  if (result?.code === RESPONSE_CODE.success) {
    dispatch({
      type: ACTION_TYPES_USER.RECEIVE_MENU_USER,
      payload: result.data,
    });
  }
  return result;
};
