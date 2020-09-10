import { useEffect, useState } from 'react';
import { useTerminalFirmList, useTerminalTypeList, useTerminalGrouplList, useAppTypeList } from '@/pages/common/costom-hooks/form-select';
import { useSelectorHook } from '@/common/redux-util';
import { IUploadAppInfo } from '../../../types/index';
import { FormInstance } from 'antd/lib/form';
import numeral from 'numeral';

interface Props {
  firmId: number
}
export function useFormSelectData(props: any, form: FormInstance) {
  const app = useSelectorHook((state) => state.app);

  const { firmId, deptId } = props;
  const { terminalGroupList, setTerminalGroupList } = useTerminalGrouplList(deptId);
  const [terminalGroupValue, setTerminalGroupValue] = useState('');
  const { appTypeList, setAppTypeList } = useAppTypeList();
  const [appTypeValue, setAppTypeValue] = useState('');
  const { terminalFirmList, setTerminalFirmList } = useTerminalFirmList();
  const [terminalFirmValue, setTerminalFirmValue] = useState('');
  const { terminalTypeList, setTerminalTypeList } = useTerminalTypeList(firmId || -1);
  const [appInfo, setAppInfo] = useState({} as IUploadAppInfo)

  useEffect(() => {
    if (appTypeList.length > 0 && appTypeValue !== '') {
      let flag = false;
      for (let i = 0; i < appTypeList.length; i++) {
        if (appTypeList[i].id === numeral(appTypeValue).value()) {
          flag = true;
          break;
        }
      }
      if (!flag) {
        setAppTypeValue('');
        form.setFieldsValue({ typeId: undefined });
      }
    }
  }, [appTypeList, appTypeValue]);

  useEffect(() => {
    if (terminalGroupList.length > 0 && terminalGroupValue !== '') {
      let flag = false;
      for (let i = 0; i < terminalGroupList.length; i++) {
        if (terminalGroupList[i].id === numeral(terminalGroupValue).value()) {
          flag = true;
          break;
        }
      }
      if (!flag) {
        setTerminalGroupValue('');
        form.setFieldsValue({ groupId: undefined });
      }
    }
  }, [terminalGroupList, terminalGroupValue]);

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
    terminalGroupList, setTerminalGroupList,
    appTypeList, setAppTypeList,
    appTypeValue, setAppTypeValue,
    terminalFirmList, setTerminalFirmList,
    terminalFirmValue, setTerminalFirmValue,
    terminalTypeList, setTerminalTypeList,
    appInfo, setAppInfo,
    terminalGroupValue, setTerminalGroupValue
  };
}
