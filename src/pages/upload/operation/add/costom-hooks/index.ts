/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-09-01 14:13:13 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-09-01 14:13:40
 * 
 * @todo 远程运维新增获取表单选择数据列表
 */
import { useEffect, useState } from 'react';
import { useTerminalFirmList, useTerminalTypeList, useTerminalGroupList } from '@/pages/common/costom-hooks/form-select';
import { useSelectorHook } from '@/common/redux-util';
import { FormInstance } from 'antd/lib/form';
import numeral from 'numeral';
import { DictDetailItem } from '@/pages/common/type';

export function useFormSelectData(props: any, form: FormInstance) {
  const { firmId } = props;
  const state = useSelectorHook((state) => state.common.dictList);
  const common = useSelectorHook((state) => state.common);

  const [operatorCommandList, setOperatorCommandList] = useState([] as DictDetailItem[]);
  const { terminalFirmList, setTerminalFirmList } = useTerminalFirmList();
  const [terminalFirmValue, setTerminalFirmValue] = useState('');
  const { terminalTypeList, setTerminalTypeList } = useTerminalTypeList(firmId || -1);
  const [releaseTypeList, setReleaseTypeList] = useState([] as DictDetailItem[]);
  const [releaseTypeValue, setReleaseTypeValue] = useState('');
  const [deptTreeData, setDeptTreeData] = useState([] as any);
  const [deptId, setDeptId] = useState(-1);
  const { terminalGroupList, setTerminalGroupList } = useTerminalGroupList(deptId || -1);
  const [terminalGroupValue, setTerminalGroupValue] = useState('');
  const [isGroupUpdateList, setIsGroupUpdateList] = useState([] as DictDetailItem[]);

  useEffect(() => {
    setOperatorCommandList(state.terminal_operator_command && state.terminal_operator_command.data || []);
    setReleaseTypeList(state.release_type && state.release_type.data || []);
    setIsGroupUpdateList(state.is_group_update && state.is_group_update.data || []);
  }, [state]);

  useEffect(() => {
    setDeptTreeData(common.deptTreeData || []);
  }, [common.deptTreeData])

  useEffect(() => {
    if (terminalFirmList.length > 0 && terminalFirmValue !== '') {
      let flag = false;
      for (let i = 0; i < terminalFirmList.length; i++) {
        if (terminalFirmList[i].id === numeral(terminalFirmValue).value()) {
          flag = true;
          break;
        }
      }
      if (!flag) {
        setTerminalFirmValue('');
        form.setFieldsValue({ firmId: undefined });
      }
    }
  }, [terminalFirmList, terminalFirmValue]);

  return {
    operatorCommandList, setOperatorCommandList,
    terminalFirmList, setTerminalFirmList,
    terminalFirmValue, setTerminalFirmValue,
    terminalTypeList, setTerminalTypeList,
    releaseTypeList, setReleaseTypeList,
    releaseTypeValue, setReleaseTypeValue,
    deptTreeData, setDeptTreeData,
    deptId, setDeptId,
    terminalGroupList, setTerminalGroupList,
    terminalGroupValue, setTerminalGroupValue,
    isGroupUpdateList, setIsGroupUpdateList,
  };
}
