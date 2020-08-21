import ApiRequest, { jsonToQueryString } from '@/common/request-util';
import { FetchField, ITerminalParam } from '../types';
import { RESPONSE_CODE } from '@/common/config';
import { IResponseResult } from '@/common/type';
import { DetailType } from '../../types';

/**
 * 复制终端参数信息(交行二期使用)
 */
export const terminalParamCopys = async (
  params: FetchField.TerminalParam,
  callback?: (result: IResponseResult<ITerminalParam>) => void
): Promise<IResponseResult<ITerminalParam>> => {
  const result = await ApiRequest.get(
    `/cpay-admin/terminal/param/copys/${params.id}`
  );
  callback && callback(result);
  return result;
};

/**
 * 修改保存终端参数信息（交行二期使用）
 */
export const terminalParamEdit = async (
  params: FetchField.TerminalParam,
  callback?: (result: IResponseResult<ITerminalParam>) => void
): Promise<IResponseResult<ITerminalParam>> => {
  const result = await ApiRequest.get(
    `/cpay-admin/terminal/param/edits/${params.id}`
  );
  callback && callback(result);
  return result;
};

export const terminalParamUpdate = async (key: DetailType, params: any) => {
  const fetchUrl = `/cpay-admin/terminal/param/${key.toLowerCase()}`;
  console.log('fetchUrl:', fetchUrl);
  const result = await ApiRequest.post(fetchUrl, params);
  return result;
};
