import { jsonToQueryString } from '@/common/request-util';
import ApiRequest from '@/common/request-util';
import { IAvertisementListField, AdvertisementDetail } from '../types';
import { IResponseResult } from '@/common/type';

/**
 * @todo 请求广告列表
 * @param params
 */
export const advertInfoList = (params: IAvertisementListField) =>
  ApiRequest.get(`/cpay-admin/advert/info/list${jsonToQueryString(params)}`);

export const advertInfoDetail = async (
  id: string,
  callback?: any
): Promise<IResponseResult<AdvertisementDetail>> => {
  const result = await ApiRequest.get(`/cpay-admin/advert/info/details/${id}`);
  console.log('result:', result);
  return result;
};

export const advertInfoAudit = (params: any) =>
  ApiRequest.post(`/cpay-admin/advert/audit/audit`, params);
