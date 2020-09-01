/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-09-01 13:52:44 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-09-01 14:02:56
 * 
 * @todo 软件新页面
 */
import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'antd/lib/form/Form';
import { Form, Button, Input, Row, Col, notification, Spin, Switch, message } from 'antd';
import { CustomFormItems, ButtonLayout, getCustomSelectFromItemData } from '@/component/custom-form';
import { useStore } from '@/pages/common/costom-hooks';
import { CustomCheckGroup } from '@/component/checkbox-group';
import { useFormSelectData } from './costom-hooks';
import { BASIC_CONFIG, RESPONSE_CODE } from '@/common/config';
import { useQueryParam } from '@/common/request-util';
import { useHistory } from 'react-router-dom';
import { softInfoEdit, softInfoAdd } from '../../constants/api';
import UploadApp from '@/pages/application/manage/component/UploadApp';
import { UploadOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const customFormLayout = {
  labelCol: {
    span: 3,
  },
  wrapperCol: {
    span: 16,
  },
}

export default function Page() {
  const id = useQueryParam('id');
  useStore(['driver_type', 'unionpay_connection', 'is_dcc_sup']);
  const history = useHistory();
  const [form] = useForm();
  const uploadRef: any = useRef();
  const typesRef: any = useRef();
  const [loading, setLoading] = useState(false);
  const [appIcon, setAppIcon] = useState('');
  const [apkFile, setApkFile] = useState({} as any);

  const {
    deiverTypeList,
    driverTypeValue, setDriverTypeValue,
    terminalFirmList,
    terminalFirmValue, setTerminalFirmValue,
    terminalTypeList,
    appInfo,
    unionpayConnectionList
  } = useFormSelectData({ ...form.getFieldsValue() }, form);

  /**
   * @todo 监听应用信息（上传应用以后获取到的应用信息）的改变
   */
  useEffect(() => {
    form.setFieldsValue({
      code: appInfo.appCode,
      versionName: appInfo.versionName,
      versionCode: appInfo.versionCode,
      iconPath: appInfo.iconPath,
      appName: appInfo.appName
    });
    if (typeof appInfo.iconPath === 'string' && appInfo.iconPath.length > 0) {
      setAppIcon(`${BASIC_CONFIG.SOURCE_URL}/${appInfo.iconPath}`);
    }
    if (uploadRef && uploadRef.current && uploadRef.current.file) {
      setApkFile(uploadRef.current.file);
    }
  }, [appInfo]);

  /**
   * @todo 渲染上传应用组件
   */
  const renderUpload = () => {
    return (
      <Row>
        <Col span={12}>
          <Input disabled={true} value={apkFile.name || ''} />
        </Col>
        <Col span={12}>
          {
            driverTypeValue && driverTypeValue.length > 0 ? (
              <UploadApp
                uploadRef={uploadRef}
                maxSize='100M'
                fileType={
                  driverTypeValue === '2' || driverTypeValue === '3'
                    ? { type: 'application/zip', message: '请上传zip类型文件' }
                    : {} as any
                }
                renderButton={() =>
                  <Button style={{ width: 120 }}>
                    <UploadOutlined /> 上传应用包
                  </Button>
                }
              />
            ) : (
                <Button style={{ width: 120 }} onClick={() => { message.error('请先选择软件类型') }}>
                  <UploadOutlined /> 上传应用包
                </Button>
              )
          }
        </Col>
      </Row>
    )
  }

  /**
   * @todo 渲染应用icon
   */
  const renderIcon = () => {
    if (typeof appIcon === 'string' && appIcon.length > 0) {
      return (
        <img
          src={appIcon}
          style={{ width: 80, height: 80, background: '#f2f2f2', borderRadius: 10 }}
        />
      )
    } else {
      return (
        <div style={{ width: 80, height: 80, background: '#f2f2f2', borderRadius: 10 }}></div>
      )
    }
  }

  /**
   * @todo 表单数据
   */
  const forms = [
    {
      ...getCustomSelectFromItemData({
        label: '软件类型',
        key: 'type',
        list: deiverTypeList,
        valueKey: 'dictValue',
        nameKey: 'dictLabel',
        required: true,
        value: driverTypeValue,
        onChange: (id: string) => {
          setDriverTypeValue(`${id}`);
        },
      })
    },
    {
      show: !id,
      label: '上传应用包',
      key: 'appUpload',
      requiredText: '请上传应用包',
      render: renderUpload,
      ...customFormLayout,
    },
    {
      label: '软件名称',
      key: 'appName',
      requiredType: 'input' as any,
    },
    {
      label: '软件编码',
      key: 'code',
      requiredText: '软件编码不能为空',
      render: () => <Input disabled />
    },
    {
      label: '应用版本',
      key: 'versionName',
      requiredText: '应用版本不能为空',
      render: () => <Input disabled />
    },
    {
      label: '内部版本',
      key: 'versionCode',
      requiredText: '内部版本不能为空',
      render: () => <Input disabled />
    },
    {
      label: '应用图标',
      key: 'iconPath',
      requiredText: '应用图标不能为空',
      render: renderIcon
    },
    {
      label: '是否支持DCC',
      key: 'dccSupFlag',
      requiredType: 'select',
      render: () => <Switch checkedChildren="是" unCheckedChildren="否" />
    },
    {
      ...getCustomSelectFromItemData({
        label: '银联间直连',
        key: 'cupConnMode',
        list: unionpayConnectionList,
        valueKey: 'dictValue',
        nameKey: 'dictLabel',
      })
    },
    {
      ...getCustomSelectFromItemData({
        label: '终端厂商',
        key: 'firmId',
        value: terminalFirmValue,
        onChange: (value: any) => {
          setTerminalFirmValue(value);
          if (typesRef && typesRef.current && typesRef.current.setCheckedList) {
            typesRef.current.setCheckedList([]);
          }
        },
        list: terminalFirmList,
        valueKey: 'id',
        nameKey: 'firmName',
        required: true
      })
    },
    {
      label: '终端型号',
      key: 'terminalTypes',
      requiredType: 'select',
      render: () =>
        <CustomCheckGroup
          list={terminalTypeList}
          valueKey={'typeCode'} nameKey={'typeName'}
          ref={typesRef}
          setForm={(checkedList: any[]) => { form.setFieldsValue({ 'terminalTypes': checkedList }) }}
        />,
    },
    {
      label: '版本更新说明',
      key: 'versionDescription',
      requiredType: 'input' as any,
      render: () => <TextArea />
    },
  ]

  const onSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log('Success:', values);
      const fields = form.getFieldsValue();
      let param: any = {
        ...fields,
        apkCopsSign: 0,
        iconPath: id
          ? `${BASIC_CONFIG.SOURCE_URL}/${appIcon.replace(`${BASIC_CONFIG.SOURCE_URL}/`, '')}`
          : appIcon.replace(`${BASIC_CONFIG.SOURCE_URL}/`, ''),
      }
      setLoading(true);
      if (typeof fields.dccSupFlag === 'boolean') {
        param = {
          ...param,
          dccSupFlag: fields.dccSupFlag ? 0 : 1
        }
      }
      if (id) {
        param = {
          ...param,
          id
        }
        const res = await softInfoEdit(param);
        setLoading(false);
        if (res && res.code === RESPONSE_CODE.success) {
          notification.success({ message: '软件信息修改成功' });
          history.goBack();
        } else {
          notification.error({ message: res.msg || '软件信息修改失败，请重试' });
        }
      } else {
        param = {
          ...param,
          appPath: appInfo.apkPath,
          appSize: appInfo.appSize,
          fileMd5: appInfo.signMd5,
        }
        const res = await softInfoAdd(param);
        setLoading(false);
        if (res && res.code === RESPONSE_CODE.success) {
          notification.success({ message: '软件信息新增成功' });
          history.goBack();
        } else {
          notification.error({ message: res.msg || '软件信息新增失败，请重试' });
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
          style={{ backgroundColor: 'white' }}
        >
          <CustomFormItems items={forms} singleCol={true} />
          <Form.Item {...ButtonLayout} >
            <Button type="primary" onClick={onSubmit}>
              保存
             </Button>
          </Form.Item>
        </Form>
      </div>
    </Spin>
  )
}