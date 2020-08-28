import React, { useState, useEffect } from 'react';
import { Spin, Form, Button, DatePicker, message, notification } from 'antd';
import { useStore } from '@/pages/common/costom-hooks';
import { useFormSelectData } from './costom-hooks';
import { useForm } from 'antd/lib/form/Form';
import { CustomFormItems, ButtonLayout, getCustomSelectFromItemData } from '@/component/custom-form';
import { TableTusns } from '../../component/table.tusns';
import { CustomFromItem } from '@/common/type';
import moment from 'moment';
import { FormTusns } from '../../component/from-tusns';
import { useQueryParam } from '@/common/request-util';
import { useDetail } from '@/pages/common/costom-hooks/use-detail';
import { taskUploadJobDetail, taskUploadJobEdit, taskUploadJobAdd } from '../../constants/api';
import { merge } from 'lodash';
import { RESPONSE_CODE } from '@/common/config';
import { useHistory } from 'react-router-dom';

export default function Page() {
  const id = useQueryParam('id');
  useStore(['log_upload_type']);
  const [form] = useForm();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [tusnsOptions, setTusnsOptions] = useState([]);

  const {
    terminalFirmList, setTerminalFirmList,
    terminalFirmValue, setTerminalFirmValue,
    terminalTypeList, setTerminalTypeList,
    logUploadTypeList, setLogUploadTypeList,
    logUploadTypeValue, setLogUploadTypeValue
  } = useFormSelectData({ ...form.getFieldsValue() }, form);

  const { detail } = useDetail(id, taskUploadJobDetail, setLoading);

  const initialValues = merge(
    {},
    (detail && detail) || {}
  );

  useEffect(() => {
    form.setFieldsValue({ 'tusns': tusnsOptions.join(';') });
  }, [tusnsOptions]);

  useEffect(() => {
    form.setFieldsValue(initialValues);
    if (typeof detail.type === 'number') {
      form.setFieldsValue({ type: `${detail.type}` })
      setLogUploadTypeValue(`${detail.type}`);
    }
    if (detail.logBeginTime) {
      form.setFieldsValue({ logBeginTime: moment(detail.logBeginTime) });
    }
    if (detail.logEndTime) {
      form.setFieldsValue({ logEndTime: moment(detail.logEndTime) });
    }
    if (detail.validStartTime) {
      form.setFieldsValue({ validStartTime: moment(detail.validStartTime) });
    }
    if (detail.validEndTime) {
      form.setFieldsValue({ validEndTime: moment(detail.validEndTime) });
    }
    if (detail.tusns) {
      setTusnsOptions(detail.tusns.split(';'))
    }
  }, [detail]);


  /**
   * @todo 新增终端操作
   */
  const onAddTerminals = () => {
    if (terminalFirmValue.length === 0) {
      message.error('请选择终端厂商');
      return;
    }
    const terminalType = form.getFieldValue('terminalType');
    if (terminalType && terminalType.length === 0) {
      message.error('请选择终端型号');
      return;
    }

    setModalVisible(true)
  }

  const forms: CustomFromItem[] = [
    {
      label: '任务名称',
      key: 'jobName',
      requiredType: 'input' as any,
    },
    {
      ...getCustomSelectFromItemData({
        label: '日志提取方式',
        key: 'type',
        list: logUploadTypeList,
        valueKey: 'dictValue',
        nameKey: 'dictLabel',
        required: true,
        value: logUploadTypeValue,
        setValue: setLogUploadTypeValue
      })
    },
    {
      label: '应用包名',
      key: 'appCode',
      requiredType: 'input' as any,
    },
    {
      ...getCustomSelectFromItemData({
        label: '终端厂商',
        key: 'firmId',
        value: terminalFirmValue,
        list: terminalFirmList,
        valueKey: 'id',
        nameKey: 'firmName',
        required: true,
        onChange: (id: any) => {
          setTerminalFirmValue(id);
          form.setFieldsValue({ 'terminalType': undefined });
        }
      })
    },
    {
      ...getCustomSelectFromItemData({
        label: '终端型号',
        key: 'terminalType',
        list: terminalTypeList,
        valueKey: 'typeCode',
        nameKey: 'typeName',
        required: true,
      })
    },
    {
      label: '有效起始日期',
      key: 'validStartTime',
      render: () => renderDate('请选择有效起始日期', true),
      requiredType: 'select' as any
    },
    {
      label: '有效截止日期',
      key: 'validEndTime',
      render: () => renderDate('请选择有效截止日期', true),
      requiredType: 'select' as any
    },
    {
      label: '日志起始日期',
      key: 'logBeginTime',
      render: () => renderDate('请选择日志起始日期', false),
      requiredType: 'select' as any
    },
    {
      label: '日志结束日期',
      key: 'logEndTime',
      render: () => renderDate('请选择日志结束日期', false),
      requiredType: 'select' as any
    },
    {
      label: '终端集合',
      key: 'tusns',
      requiredType: 'select',
      render: () => <FormTusns options={tusnsOptions} setOptions={setTusnsOptions} onAddTerminals={onAddTerminals} />
    }
  ]

  /**
   * @todo 渲染日期组件
   * @param text 
   * @param time 
   */
  function renderDate(text: string, time?: boolean) {
    if (time) {
      return (
        <DatePicker
          format="YYYY-MM-DD HH:mm:ss"
          style={{ width: '100%' }}
          // disabledDate={current => disabledDate(current, 'VALID_END')}
          // disabledTime={current => disabledDateTime(current, 'VALID_END')}
          showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
          placeholder={text}
        />
      )
    } else {
      return (
        <DatePicker
          format="YYYY-MM-DD"
          style={{ width: '100%' }}
          // disabledDate={current => disabledDate(current, 'VALID_START')}
          // disabledTime={current => disabledDateTime(current, 'VALID_START')}
          placeholder={text}
        />
      )
    }
  }

  /**
   * @todo 提交
   */
  const onSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log('Success:', values);
      const fields = form.getFieldsValue();
      if (fields.logBeginTime.diff(fields.logEndTime) >= 0) {
        notification.error({ message: '日志结束日期必须大于日志开始日期' });
        return;
      }

      if (fields.validStartTime.diff(fields.validEndTime) >= 0) {
        notification.error({ message: '有效截止日期必须大于有效起始日期' });
        return;
      }
      let param: any = {
        ...fields,
        logBeginTime: fields.logBeginTime.format('YYYY-MM-DD'),
        logEndTime: fields.logEndTime.format('YYYY-MM-DD'),
        validStartTime: fields.validStartTime.format('YYYY-MM-DD HH:mm:ss'),
        validEndTime: fields.validEndTime.format('YYYY-MM-DD HH:mm:ss'),
      }
      setLoading(true);
      if (id) {
        param = {
          ...param,
          id
        }
        const res = await taskUploadJobEdit(param);
        setLoading(false);
        if (res && res.code === RESPONSE_CODE.success) {
          notification.success({ message: '修改终端提取日志成功' });
          history.goBack();
        } else {
          notification.error({ message: res.msg || '修改终端提取日志失败，请重试' });
        }
      } else {
        param = {
          ...param,
        }
        const res = await taskUploadJobAdd(param);
        setLoading(false);
        if (res && res.code === RESPONSE_CODE.success) {
          notification.success({ message: '新增终端提取日志成功' });
          history.goBack();
        } else {
          notification.error({ message: res.msg || '新增终端提取日志失败，请重试' });
        }
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }

  return (
    <Spin spinning={loading}>
      <div style={{ paddingTop: 10 }}>
        <Form
          form={form}
          className="ant-advanced-search-form"
        >
          <CustomFormItems items={forms} singleCol={true} />
          <Form.Item {...ButtonLayout} >
            <Button type="primary" onClick={onSubmit}>
              保存
          </Button>
          </Form.Item>
        </Form>
        <TableTusns
          visible={modalVisible}
          hideModal={() => setModalVisible(false)}
          fetchParam={{ firmId: terminalFirmValue, terminalTypeCodes: form.getFieldValue('terminalType') }}
          setOptions={setTusnsOptions}
          options={tusnsOptions}
        />
      </div>
    </Spin>
  )
}