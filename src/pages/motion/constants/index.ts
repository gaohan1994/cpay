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

export const relocationKeyList = async (
  params: Partial<FetchField.KeyList>,
  callback?: (params: IFormatResult<any>) => void
) => {
  const result = await ApiRequest.post(
    `/cpay-admin/relocation/key/list`,
    params
  );

  callback && callback(result);
  return result;
};

export const relocationKeyRemove = async (
  ids: string,
  callback?: (params: IFormatResult<any>) => void
) => {
  const result = await ApiRequest.post(`/cpay-admin/relocation/key/remove`, {
    ids,
  });

  callback && callback(result);
  return result;
};

export const relocationKeyReset = async (
  ids: string,
  callback?: (params: IFormatResult<any>) => void
) => {
  const result = await ApiRequest.post(`/cpay-admin/relocation/key/remove`, {
    ids,
  });

  callback && callback(result);
  return result;
};

export const relocationKeyAdd = async (
  params: FetchField.KeyList,
  callback?: (params: IFormatResult<any>) => void
): Promise<IResponseResult<any>> => {
  const result = await ApiRequest.post(
    `/cpay-admin/relocation/key/add`,
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
    `/cpay-admin/relocation/key/edit`,
    params
  );

  callback && callback(result);
  return result;
};
