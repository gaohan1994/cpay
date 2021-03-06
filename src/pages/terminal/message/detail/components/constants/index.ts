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
  const result = await ApiRequest.post(
    `/cpay-admin/terminal/info/terminalInfoTerminalFlowMonthList`,
    params
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
    `/cpay-admin/terminal/flow/flowMonthExport`,
    params
  );
  callback && callback(result);
  return result;
};

export const terminalPowerList = async (
  params: FetchField.TerminalPowerList,
  callback?: (data: IResponseListResult<ITerminalPower>) => void
): Promise<IResponseListResult<ITerminalPower>> => {
  const result = await ApiRequest.post(
    `/cpay-admin/terminal/power/powerList`,
    params
  );
  callback && callback(result);
  return result;
};

export const powerRemove = (params: any) =>
  ApiRequest.post(`/cpay-admin/terminal/power/powerRemove`, params);

  /**
   * 查询终端信息管理系统信息
   */
  export const terminalSystemInfo = async (params:{id: number | undefined}):Promise<IResponseResult<any>> => {
    return ApiRequest.post(`/cpay-admin/terminal/sysDetail/terminalSysDetailDetail`, params)
  }

  /**
   * 查询终端信息管理基本信息、系统信息
   */
  export const terminalBaseInfo = async (params: {id: number}): Promise<IResponseResult<any>> => {
    return ApiRequest.post(`/cpay-admin/terminal/info/terminalInfoDetail`, params)
  }