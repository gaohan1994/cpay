import ApiRequest from '@/common/request-util';

export const systemMains = async (
  callback?: (params: any) => void
): Promise<any> => {
  const result = await ApiRequest.get(`/cpay-admin/system/mains`);
  callback && callback(result);
  return result;
};