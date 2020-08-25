import React from 'react';
import { Form, message, Input } from 'antd';
import { CustomFormItems, getCustomSelectFromItemData } from '@/component/custom-form';
import { useSoftInfoFromData } from './custom-hooks';

interface Props {
  form: any;
  firmId: any;
}
export function SoftInfoItem(props: Props) {
  const { form, firmId } = props;
  const {
    driverTypeList, setDriverTypeList,
    driverTypeValue, setDriverTypeValue,
    softInfoList, setSoftInfoList,
    downloadTaskTypeList, setDownloadTaskTypeList
  } = useSoftInfoFromData(form.getFieldsValue());
  const softInfoForms = [
    {
      ...getCustomSelectFromItemData({
        label: '软件类型',
        key: 'driver_type',
        list: driverTypeList,
        value: driverTypeValue,
        setValue: setDriverTypeValue,
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
        key: 'soft_name',
        list: softInfoList,
        valueKey: 'id',
        nameKey: 'appName',
        required: true
      })
    },
    {
      label: '软件包名',
      key: 'appCode',
      render: () => <Input disabled />
    },
    {
      label: '软件内部版本',
      key: 'versionCode',
      render: () => <Input disabled />
    },
    {
      label: '应用版本',
      key: 'versionName',
      render: () => <Input disabled />
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