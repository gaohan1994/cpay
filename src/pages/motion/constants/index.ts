import ApiRequest, { jsonToQueryString } from '@/common/request-util';
import { FetchField, ShiftItem } from '../types';
import {
  IResponseListResult,
  IFormatResult,
  IResponseResult,
} from '@/common/type';

export const terminalShiftList = async (
  params: FetchField.List,
  callback?: (params: IResponseListResult<ShiftItem>) => void
) => {
  const result = await ApiRequest.post(
    `/cpay-admin/relocation/record/relocationRecordList`,
    params
  );

  callback && callback(result);
  return result;
};

export const terminalShiftExport = async (
  params: Partial<FetchField.Exp>,
  callback?: (params: IFormatResult<any>) => void
) => {
  const result = await ApiRequest.post(
    `/cpay-admin/relocation/record/relocationRecordExport`,
    params
  );

  callback && callback(result);
  return result;
};

export const relocationKeyList = async (
  params: Partial<FetchField.KeyList>,
  callback?: (params: IFormatResult<any>) => void
) => {
  const result = await ApiRequest.post(
    `/cpay-admin/relocation/key/relocationKeyList`,
    params
  );

  callback && callback(result);
  return result;
};

export const relocationKeyRemove = async (
  ids: string,
  callback?: (params: IFormatResult<any>) => void
) => {
  const result = await ApiRequest.post(`/cpay-admin/relocation/key/relocationKeyRemove`, {
    ids,
  });

  callback && callback(result);
  return result;
};

export const relocationKeyReset = async (
  ids: string,
  callback?: (params: IFormatResult<any>) => void
) => {
  const result = await ApiRequest.post(`/cpay-admin/relocation/key/relocationKeyReset`, {});

  callback && callback(result);
  return result;
};

export const relocationKeyAdd = async (
  params: FetchField.KeyList,
  callback?: (params: IFormatResult<any>) => void
): Promise<IResponseResult<any>> => {
  const result = await ApiRequest.post(
    `/cpay-admin/relocation/key/relocationKeyAdd`,
    params
  );

  callback && callback(result);
  return result;
};

export const relocationKeyEdit = async (
  params: FetchField.KeyList,
  callback?: (params: IFormatResult<any>) => void
): Promise<IResponseResult<any>> => {
  const result = await ApiRequest.post(
    `/cpay-admin/relocation/key/relocationKeyEdit`,
    params
  );

  callback && callback(result);
  return result;
};

export const getAllTerminalPosition = async (
  params: any
): Promise<IResponseResult<any>> => {
  const result = await ApiRequest.post(
    `/cpay-admin/relocation/monitor/getAllTerminalPosition`,
    params
  );
  return result;
};

export const relocationCurrentList = (params: any) =>
  ApiRequest.post(`/cpay-admin/relocation/current/relocationCurrentList`, params);

export const relocationCurrentExport = (params: any) =>
  ApiRequest.post(`/cpay-admin/relocation/current/relocationCurrentExport`, params);