import ApiRequest from '@/common/request-util';
import { IResponseResult } from '@/common/type';
import { ITerminalSystemDetailInfo } from '../types';
/**
 * 查询终端详细信息
 * @param id
 * @param callback
 */
export const terminalInfoDetail = async (
  id: string,
  callback?: (result: IResponseResult<ITerminalSystemDetailInfo>) => void
): Promise<IResponseResult<ITerminalSystemDetailInfo>> => {
  const result = await ApiRequest.post(
    `/cpay-admin/terminal/info/terminalInfoEditDetail`,
    { id }
  );
  callback && callback(result);
  return result;
};

export const DetailTabs = [
  {
    title: '基础信息',
    key: '1',
  },
  {
    title: '系统信息',
    key: '2',
  },
  {
    title: '应用信息',
    key: '3',
  },
  {
    title: '当月流量',
    key: '4',
  },
  {
    title: '开关机记录',
    key: '5',
  },
];
