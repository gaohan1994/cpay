import ApiRequest, { jsonToQueryString } from '@/common/request-util';

export const terminalTemplateList = (params: any) =>
  ApiRequest.post(`/cpay-admin/terminal/template/terminalTemplateList`, params);

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