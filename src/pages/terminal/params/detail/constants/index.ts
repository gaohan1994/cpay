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
  const result = await ApiRequest.post(
    `/cpay-admin/terminal/param/terminalParamCopyDetail`,
    { id: params.id }
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
  const result = await ApiRequest.post(
    `/cpay-admin/terminal/param/terminalParamEditDetail`,
    { id: params.id }
  );
  callback && callback(result);
  return result;
};

// 修改
export const terminalParamsEdit = (params: any) =>
  ApiRequest.post(`/cpay-admin/terminal/param/terminalParamEdit`, params);

export const terminalParamAdd = (params: any) =>
  ApiRequest.post(`/cpay-admin/terminal/param/terminalParamAdd`, params);