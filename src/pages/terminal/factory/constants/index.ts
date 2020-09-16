import ApiRequest, { jsonToQueryString } from '@/common/request-util';
import { RESPONSE_CODE } from '@/common/config';

// 弃用
export const downloadPublicKey = async (id: any) => {
  const result = await ApiRequest.get(
    `/cpay-admin/terminal/firm/downloadPublicKey/${id}`
  );
  return result;
};

export const changeStatus = async (params: any) => {
  const result = await ApiRequest.post(
    `/cpay-admin/terminal/firm/changeStatus`,
    params
  );
  return result;
};

export const terminalFirmDetail = async (id: any) => {
  const result = await ApiRequest.get(`/cpay-admin/terminal/firm/detail/${id}`);
  return result;
};

export const firmEdit = async (params: any) => {
  const result = await ApiRequest.post(
    `/cpay-admin/terminal/firm/edit`,
    params
  );
  return result;
};

export const firmAdd = async (params: any) => {
  const result = await ApiRequest.post(`/cpay-admin/terminal/firm/add`, params);
  return result;
};
