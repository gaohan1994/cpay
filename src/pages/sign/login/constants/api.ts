import Aq, { jsonToForm } from '@/common/request-util';

export const adminLogin = (params: any) =>
  Aq.post(`/cpay-admin/login`, jsonToForm(params));
