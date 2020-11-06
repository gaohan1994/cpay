import ApiRequest from '@/common/request-util';

export const systemMains = async (
  callback?: (params: any) => void
): Promise<any> => {
  const result = await ApiRequest.post(`/cpay-admin/system/main`, {});
  callback && callback(result);
  return result;
};

/**
 * 获取任务列表
 */
export const getDownloadJobList = async (): Promise<any> => {
  const result = await ApiRequest.post(`/cpay-admin/system/getDownloadJobList`, {})
  return result
}