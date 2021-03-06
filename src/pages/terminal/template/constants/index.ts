import ApiRequest, { jsonToQueryString } from '@/common/request-util';
import { RESPONSE_CODE } from '@/common/config';

export const terminalTemplateList = async (params: any, callback?: (data: any[]) => void): Promise<any> => {
  const result = await ApiRequest.post(`/cpay-admin/terminal/template/terminalTemplateList`, params);
  callback && result && result.code === RESPONSE_CODE.success && callback(result?.data?.rows || [])
  return result
}

export const terminalTemplateRemove = (params: any) =>
  ApiRequest.post(`/cpay-admin/terminal/template/terminalTemplateRemove`, params);

export const terminalTemplateExport = (params: any) =>
  ApiRequest.post(`/cpay-admin/terminal/template/terminalTemplateExport`, params);

export const terminalTemplateEditDetail = (params: any) =>
  ApiRequest.post(`/cpay-admin/terminal/template/terminalTemplateEditDetail`, params);

export const terminalTemplateEdit = (params: any) =>
  ApiRequest.post(`/cpay-admin/terminal/template/terminalTemplateEdit`, params);

export const terminalTemplateAdd = (params: any) =>
  ApiRequest.post(`/cpay-admin/terminal/template/terminalTemplateAdd`, params);

// 终端参数信息
export const acquiringList = (params: any) =>
  ApiRequest.post(`/cpay-admin/terminal/acquiring/acquiringList`, params);

export const acquiringRemove = (params: any) =>
  ApiRequest.post(`/cpay-admin/terminal/acquiring/acquiringRemove`, params);

export const acquiringExport = (params: any) =>
  ApiRequest.post(`/cpay-admin/terminal/acquiring/acquiringExport`, params);

export const acquiringEditDetail = (params: any) =>
  ApiRequest.post(`/cpay-admin/terminal/acquiring/acquiringEditDetail`, params);

export const acquiringEdit = (params: any) =>
  ApiRequest.post(`/cpay-admin/terminal/acquiring/acquiringEdit`, params);

export const acquiringAdd = (params: any) =>
  ApiRequest.post(`/cpay-admin/terminal/acquiring/acquiringAdd`, params);