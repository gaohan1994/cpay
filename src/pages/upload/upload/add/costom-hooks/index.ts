import { useEffect, useCallback, useState } from 'react';
import { IResponseResult } from '@/common/type';
import { RESPONSE_CODE } from '@/common/config';
import { ITerminalFirmItem } from '@/pages/terminal/types';
import {
  terminalFirmList as getTerminalFirmList,
  terminalTypeListByFirm,
} from '@/pages/terminal/constants';
import { useTerminalFirmList, useTerminalTypeList, useTerminalGroupList } from '@/pages/common/costom-hooks/form-select';
import { useSelectorHook } from '@/common/redux-util';
import { DictDetailItem, DictItem } from '@/pages/common/type';

interface Props {
  firmId: number
}
export function useFormSelectData(props: any) {
  const state = useSelectorHook((state) => state.common.dictList);
  const common = useSelectorHook((state) => state.common);

  const { firmId } = props;
  const { terminalFirmList, setTerminalFirmList } = useTerminalFirmList();
  const [terminalFirmValue, setTerminalFirmValue] = useState('');
  const { terminalTypeList, setTerminalTypeList } = useTerminalTypeList(firmId || -1);
  const [activateTypesList, setActivateTypesList] = useState([] as DictDetailItem[]);
  const [unionpayConnectionList, setUnionpayConnectionList] = useState([] as DictDetailItem[]);
  const [dccSupFlagList, setDccSupFlagList] = useState([] as DictDetailItem[]);
  const [bussTypeList, setBussTypeList] = useState([] as DictDetailItem[]);
  const [driverTypeList, setDriverTypeList] = useState([] as DictDetailItem[]);
  const [releaseTypeList, setReleaseTypeList] = useState([] as DictDetailItem[]);
  const [releaseTypeValue, setReleaseTypeValue] = useState('');
  const [deptTreeData, setDeptTreeData] = useState([] as any);
  const [deptId, setDeptId] = useState(-1);
  const { terminalGroupList, setTerminalGroupList } = useTerminalGroupList(deptId || -1);
  const [activateTypeList, setActivateTypeList] = useState([] as DictDetailItem[]);
  
  useEffect(() => {
    setActivateTypesList(state.terminal_type && state.terminal_type.data || []);
    setUnionpayConnectionList(state.unionpay_connection && state.unionpay_connection.data || []);
    setBussTypeList(state.buss_type && state.buss_type.data || []);
    setDriverTypeList(state.driver_type && state.driver_type.data || []);
    setDccSupFlagList(state.dcc_sup_flag && state.dcc_sup_flag.data || []);
    setReleaseTypeList(state.release_type && state.release_type.data || []);
    setActivateTypeList(state.activate_type && state.activate_type.data || []);
  }, [state]);

  useEffect(() => {
    setDeptTreeData(common.deptTreeData || []);
  }, [common.deptTreeData])

  return {
    terminalFirmList, setTerminalFirmList,
    terminalFirmValue, setTerminalFirmValue,
    terminalTypeList, setTerminalTypeList,
    activateTypesList, setActivateTypesList,
    unionpayConnectionList, setUnionpayConnectionList,
    bussTypeList, setBussTypeList,
    driverTypeList, setDriverTypeList,
    dccSupFlagList, setDccSupFlagList,
    releaseTypeList, setReleaseTypeList,
    releaseTypeValue, setReleaseTypeValue,
    deptTreeData, setDeptTreeData,
    deptId, setDeptId,
    terminalGroupList, setTerminalGroupList,
    activateTypeList, setActivateTypeList
  };
}
