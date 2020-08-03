import ApiRequest, { jsonToQueryString } from '@/common/request-util';
import { FetchField, ITerminalFirmItem, ITerminalType } from '../types';
import { RESPONSE_CODE } from '@/common/config';

/**
 * 查询终端厂商列表
 * @param params
 * @param callback
 */
export const terminalFirmList = async (
  params: FetchField.TerminalFirmListAll,
  callback?: (data: ITerminalFirmItem[]) => void
): Promise<any> => {
  const result = await ApiRequest.get(
    `/cpay-admin/terminal/firm/listAll${jsonToQueryString(params)}`
  );
  callback &&
    result.code === RESPONSE_CODE.success &&
    callback(result.data.rows);
  return result;
};

/**
 * 根据终端厂商查询型号列表
 * @param params
 * @param callback
 */
export const terminalTypeListByFirm = async (
  params: FetchField.TerminalTypeListByFirm,
  callback?: (data: ITerminalType[]) => void
): Promise<any> => {
  const result = await ApiRequest.get(
    `/cpay-admin/terminal/type/listByFirm${jsonToQueryString(params)}`
  );
  callback && result.code === RESPONSE_CODE.success && callback(result.data);
  return result;
};