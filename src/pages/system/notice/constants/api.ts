import ApiRequest, { jsonToQueryString } from '@/common/request-util';

/**
 * @todo 请求公告列表
 * @param param 
 */
export const systemNoticeList = (param: any) =>
  ApiRequest.get(`/cpay-admin/system/notice/list/${jsonToQueryString(param)}`);

/**
 * @todo 公告信息修改前获取数据
 * @param deptId 
 */
export const systemNoticeEdits = (id: number) =>
  ApiRequest.get(`/cpay-admin/system/notice/details/${id}`);

/**
* @todo 公告信息修改
* @param param 
*/
export const systemNoticeEdit = (param: any) =>
  ApiRequest.post(`/cpay-admin/system/notice/edit`, param);

/**
* @todo 公告信息新增
* @param param 
*/
export const systemNoticeAdd = (param: any) =>
  ApiRequest.post(`/cpay-admin/system/notice/add`, param);

/**
* @todo 公告信息删除
* @param param 
*/
export const systemNoticeRemove = (param: any) =>
  ApiRequest.post(`/cpay-admin/system/notice/remove`, param);
