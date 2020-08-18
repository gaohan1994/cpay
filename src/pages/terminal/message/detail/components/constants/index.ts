import ApiRequest, { jsonToQueryString } from '@/common/request-util';
import { FlowItem, ITerminalPower, FetchField } from '../types';
import { IResponseListResult, IResponseResult } from '@/common/type';

/**
 * 查询终端流量（月统计）列表
 */
export const terminalFlowList = async (
  params: FetchField.TerminalFlowList,
  callback?: (data: IResponseListResult<FlowItem>) => void
): Promise<IResponseListResult<FlowItem>> => {
  const result = await ApiRequest.get(
    `/cpay-admin/terminal/flow/list${jsonToQueryString(params)}`
  );
  callback && callback(result);
  return result;
};

/**
 * 查询终端流量（月统计）列表
 */
export const terminalFlowExport = async (
  params: FetchField.TerminalFlowList,
  callback?: (data: IResponseResult<any>) => void
): Promise<IResponseResult<any>> => {
  const result = await ApiRequest.post(
    `/cpay-admin/terminal/flow/export`,
    params
  );
  callback && callback(result);
  return result;
};

export const terminalPowerList = async (
  params: FetchField.TerminalPowerList,
  callback?: (data: IResponseListResult<ITerminalPower>) => void
): Promise<IResponseListResult<ITerminalPower>> => {
  const result = await ApiRequest.get(
    `/cpay-admin/terminal/power/list${jsonToQueryString(params)}`
  );
  callback && callback(result);
  return result;
};
