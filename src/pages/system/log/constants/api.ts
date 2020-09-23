import ApiRequest, { jsonToQueryString } from '@/common/request-util';

/**
 * @todo 请求操作日志列表
 * @param param 
 */
export const monitorOperLogList = (param: any) =>
  ApiRequest.get(`/cpay-admin/monitor/operlog/list/${jsonToQueryString(param)}`);

/**
* @todo 请求操作日志详情
* @param id 
*/
export const monitorOperLogDetails = async (
  id: number,
  callback?: (params: any) => void
): Promise<any> => {
  const result = await ApiRequest.get(`/cpay-admin/monitor/operlog/details/${id}`);
  callback && callback(result);
  return result;
};
/**
* @todo 操作日志删除
* @param param 
*/
export const monitorOperLogRemove = (param: any) =>
  ApiRequest.post(`/cpay-admin/monitor/operlog/remove`, param);

/**
* @todo 操作日志清空
* @param param 
*/
export const monitorOperLogClean = () =>
  ApiRequest.post(`/cpay-admin/monitor/operlog/clean`, {});

/**
* @todo 操作日志导出
* @param param 
*/
export const monitorOperLogExport = (param: any) =>
  ApiRequest.post(`/cpay-admin/monitor/operlog/export`, param);

/**
 * @todo 请求操作日志列表
 * @param param 
 */
export const monitorLoginInfoList = (param: any) =>
  ApiRequest.get(`/cpay-admin/monitor/logininfor/list/${jsonToQueryString(param)}`);
