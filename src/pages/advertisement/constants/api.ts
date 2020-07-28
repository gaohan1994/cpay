import {
  formartQuery,
  jsonToQueryString,
  jsonToForm,
} from '@/common/request-util';
import ApiRequest from '@/common/request-util';
import { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { IAvertisementListField } from '../types';

export const advertInfoList = (params: IAvertisementListField) =>
  ApiRequest.get(`/cpay-admin/advert/info/list${jsonToQueryString(params)}`);
