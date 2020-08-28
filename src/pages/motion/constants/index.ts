import ApiRequest, { jsonToQueryString } from '@/common/request-util';
import { FetchField, ShiftItem } from '../types';
import { IResponseListResult, IFormatResult } from '@/common/type';

export const terminalShiftList = async (
  params: FetchField.List,
  callback?: (params: IResponseListResult<ShiftItem>) => void
) => {
  const result = await ApiRequest.get(
    `/cpay-admin/relocation/record/list${jsonToQueryString(params)}`
  );

  callback && callback(result);
  return result;
};

export const terminalShiftExport = async (
  params: Partial<FetchField.Exp>,
  callback?: (params: IFormatResult<any>) => void
) => {
  const result = await ApiRequest.get(
    `/cpay-admin/relocation/record/export${jsonToQueryString(params)}`
  );

  callback && callback(result);
  return result;
};
