import ApiRequest, { jsonToQueryString } from '@/common/request-util';
import { RESPONSE_CODE } from '@/common/config';

// 弃用
export const downloadPublicKey = async (id: any) => {
  const result = await ApiRequest.post(
    `/cpay-admin/terminal/firm/firmDownloadPublicKey`,
    { id }
  );
  return result;
};

export const changeStatus = async (params: any) => {
  const result = await ApiRequest.post(
    `/cpay-admin/terminal/firm/firmChangeStatus`,
    params
  );
  return result;
};

export const terminalFirmDetail = async (id: any) => {
  const result = await ApiRequest.post(`/cpay-admin/terminal/firm/firmDetail`, { id });
  return result;
};

export const firmEdit = async (params: any) => {
  const result = await ApiRequest.post(
    `/cpay-admin/terminal/firm/firmEdit`,
    params
  );
  return result;
};

export const firmAdd = async (params: any) => {
  const result = await ApiRequest.post(`/cpay-admin/terminal/firm/firmAdd`, params);
  return result;
};

export const firmRemove = async (params: any) => {
  const result = await ApiRequest.post(`/cpay-admin/terminal/firm/firmRemove`, params);
  return result;
};

export const checkFirmCodeUnique = async (params: any) => {
  const result = await ApiRequest.post(`/cpay-admin/terminal/firm/checkFirmCodeUnique`, params);
  return result;
};