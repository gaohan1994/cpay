import { formartQuery, jsonToQueryString } from '@/common/request-util';
import ApiRequest from '@/common/request-util';
export const getTableData = (
  { current, pageSize }: any,
  formData: Object
): Promise<any> => {
  let query = `page=${current}&size=${pageSize}`;
  console.log('formData', formData);
  Object.entries(formData).forEach(([key, value]) => {
    if (value) {
      query += `&${key}=${value}`;
    }
  });

  return fetch(`https://randomuser.me/api?results=55&${query}`)
    .then((res) => res.json())
    .then((res) => ({
      total: res.info.results,
      list: res.results,
    }));
};

export const merchantQueryBocoms = (
  params: any,
  formData: any
): Promise<any> => {
  formartQuery(params);
  console.log('formData', formData);
  return ApiRequest.get(`/merchant/query.bocoms${jsonToQueryString(params)}`);
};
