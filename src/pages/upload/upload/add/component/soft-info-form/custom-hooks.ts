/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-09-01 14:29:51 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-09-01 14:34:56
 * 
 * @todo 软件更新软件信息获取表单选择数据列表
 */
import React, { useState, useEffect } from 'react';
import { useSelectorHook } from '@/common/redux-util';
import { DictDetailItem } from '@/pages/common/type';
import { useFormSelectedList, useSoftVersionList } from '@/pages/common/costom-hooks/form-select';
import { taskSoftListByType } from '../../../constants/api';

export function useSoftInfoFromData(props: any) {
  const { firmId, cupConnMode, dccSupFlag } = props;
  const state = useSelectorHook((state) => state.common.dictList);
  const [driverTypeList, setDriverTypeList] = useState([] as DictDetailItem[]);
  const [driverTypeValue, setDriverTypeValue] = useState('');
  const { softInfoList, setSoftInfoList } = useSoftInfo(firmId, cupConnMode, dccSupFlag, driverTypeValue);
  const [softInfoValue, setSoftInfoValue] = useState({} as any);
  const [downloadTaskTypeList, setDownloadTaskTypeList] = useState([] as DictDetailItem[]);
  const { softVersionList, setSoftVersionList } = useSoftVersionList(firmId || -1, softInfoValue.id || -1,);
  const [softVersionValue, setSoftVersionValue] = useState({} as any);

  useEffect(() => {
    setDriverTypeList(state.driver_type && state.driver_type.data || []);
  }, [state]);

  /**
   * @todo 操作类型可选列表是根据软件类型选中值而定
   */
  useEffect(() => {
    const download_task_type = state.download_task_type && state.download_task_type.data || [];
    switch (driverTypeValue) {
      case '0':
        setDownloadTaskTypeList(download_task_type);
        break;
      case '3':
      case '5': {
        let arr = [];
        for (let i = 0; i < download_task_type.length; i++) {
          if (download_task_type[i].dictValue === '0') {
            arr.push(download_task_type[i]);
          }
        }
        setDownloadTaskTypeList(arr);
        break;
      }
      case '1':
      case '2':
      case '4': {
        let arr = [];
        for (let i = 0; i < download_task_type.length; i++) {
          if (download_task_type[i].dictValue === '0' || download_task_type[i].dictValue === '2') {
            arr.push(download_task_type[i]);
          }
        }
        setDownloadTaskTypeList(arr);
        break;
      }
      default: setDownloadTaskTypeList([]);
    }
  }, [driverTypeValue, state.downloadTaskTypeList]);

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

/**
 * @todo 获取软件信息列表
 * @param firmId 
 * @param cupConnMode 
 * @param dccSupFlag 
 * @param type 
 */
export function useSoftInfo(firmId: any, cupConnMode: any, dccSupFlag: any, type: any) {
  const { list, setList } = useFormSelectedList(taskSoftListByType, [firmId, cupConnMode, dccSupFlag, type], { firmId, cupConnMode, dccSupFlag, type });
  const softInfoList: any[] = list;
  const setSoftInfoList = setList;
  return { softInfoList, setSoftInfoList };
}