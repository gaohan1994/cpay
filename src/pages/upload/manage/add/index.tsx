import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'antd/lib/form/Form';
import { Form, Button, Input, Row, Col, Upload, notification, Spin, Modal } from 'antd';
import { CustomFormItems, ButtonLayout, getCustomSelectFromItemData } from '@/component/custom-form';
import { useStore } from '@/pages/common/costom-hooks';
import { CustomCheckGroup } from '@/component/checkbox-group';
import { getUserDept } from '@/common/api';
import { useRedux, useSelectorHook } from '@/common/redux-util';
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
  useStore(['driver_type']);
  const history = useHistory();
  const [form] = useForm();
  const uploadRef: any = useRef();
  const typesRef: any = useRef();
  const [useSelector, dispatch] = useRedux();
  const common = useSelectorHook((state) => state.common);
  const [loading, setLoading] = useState(false);
  const [appIcon, setAppIcon] = useState('');
  const [apkFile, setApkFile] = useState({} as any);

  const {
    deiverTypeList,
    terminalFirmList,
    terminalFirmValue, setTerminalFirmValue,
    terminalTypeList,
    appInfo
  } = useFormSelectData({ ...form.getFieldsValue() }, form);

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

  const renderUpload = () => {
    return (
      <Row>
        <Col span={12}>
          <Input disabled={true} value={apkFile.name || ''} />
        </Col>
        <Col span={12}>
          <UploadApp
            uploadRef={uploadRef}
            maxSize='100M'
            renderButton={() =>
              <Button style={{ width: 120 }}>
                <UploadOutlined /> 上传应用包
              </Button>
            }
          />
        </Col>
      </Row>
    )
  }

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

  const forms = [
    {
      ...getCustomSelectFromItemData({
        label: '软件类型',
        key: 'type',
        list: deiverTypeList,
        valueKey: 'dictValue',
        nameKey: 'dictLabel',
        required: true,
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
      if (id) {
        param = {
          ...param,
          id
        }
        const res = await softInfoEdit(param);
        setLoading(false);
        if (res && res.code === RESPONSE_CODE.success) {
          notification.success({ message: '修改应用信息成功' });
          history.goBack();
        } else {
          notification.error({ message: res.msg || '修改应用信息失败，请重试' });
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
          notification.success({ message: '添加应用信息成功' });
          history.goBack();
        } else {
          notification.error({ message: res.msg || '添加应用信息失败，请重试' });
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
      </div>
    </Spin>

  )
}