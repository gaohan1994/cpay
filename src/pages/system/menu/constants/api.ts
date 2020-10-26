import { jsonToQueryString } from '@/common/request-util';
import ApiRequest from '@/common/request-util';
import { RESPONSE_CODE } from '@/common/config';
import { ACTION_TYPES_SYSTEM } from '../../reducers';
import { formatMenuTreeData } from '../../common';

/**
* @todo 请求菜单列表
* @param params
*/
export async function systemMenuList(params: any, dispatch?: any, setLoading?: (loading: boolean) => void) {
  if (setLoading) {
    setLoading(true);
  }
  const res = await ApiRequest.post(`/cpay-admin/system/menu/menuList`, params);
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


/**
* @todo 菜单新增
* @param param 
*/
export const systemMenuAdd = (param: any) =>
  ApiRequest.post(`/cpay-admin/system/menu/menuAdd`, param);


/**
 * @todo 菜单信息修改前获取数据
 * @param menuId 
 */
export const systemMenuEdits = (menuId: number) =>
  ApiRequest.post(`/cpay-admin/system/menu/menuEditDetail`, { menuId });

/**
* @todo 菜单信息修改
* @param param 
*/
export const systemMenuEdit = (param: any) =>
  ApiRequest.post(`/cpay-admin/system/menu/menuEdit`, param);

/**
* @todo 菜单删除
* @param param 
*/
export const systemMenuRemove = (id: number) =>
  ApiRequest.post(`/cpay-admin/system/menu/menuRemove`, { menuId: id });