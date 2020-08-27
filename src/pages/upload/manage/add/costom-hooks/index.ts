import { useEffect, useState } from 'react';
import { useTerminalFirmList, useTerminalTypeList, useTerminalGrouplList, useAppTypeList } from '@/pages/common/costom-hooks/form-select';
import { useSelectorHook } from '@/common/redux-util';
import { FormInstance } from 'antd/lib/form';
import numeral from 'numeral';
import { IUploadAppInfo } from '@/pages/application/types';
import { DictDetailItem } from '@/pages/common/type';

interface Props {
  firmId: number
}
export function useFormSelectData(props: any, form: FormInstance) {
  const app = useSelectorHook((state) => state.app);
  const state = useSelectorHook((state) => state.common.dictList);
  const { firmId } = props;
  const [deiverTypeList, setDriverTypeList] = useState([] as DictDetailItem[])
  const { terminalFirmList, setTerminalFirmList } = useTerminalFirmList();
  const [terminalFirmValue, setTerminalFirmValue] = useState('');
  const { terminalTypeList, setTerminalTypeList } = useTerminalTypeList(firmId || -1);
  const [appInfo, setAppInfo] = useState({} as IUploadAppInfo)

  useEffect(() => {
    setDriverTypeList(state.driver_type && state.driver_type.data || []);
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

  /** 
   * @todo 监听上传的应用的应用信息，设置表单的值  
   */
  useEffect(() => {
    setAppInfo(app.appInfo);
  }, [app.appInfo]);

  return {
    deiverTypeList, setDriverTypeList,
    terminalFirmList, setTerminalFirmList,
    terminalFirmValue, setTerminalFirmValue,
    terminalTypeList, setTerminalTypeList,
    appInfo, setAppInfo,
  };
}
