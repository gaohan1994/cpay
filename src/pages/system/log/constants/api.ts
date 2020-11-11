import ApiRequest, { jsonToQueryString } from '@/common/request-util';

/**
 * @todo 请求操作日志列表
 * @param param 
 */
export const monitorOperLogList = (param: any) =>
  ApiRequest.post(`/cpay-admin/monitor/operlog/operLogList`, param);

/**
* @todo 请求操作日志详情
* @param id 
*/
export const monitorOperLogDetails = async (
  id: number,
  callback?: (params: any) => void
): Promise<any> => {
  const result = await ApiRequest.post(`/cpay-admin/monitor/operlog/operLogDetail`, { deptId: id });
  callback && callback(result);
  return result;
};
/**
* @todo 操作日志删除
* @param param 
*/
export const monitorOperLogRemove = (param: any) =>
  ApiRequest.post(`/cpay-admin/monitor/operlog/operLogRemove`, param);

/**
* @todo 操作日志清空
* @param param 
*/
export const monitorOperLogClean = () =>
  ApiRequest.post(`/cpay-admin/monitor/operlog/operLogClean`, {});

/**
* @todo 操作日志导出
* @param param 
*/
export const monitorOperLogExport = (param: any) =>
  ApiRequest.post(`/cpay-admin/monitor/operlog/operLogExport`, param);

/**
 * @todo 请求操作日志列表
 * @param param 
 */
export const monitorLoginInfoList = (param: any) =>
  ApiRequest.post(`/cpay-admin/monitor/logininfor/operLogList`, param);

/**
 * @todo 请求应用商店日志列表
 * @param params 
 */
export const amsAccessList = (params: any) => 
  ApiRequest.post(`/cpay-admin/ams/access/amsAccessList`, params)

/**
 * @todo 请求TMS通讯日志列表
 * @param params 
 */
export const tmsAccessList = (params: any) => 
  ApiRequest.post(`/cpay-admin/tms/access/tmsAccessList`, params)
