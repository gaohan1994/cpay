import React, { useState, useEffect } from 'react';
import { useSelectorHook } from '@/common/redux-util';
import { DictDetailItem } from '@/pages/common/type';
import { useFormSelectedList, useSoftVersionList } from '@/pages/common/costom-hooks/form-select';
import { taskSoftListByType } from '../../../constants/api';

export function useSoftInfoFromData(props: any) {
  const { firmId } = props;
  const state = useSelectorHook((state) => state.common.dictList);
  const [driverTypeList, setDriverTypeList] = useState([] as DictDetailItem[]);
  const [driverTypeValue, setDriverTypeValue] = useState('');
  const { softInfoList, setSoftInfoList } = useSoftInfo(driverTypeValue || -1);
  const [softInfoValue, setSoftInfoValue] = useState({} as any);
  const [downloadTaskTypeList, setDownloadTaskTypeList] = useState([] as DictDetailItem[]);
  const { softVersionList, setSoftVersionList } = useSoftVersionList(firmId || -1, softInfoValue.id || -1,);
  const [softVersionValue, setSoftVersionValue] = useState({} as any);

  useEffect(() => {
    setDriverTypeList(state.driver_type && state.driver_type.data || []);
    setDownloadTaskTypeList(state.download_task_type && state.download_task_type.data || [])
  }, [state]);

  return {
    driverTypeList, setDriverTypeList,
    driverTypeValue, setDriverTypeValue,
    softInfoList, setSoftInfoList,
    softInfoValue, setSoftInfoValue,
    downloadTaskTypeList, setDownloadTaskTypeList,
    softVersionList, setSoftVersionList,
    softVersionValue, setSoftVersionValue
  }
}

export function useSoftInfo(type: any) {
  const { list, setList } = useFormSelectedList(taskSoftListByType, [type], { type });
  const softInfoList: any[] = list;
  const setSoftInfoList = setList;
  return { softInfoList, setSoftInfoList };
}