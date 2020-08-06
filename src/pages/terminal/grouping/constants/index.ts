import ApiRequest, {
  jsonToQueryString,
  formatListWithKey,
  jsonToForm,
} from '@/common/request-util';
import { FetchField } from '../types';
import { TerminalGroupItem } from '@/pages/terminal/group/types';
import { RESPONSE_CODE } from '@/common/config';

/**
 * getGroupSet
 * @param callback
 */
export const terminalGetGroupSet = async (
  callback?: (data: TerminalGroupItem[]) => void
): Promise<any> => {
  const result = await ApiRequest.get(
    `/cpay-admin/terminal/groupSet/getGroupSet`
  );
  callback && result.code === RESPONSE_CODE.success && callback(result.data);
  return result;
};

export const terminalGroupSetAdd = async (
  params: FetchField.ITerminalGroupSetAdd,
  callback?: (data: any) => void
) => {
  const result = await ApiRequest.post(
    `/cpay-admin/terminal/groupSet/add`,
    params
  );
  callback && callback(result);
  return result;
};

export const terminalGroupSetRemove = async (
  params: FetchField.ITerminalGroupSetRemove,
  callback?: (data: any) => void
) => {
  const result = await ApiRequest.post(
    `/cpay-admin/terminal/groupSet/remove`,
    params
  );
  callback && callback(result);
  return result;
};

/**
 * 查询是否分组终端信息列表
 */
export const terminalInfoListByIsGroup = async (
  params: Partial<FetchField.ITerminalInfoList>,
  callback?: (data: any[]) => void
) => {
  console.log('params:', params);
  const result = await ApiRequest.get(
    `/cpay-admin/terminal/groupSet/selectTerminalInfoListByIsGroup${jsonToQueryString(
      params
    )}`
  );
  callback &&
    result.code === RESPONSE_CODE.success &&
    callback(result.data.rows);
  return result;
};
