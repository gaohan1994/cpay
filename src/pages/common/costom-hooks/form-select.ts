/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-08-21 09:32:49 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-08-26 15:45:44
 * 
 * @todo 用于表单选择的各种数据
 */
import React, { useState, useEffect } from 'react';
import { ITerminalFirmItem } from '@/pages/terminal/types';
import {
  terminalFirmList as getTerminalFirmList,
  terminalTypeListByFirm,
} from '@/pages/terminal/constants';
import { terminalGroupList as getTerminalGroupList } from '@/pages/terminal/group/constants';
import { getAppTypeList } from '@/pages/application/constants/api';
import { ITerminalGroupByDeptId } from '@/pages/terminal/message/types';
import ApiRequest, { jsonToQueryString } from '@/common/request-util';
import { RESPONSE_CODE } from '@/common/config';
import { taskSoftVersionListByType } from '@/pages/upload/constants/api';

export function useFormSelectedList(fetchFunc: Function, dependValue: any[], fetchFields: any) {
  const [list, setList] = useState([] as any[]);
  useEffect(() => {
    fetchFunc(fetchFields, (data: any[]) => {
      setList(data);
    });
  }, dependValue);
  return { list, setList };
}

export function useTerminalGrouplList(deptId: number) {
  const { list, setList } = useFormSelectedList(getTerminalGroupList, [deptId], { deptId });
  const terminalGroupList: any[] = list;
  const setTerminalGroupList = setList;
  return { terminalGroupList, setTerminalGroupList };
}

export function useTerminalFirmList() {
  const { list, setList } = useFormSelectedList(getTerminalFirmList, [], {});
  const terminalFirmList: any[] = list;
  const setTerminalFirmList = setList;
  return { terminalFirmList, setTerminalFirmList };
}

export function useTerminalTypeList(firmId: number) {
  const { list, setList } = useFormSelectedList(terminalTypeListByFirm, [firmId], { firmId });
  const terminalTypeList: any[] = list;
  const setTerminalTypeList = setList;
  return { terminalTypeList, setTerminalTypeList };
}

export function useAppTypeList() {
  const { list, setList } = useFormSelectedList(getAppTypeList, [], {});
  const appTypeList: any[] = list;
  const setAppTypeList = setList;
  return { appTypeList, setAppTypeList };
}

/**
 * 查询机构本级及上级组别列表
 * @param deptId
 */
export const terminalGroupListByDept = async (
  parma: any,
  callback?: (params: ITerminalGroupByDeptId[]) => void
): Promise<any> => {
  const result = await ApiRequest.get(
    `/cpay-admin/terminal/group/listByDept${jsonToQueryString(parma)}`
  );
  callback && result.code === RESPONSE_CODE.success && callback(result.data);
  return result;
};

export function useTerminalGroupList(deptId: number) {
  const { list, setList } = useFormSelectedList(terminalGroupListByDept, [deptId], { deptId });
  const terminalGroupList: any[] = list;
  const setTerminalGroupList = setList;
  return { terminalGroupList, setTerminalGroupList };
}

export function useSoftVersionList(firmId: number, appId: number) {
  const { list, setList } = useFormSelectedList(taskSoftVersionListByType, [firmId, appId], { firmId, appId });
  const softVersionList: any[] = list;
  const setSoftVersionList = setList;
  return { softVersionList, setSoftVersionList };
}

export function useCheckGroupData(list: any[], valueKey?: string) {
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);
  const [checkedList, setCheckedList] = useState([] as any[]);

  const onCheckAllChange = (e: any) => {
    if (e.target.checked) {
      let arr: number[] = [];
      for (let i = 0; i < list.length; i++) {
        arr.push(list[i][valueKey || 'id']);
      }
      setCheckedList(arr);
    } else {
      setCheckedList([]);
    }
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  }

  const onChange = (checkedList: any[]) => {
    setCheckedList(checkedList);
    setIndeterminate(!!checkedList.length && checkedList.length < list.length);
    setCheckAll(checkedList.length === list.length);
  }

  return {
    indeterminate, setIndeterminate,
    checkAll, setCheckAll,
    checkedList, setCheckedList,
    onCheckAllChange,
    onChange
  }
}