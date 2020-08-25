import React, { useState, useEffect } from 'react';
import { useSelectorHook } from '@/common/redux-util';
import { DictDetailItem } from '@/pages/common/type';
import { useFormSelectedList } from '@/pages/common/costom-hooks/form-select';
import { taskSoftListByType } from '../../../constants/api';

export function useSoftInfoFromData(props: any) {
  // const { driverType } = props;
  const state = useSelectorHook((state) => state.common.dictList);
  const [driverTypeList, setDriverTypeList] = useState([] as DictDetailItem[]);
  const [driverTypeValue, setDriverTypeValue] = useState('');
  const { softInfoList, setSoftInfoList } = useSoftInfo(driverTypeValue);
  const [downloadTaskTypeList, setDownloadTaskTypeList] = useState([] as DictDetailItem[]);
  useEffect(() => {
    setDriverTypeList(state.driver_type && state.driver_type.data || []);
    setDownloadTaskTypeList(state.download_task_type && state.download_task_type.data || [])
  }, [state]);

  return {
    driverTypeList, setDriverTypeList,
    driverTypeValue, setDriverTypeValue,
    softInfoList, setSoftInfoList,
    downloadTaskTypeList, setDownloadTaskTypeList
  }
}

export function useSoftInfo(type: any) {
  const { list, setList } = useFormSelectedList(taskSoftListByType, [type], { type });
  const softInfoList: any[] = list;
  const setSoftInfoList = setList;
  return { softInfoList, setSoftInfoList };
}