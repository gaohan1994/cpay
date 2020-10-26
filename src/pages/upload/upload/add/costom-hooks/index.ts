/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-09-01 14:37:18 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-09-07 15:13:07
 * 
 * @todo 软件更新新增获取表单选择数据列表
 */
import { useEffect, useState } from 'react';
import { useTerminalFirmList, useTerminalTypeList, useTerminalGroupList } from '@/pages/common/costom-hooks/form-select';
import { useSelectorHook } from '@/common/redux-util';
import { DictDetailItem } from '@/pages/common/type';

export function useFormSelectData(props: any) {
  const state = useSelectorHook((state) => state.common.dictList);
  const common = useSelectorHook((state) => state.common);

  const { firmId } = props;
  const { terminalFirmList, setTerminalFirmList } = useTerminalFirmList();
  const [terminalFirmValue, setTerminalFirmValue] = useState('');
  const { terminalTypeList, setTerminalTypeList } = useTerminalTypeList(firmId || -1);
  const [terminalTypeValue, setTerminalTypeValue] = useState('');
  const [activateTypesList, setActivateTypesList] = useState([] as DictDetailItem[]);
  const [unionpayConnectionList, setUnionpayConnectionList] = useState([] as DictDetailItem[]);
  const [cupConnModeValue, setCupConnModeValue] = useState('');
  const [dccSupFlagList, setDccSupFlagList] = useState([] as DictDetailItem[]);
  const [dccSupFlagValue, setDccSupFlagValue] = useState('');
  const [bussTypeList, setBussTypeList] = useState([] as DictDetailItem[]);
  const [bussTypeValue, setBussTypeValue] = useState('');
  const [releaseTypeList, setReleaseTypeList] = useState([] as DictDetailItem[]);
  const [releaseTypeValue, setReleaseTypeValue] = useState('');
  const [deptTreeData, setDeptTreeData] = useState([] as any);
  const [deptId, setDeptId] = useState(-1);
  const { terminalGroupList, setTerminalGroupList } = useTerminalGroupList(deptId || -1);
  const [activateTypeList, setActivateTypeList] = useState([] as DictDetailItem[]);
  const [isGroupUpdateList, setIsGroupUpdateList] = useState([] as DictDetailItem[]);
  const [zzFlagList, setZzFlagList] = useState([] as DictDetailItem[]);
  const [zzFlagValue, setZzFlagValue] = useState('');

  useEffect(() => {
    setActivateTypesList(state.terminal_type && state.terminal_type.data || []);
    setUnionpayConnectionList(state.unionpay_connection && state.unionpay_connection.data || []);
    setBussTypeList(state.buss_type && state.buss_type.data || []);
    setDccSupFlagList(state.is_dcc_sup && state.is_dcc_sup.data || []);
    setReleaseTypeList(state.release_type && state.release_type.data || []);
    setActivateTypeList(state.activate_type && state.activate_type.data || []);
    setIsGroupUpdateList(state.is_group_update && state.is_group_update.data || []);
    setZzFlagList(state.zz_flag && state.zz_flag.data || []);
  }, [state]);

  useEffect(() => {
    setDeptTreeData(common.deptTreeData || []);
  }, [common.deptTreeData])

  return {
    terminalFirmList, setTerminalFirmList,
    terminalFirmValue, setTerminalFirmValue,
    terminalTypeList, setTerminalTypeList,
    terminalTypeValue, setTerminalTypeValue,
    activateTypesList, setActivateTypesList,
    unionpayConnectionList, setUnionpayConnectionList,
    cupConnModeValue, setCupConnModeValue,
    bussTypeList, setBussTypeList,
    bussTypeValue, setBussTypeValue,
    dccSupFlagList, setDccSupFlagList,
    dccSupFlagValue, setDccSupFlagValue,
    releaseTypeList, setReleaseTypeList,
    releaseTypeValue, setReleaseTypeValue,
    deptTreeData, setDeptTreeData,
    deptId, setDeptId,
    terminalGroupList, setTerminalGroupList,
    activateTypeList, setActivateTypeList,
    isGroupUpdateList, setIsGroupUpdateList,
    zzFlagList, setZzFlagList,
    zzFlagValue, setZzFlagValue
  };
}
