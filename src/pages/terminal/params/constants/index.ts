import ApiRequest, { jsonToQueryString } from '@/common/request-util';
import { FetchField, TerminalParamItem } from '../types';
import { RESPONSE_CODE } from '@/common/config';

/**
 * 查询终端参数信息列表
 * @param params
 * @param callback
 */
export const terminalParamList = async (
  params?: FetchField,
  callback?: (data: TerminalParamItem[]) => void
): Promise<any> => {
  const result = await ApiRequest.get(
    `/cpay-admin/terminal/param/list${jsonToQueryString(params)}`
  );
  callback &&
    result.code === RESPONSE_CODE.success &&
    callback(result.data.rows);
  return result;
};

export const terminalParamRemove = async (id: string) => {
  const result = await ApiRequest.post(`/cpay-admin/terminal/param/remove`, {
    ids: id,
  });
  return result;
};