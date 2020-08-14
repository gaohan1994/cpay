import ApiRequest, { jsonToQueryString } from '@/common/request-util';
import { merge } from 'lodash';
import { FetchField, ITerminalSysDetail } from '../types';
import { IResponseListResult } from '@/common/type';

/**
 * 查询终端系统详情列表
 * @param params
 * @param callback
 */
export const terminalSysdetailList = async (
  params: FetchField.ITerminalSysdetailList,
  callback?: (data: ITerminalSysDetail[]) => void
): Promise<IResponseListResult<ITerminalSysDetail>> => {
  const result = await ApiRequest.get(
    `/cpay-admin/terminal/sysdetail/list${jsonToQueryString(params)}`
  );
  const formatData: ITerminalSysDetail[] = merge(
    (result && result.data && result.data.rows) || []
  ).map((item: ITerminalSysDetail) => {
    return {
      ...item,
      sysDetail: JSON.parse(item.sysDetail as any),
    };
  });

  callback && result && callback(formatData);
  return {
    ...result,
    data: {
      ...result.data,
      rows: formatData,
    },
  };
};

/**
 * 导出终端系统详情列表
 * @param params
 * @param callback
 */
export const terminalSysdetailExport = async (
  params: FetchField.ITerminalSysdetailList,
  callback?: (data: any) => void
) => {
  const result = await ApiRequest.post(
    `/cpay-admin/terminal/sysdetail/export`,
    params
  );
  callback && callback(result);
  return result;
};
