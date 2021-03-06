import ApiRequest, { jsonToQueryString } from '@/common/request-util';

/**
 * @todo 请求公告列表
 * @param param 
 */
export const systemNoticeList = (param: any) =>
  ApiRequest.post(`/cpay-admin/system/notice/noticeList`, param);

// /**
//  * @todo 公告信息修改前获取数据
//  * @param deptId 
//  */
// export const systemNoticeEdits = (id: number) =>
//   ApiRequest.get(`/cpay-admin/system/notice/details/${id}`);

/**
 * @todo 公告信息修改前获取数据
 * @param id 
 * @param callback 
 */
export const systemNoticeEdits = async (
  id: number,
  callback?: (params: any) => void
): Promise<any> => {
  const result = await ApiRequest.post(`/cpay-admin/system/notice/noticeEditDetail`, { noticeId: id });
  callback && callback(result);
  return result;
};

/**
* @todo 公告信息修改
* @param param 
*/
export const systemNoticeEdit = (param: any) =>
  ApiRequest.post(`/cpay-admin/system/notice/noticeEdit`, param);

/**
* @todo 公告信息新增
* @param param 
*/
export const systemNoticeAdd = (param: any) =>
  ApiRequest.post(`/cpay-admin/system/notice/noticeAdd`, param);

/**
* @todo 公告信息删除
* @param param 
*/
export const systemNoticeRemove = (param: any) =>
  ApiRequest.post(`/cpay-admin/system/notice/noticeRemove`, param);
