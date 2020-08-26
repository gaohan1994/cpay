import React, { useEffect } from 'react';
import { Form, message, Input, Switch } from 'antd';
import { CustomFormItems, getCustomSelectFromItemData } from '@/component/custom-form';
import { useSoftInfoFromData } from './custom-hooks';
import { FormInstance } from 'antd/lib/form';

interface Props {
  form: FormInstance;
  firmId: any;
}
export function SoftInfoItem(props: Props) {
  const { form, firmId } = props;
  const {
    driverTypeList, setDriverTypeList,
    driverTypeValue, setDriverTypeValue,
    softInfoList, setSoftInfoList,
    softInfoValue, setSoftInfoValue,
    downloadTaskTypeList, setDownloadTaskTypeList,
    softVersionList, setSoftVersionList,
    softVersionValue, setSoftVersionValue
  } = useSoftInfoFromData({ firmId });

  useEffect(() => {
    setDriverTypeValue('');
    setSoftInfoList([]);
    setSoftInfoValue({});
    setSoftVersionList([]);
    setSoftVersionValue({});
  }, [firmId]);

  useEffect(() => {
    form.setFieldsValue({
      appCode: softInfoValue.code
    })
  }, [softInfoValue]);

  useEffect(() => {
    form.setFieldsValue({
      versionName: softVersionValue.versionName,
      terminalTypes: softVersionValue.terminalTypes
    })
  })

  const softInfoForms = [
    {
      ...getCustomSelectFromItemData({
        label: '软件类型',
        key: 'appType',
        list: driverTypeList,
        value: driverTypeValue,
        onChange: (id: string) => {
          if (!!!firmId) {
            message.error('请先选择终端厂商');
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
    {
      label: '是否依赖',
      key: 'isDependApp',
      required: true,
      render: () => <Switch defaultChecked={false}/>
    },
    {
      label: '支持终端型号',
      key: 'terminalTypes',
      render: () => <Input disabled />
    },
    
  ]
  return (
    <Form form={form}>
      <CustomFormItems items={softInfoForms} />
    </Form>
  )
}