import { jsonToQueryString } from '@/common/request-util';
import ApiRequest from '@/common/request-util';
import { RESPONSE_CODE } from '@/common/config';

/**
 * @todo 终端信息统计
 * @param params
 */
export const getTerminalInfoReport = (params: any) =>
  ApiRequest.get(`/cpay-admin/report/center/getTerminalInfoReport${jsonToQueryString(params)}`);

/**
* @todo 终端应用统计
* @param params
*/
export const getAppPublishReport = (params: any) =>
  ApiRequest.get(`/cpay-admin/report/center/getAppPublishReport${jsonToQueryString(params)}`);

/**
* @todo 终端应用统计
* @param params
*/
export const getApkUpdateReport = (params: any) =>
  ApiRequest.get(`/cpay-admin/report/center/getApkUpdateReport${jsonToQueryString(params)}`);