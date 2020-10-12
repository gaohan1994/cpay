import { jsonToQueryString } from '@/common/request-util';
import ApiRequest from '@/common/request-util';
import { RESPONSE_CODE } from '@/common/config';
import { ACTION_TYPES_SYSTEM } from '../../reducers';
import { formatMenuTreeData } from '../../common';

/**
* @todo 请求用户所属机构
* @param params
*/
export async function systemMenuList(dispatch?: any, setLoading?: (loading: boolean) => void) {
  if (setLoading) {
    setLoading(true);
  }
  const res = await ApiRequest.post(`/cpay-admin/system/menu/menuList`, {});
  if (setLoading) {
    setLoading(false);
  }
  if (res && res.code === RESPONSE_CODE.success) {
    dispatch({
      type: ACTION_TYPES_SYSTEM.RECEIVE_MENU_LIST,
      payload: res.data,
    });
    const menuTreeData = formatMenuTreeData(res.data);
    dispatch({
      type: ACTION_TYPES_SYSTEM.RECEIVE_MENU_TREE_DATA,
      payload: menuTreeData,
    });
  }
  return res;
}

