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
  const result = await ApiRequest.post(
    `/cpay-admin/terminal/param/terminalParamList`,
    params
  );
  callback && result &&
    result.code === RESPONSE_CODE.success &&
    callback(result.data.rows);
  return result;
};

export const terminalParamRemove = async (id: string) => {
  const result = await ApiRequest.post(`/cpay-admin/terminal/param/terminalParamRemove`, {
    ids: id,
  });
  return result;
};
