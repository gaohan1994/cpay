/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-09-01 14:35:11 
 * @Last Modified by: centerm.gaohan
 * @Last Modified time: 2020-10-16 11:17:54
 * 
 * @todo 软件信息表单
 */
import React, { useEffect, useState } from 'react';
import { Form, message, Input, Switch } from 'antd';
import { CustomFormItems, getCustomSelectFromItemData } from '@/component/custom-form';
import { useSoftInfoFromData } from './custom-hooks';
import { FormInstance } from 'antd/lib/form';

interface Props {
  form: FormInstance;
  commonValue: any;
  appIds: { appId: number, dependAppIds: string }[]
}
export function SoftInfoItem(props: Props) {
  const { form, commonValue, appIds } = props;
  const { firmId, cupConnMode, dccSupFlag, terminalTypes } = commonValue;
  const {
    driverTypeList, setDriverTypeList,
    driverTypeValue, setDriverTypeValue,
    softInfoList, setSoftInfoList,
    softInfoValue, setSoftInfoValue,
    downloadTaskTypeList, setDownloadTaskTypeList,
    softVersionList, setSoftVersionList,
    softVersionValue, setSoftVersionValue
  } = useSoftInfoFromData(commonValue);

  const [isDependApp, setIsDependApp] = useState(false);
  const initValue = form.getFieldsValue();

  useEffect(() => {
    if (initValue.appType === undefined) {
      setDriverTypeValue('');
    } else {
      setDriverTypeValue(initValue.appType);
    }
  }, [initValue]);

  useEffect(() => {
    if (!driverTypeValue || driverTypeValue.length === 0) {
      setSoftInfoValue({});
    }
  }, [driverTypeValue]);

  useEffect(() => {
    for (let i = 0; i < softInfoList.length; i++) {
      if (softInfoList[i].id === initValue.appId) {
        setSoftInfoValue(softInfoList[i]);
        break;
      }
    }
  }, [softInfoList])

  useEffect(() => {
    form.setFieldsValue({
      appCode: softInfoValue.code
    });
    if (!softInfoValue.id && !initValue.appId) {
      setSoftVersionList([]);
      setSoftVersionValue({});
    }
  }, [softInfoValue]);

  useEffect(() => {
    for (let i = 0; i < softVersionList.length; i++) {
      if (softVersionList[i].id === initValue.appVersionId) {
        setSoftVersionValue(softVersionList[i]);
      }
    }
  }, [softVersionList]);

  useEffect(() => {
    form.setFieldsValue({
      versionName: softVersionValue.versionName,
      terminalTypes: softVersionValue.terminalTypes
    })
  }, [softVersionValue]);

  const softInfoForms = [
    {
      ...getCustomSelectFromItemData({
        label: '软件类型',
        key: 'appType',
        list: driverTypeList,
        value: driverTypeValue,
        onChange: (id: string) => {
          if (firmId === undefined) {
            message.error('请先选择终端厂商');
            form.resetFields();
            return;
          }
          if (!(terminalTypes && terminalTypes.length > 0)) {
            message.error('请先选择终端型号');
            form.resetFields();
            return;
          }
          setDriverTypeValue(`${id}`);
        },
        valueKey: 'dictValue',
        nameKey: 'dictLabel',
        required: true
      })
    },
    {
      ...getCustomSelectFromItemData({
        label: '操作类型',
        key: 'actionType',
        list: downloadTaskTypeList,
        valueKey: 'dictValue',
        nameKey: 'dictLabel',
        required: true
      })
    },
    {
      ...getCustomSelectFromItemData({
        label: '软件名称',
        key: 'appId',
        list: softInfoList,
        valueKey: 'id',
        nameKey: 'appName',
        required: true,
        onChange: (id: any) => {
          if (isAppExit(id)) {
            form.setFieldsValue({
              appName: undefined,
              appId: undefined,
              appCode: undefined,
              appVersionId: undefined,
              versionName: undefined,
              terminalTypes: undefined,
            });
            setSoftInfoValue({});
            setSoftVersionValue({});
            setSoftVersionList([]);
            message.error('软件重复，请重新选择');
            return;
          }
          for (let i = 0; i < softInfoList.length; i++) {
            if (softInfoList[i].id === id) {
              setSoftInfoValue(softInfoList[i]);
              break;
            }
          }
        }
      })
    },
    {
      label: '软件包名',
      key: 'appCode',
      render: () => <Input disabled />
    },
    {
      ...getCustomSelectFromItemData({
        label: '软件内部版本',
        key: 'appVersionId',
        list: softVersionList,
        valueKey: 'id',
        nameKey: 'versionCode',
        required: true,
        onChange: (id: number) => {
          for (let i = 0; i < softVersionList.length; i++) {
            if (softVersionList[i].id === id) {
              setSoftVersionValue(softVersionList[i]);
              break;
            }
          }
        }
      })
    },
    {
      label: '应用版本',
      key: 'versionName',
      render: () => <Input disabled />
    },
    // {
    //   label: '是否依赖',
    //   key: 'isDependApp',
    //   required: true,
    //   render: () => <Switch checked={isDependApp} onChange={setIsDependApp} />
    // },
    {
      label: '支持终端型号',
      key: 'terminalTypes',
      render: () => <Input disabled />
    },
    // {
    //   ...getCustomSelectFromItemData({
    //     show: isDependApp,
    //     label: '依赖软件',
    //     key: 'dependAppIds',
    //     list: softInfoList,
    //     valueKey: 'id',
    //     nameKey: 'appName',
    //     required: true,
    //     // onChange: (id: any) => {
    //     //   for (let i = 0; i < softInfoList.length; i++) {
    //     //     if (softInfoList[i].id === id) {
    //     //       setSoftInfoValue(softInfoList[i]);
    //     //       break;
    //     //     }
    //     //   }
    //     // }
    //   })
    // },
  ];

  /**
   * @todo 判断选中软件是否已经存在
   * @param appId 
   */
  const isAppExit = (appId: number) => {
    for (let i = 0; i < appIds.length; i++) {
      if (appId === appIds[i].appId) {
        return true;
      }
    }
    return false;
  }

  return (
    <Form form={form}>
      <CustomFormItems items={softInfoForms} />
    </Form>
  )
}