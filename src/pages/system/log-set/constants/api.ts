import { jsonToQueryString } from '@/common/request-util';
import ApiRequest from '@/common/request-util';
import { RESPONSE_CODE } from '@/common/config';
import { ACTION_TYPES_SYSTEM } from '../../reducers';
import { formatMenuTreeData } from '../../common';

/**
* @todo 查询日志配置列表
* @param params
*/
export async function taskLogSetList(params: any) {
  const res = await ApiRequest.post(`/cpay-admin/task/logSet/taskLogSetList`, params);
  return res;
}

/**
* @todo 新增日志配置
* @param param 
*/
export const taskLogSetAdd = (param: any) =>
  ApiRequest.post(`/cpay-admin/task/logSet/taskLogSetAdd`, param);

/**
* @todo 修改日志配置
* @param param 
*/
export const taskLogSetEdit = (param: any) =>
  ApiRequest.post(`/cpay-admin/task/logSet/taskLogSetEdit`, param);

/**
* @todo 删除日志配置
* @param param 
*/
export const taskLogSetRemove = (ids: string) =>
  ApiRequest.post(`/cpay-admin/task/logSet/taskLogSetRemove`, { ids });