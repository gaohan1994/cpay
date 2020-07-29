import { jsonToQueryString } from '@/common/request-util';
import ApiRequest from '@/common/request-util';
import { IAvertisementListField } from '../types';

/**
 * @todo 请求广告列表
 * @param params
 */
export const advertInfoList = (params: IAvertisementListField) =>
  ApiRequest.get(`/cpay-admin/advert/info/list${jsonToQueryString(params)}`);
