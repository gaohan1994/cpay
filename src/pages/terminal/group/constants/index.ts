import ApiRequest, { jsonToQueryString } from '@/common/request-util';
import { FetchField, TerminalGroupItem } from '../types';
import { RESPONSE_CODE } from '@/common/config';

/**
 * 查询终端参数信息列表
 * @param params
 * @param callback
 */
export const terminalGroupList = async (
  params?: FetchField,
  callback?: (data: TerminalGroupItem[]) => void
): Promise<any> => {
  const result = await ApiRequest.get(
    `/cpay-admin/terminal/group/list${jsonToQueryString(params)}`
  );
  callback &&
    result.code === RESPONSE_CODE.success &&
    callback(result.data.rows);
  return result;
};
