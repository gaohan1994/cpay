/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-09-01 13:35:18 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-09-01 13:37:20
 * 
 * @todo 提取日志新增获取表单选择数据列表
 */
import { useEffect, useState } from 'react';
import { useTerminalFirmList, useTerminalTypeList } from '@/pages/common/costom-hooks/form-select';
import { useSelectorHook } from '@/common/redux-util';
import { FormInstance } from 'antd/lib/form';
import numeral from 'numeral';
import { DictDetailItem } from '@/pages/common/type';

export function useFormSelectData(props: any, form: FormInstance) {
  const { firmId } = props;
  const state = useSelectorHook((state) => state.common.dictList);

  const { terminalFirmList, setTerminalFirmList } = useTerminalFirmList();
  const [terminalFirmValue, setTerminalFirmValue] = useState('');
  const { terminalTypeList, setTerminalTypeList } = useTerminalTypeList(firmId || -1);
  const [terminalTypeValue, setTerminalTypeValue] = useState('');
  const [logUploadTypeList, setLogUploadTypeList] = useState([] as DictDetailItem[]);
  const [logUploadTypeValue, setLogUploadTypeValue] = useState('');

  useEffect(() => {
    setLogUploadTypeList(state.log_upload_type && state.log_upload_type.data || []);
  }, [state]);

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
    terminalFirmList, setTerminalFirmList,
    terminalFirmValue, setTerminalFirmValue,
    terminalTypeList, setTerminalTypeList,
    terminalTypeValue, setTerminalTypeValue,
    logUploadTypeList, setLogUploadTypeList,
    logUploadTypeValue, setLogUploadTypeValue
  };
}
