/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-08-12 14:03:22 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-08-13 11:41:53
 * 
 * @todo 软件新增页面 
 */
import React, { useEffect, useState, useRef } from 'react';
import { Form, Row, Col, Input, Button, Upload, Select, Checkbox, notification, Modal, Spin } from 'antd';
import { renderSelectForm } from '@/component/form/render';
import { FormItmeType } from '@/component/form/type';
import { ITerminalFirmItem, ITerminalType } from '@/pages/terminal/types';
import {
  terminalFirmList as getTerminalFirmList,
  terminalTypeListByFirm,
} from '@/pages/terminal/constants';
import { useSelectorHook, useRedux } from '@/common/redux-util';
import { BASIC_CONFIG } from '@/common/config';
import { RESPONSE_CODE } from '../../../../common/config';
import { formatSearch } from '@/common/request-util';
import { useHistory } from 'react-router-dom';
import numeral from 'numeral';
import UploadApp from '@/pages/application/manage/component/UploadApp';
import { useStore } from '@/pages/common/costom-hooks';
import { UploadOutlined } from '@ant-design/icons';
import { ISoftAddField } from '../../types';
import { softInfoAdd, softInfoEdit } from '../../constants/api';

const { Item } = Form;
const { Option } = Select;
const { TextArea } = Input;
const CheckboxGroup = Checkbox.Group;

type Props = {};

const formLayout = {
  labelCol: {
    span: 3,
  },
  wrapperCol: {
    span: 8,
  },
}

const buttonLayout = {
  wrapperCol: {
    offset: 3,
    span: 16,
  }
}

export default (props: Props) => {
  // 请求dept数据
  useStore(['driver_type']);

  const app = useSelectorHook((state) => state.app);
  const common = useSelectorHook((state) => state.common);
  const [useSelector, dispatch] = useRedux();
  const history = useHistory();
  const { search } = history.location;
  const field = formatSearch(search);

  const initState = {
    driverTypeValue: '',
    terminalFirmList: [] as ITerminalFirmItem[],        // 终端厂商列表
    terminalFirmValue: '',                              // 终端厂商选中的值
    terminalTypeList: [] as ITerminalType[],            // 终端类型列表（与终端厂商有关）
    terminalTypeOptions: [] as string[],                // 终端类型列表选项
    appIcon: '',                                        // 应用图标
    apkFile: {} as any,                                 // 上传的apk文件
    keyWord: '',                                        // 应用关键词
    indeterminate: false,                               // 复选框的全选按钮是否不定
    checkAll: false,                                    // 复选框是否全选
    checkedList: [] as string[],                        // 复选框列表
  }

  const [driverTypeValue, setDriverTypeValue] = useState(initState.driverTypeValue);
  const [terminalFirmList, setTerminalFirmList] = useState(
    initState.terminalFirmList
  );
  const [terminalFirmValue, setTerminalFirmValue] = useState(
    initState.terminalFirmValue
  );
  const [terminalTypeList, setTerminalTypeList] = useState(
    initState.terminalTypeList
  );
  const [terminalTypeOptions, setTerminalTypeOptions] = useState(
    initState.terminalTypeOptions
  );
  const [appIcon, setAppIcon] = useState(initState.appIcon);
  const [apkFile, setApkFile] = useState(initState.apkFile);
  const [keyWord, setKeyWord] = useState(initState.keyWord);
  const [indeterminate, setIndeterminate] = useState(initState.indeterminate);
  const [checkAll, setCheckAll] = useState(initState.checkAll);
  const [checkedList, setCheckedList] = useState(initState.checkedList);
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();
  let uploadRef: any = useRef();

  /** 
   * @todo 进入页面是获取组别列表以及应用类型列表 
   */
  useEffect(() => {
    /** 获取终端厂商列表 */
    getTerminalFirmList({}, (firmList: any[]) => {
      setTerminalFirmList(firmList);
    });
  }, []);

  /**
   * @todo 监听终端厂商列表和终端厂商选中值的变化，当终端厂商选中值不在终端厂商列表中，需要清空终端厂商选中值
   */
  useEffect(() => {
    if (terminalFirmValue.length > 0 && terminalFirmList.length > 0) {
      let flag = false;
      for (let i = 0; i < terminalFirmList.length; i++) {
        console.log(terminalFirmList[i].id === numeral(terminalFirmValue).value());
        if (terminalFirmList[i].id === numeral(terminalFirmValue).value()) {
          flag = true;
          break;
        }
      }
      if (!flag) {
        setTerminalFirmValue('');
        form.setFieldsValue({ terminalTypes: undefined });
        setIndeterminate(false);
        setCheckAll(false);
        setCheckedList([]);
      }
    }
  }, [terminalFirmList, terminalFirmValue])

  /** 
   * @todo 监听上传的应用的应用信息，设置表单的值  
   */
  useEffect(() => {
    const appInfo = app.appInfo;
    console.log('appInfo', appInfo);
    form.setFieldsValue({
      code: appInfo.appCode,
      versionName: appInfo.versionName,
      versionCode: appInfo.versionCode,
      appIcon: appInfo.iconPath,
      appName: appInfo.appName
    });
    if (typeof appInfo.iconPath === 'string' && appInfo.iconPath.length > 0) {
      setAppIcon(`${BASIC_CONFIG.SOURCE_URL}/${appInfo.iconPath}`);
    }
    if (uploadRef && uploadRef.current && uploadRef.current.file) {
      setApkFile(uploadRef.current.file);
    }
  }, [app.appInfo]);

  /**
   * @todo 监听终端厂商的值，获取终端类型列表
   */
  useEffect(() => {
    if (terminalFirmValue.length > 0) {
      terminalTypeListByFirm({ firmId: terminalFirmValue }, setTerminalTypeList);
    }
  }, [terminalFirmValue]);

  /**
   * @todo 监听终端类型列表的值，设置表单中的终端类型对应的checkgroup的options
   */
  useEffect(() => {
    let arr: string[] = [];
    for (let i = 0; i < terminalTypeList.length; i++) {
      arr.push(terminalTypeList[i].typeName);
    }
    setTerminalTypeOptions(arr);
  }, [terminalTypeList]);

  /** 
   * @todo 监听终端类型选中列表，设置相应表单的值，如果不这样写，表单获取不到相应的值
   */
  useEffect(() => {
    if (checkedList.length > 0) {
      form.setFieldsValue({
        terminalTypes: checkedList
      });
    } else {
      form.setFieldsValue({
        terminalTypes: ''
      });
    }
  }, [checkedList]);

  /**
   * @todo 终端类型checkbox的全选按钮点击事件
   * @param e 
   */
  const onCheckAllChange = (e: any) => {
    setCheckedList(e.target.checked ? terminalTypeOptions : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  }

  /**
   * @todo 终端类型checkboxgroup的点击事件
   * @param checkedList 
   */
  const onChange = (checkedList: any[]) => {
    setCheckedList(checkedList);
    setIndeterminate(!!checkedList.length && checkedList.length < terminalTypeOptions.length);
    setCheckAll(checkedList.length === terminalTypeOptions.length);
  }

  /**
   * @todo 点击提交事件
   */
  const onSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log('Success:', values);
      onAddAppInfo();
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }

  /**
   * @todo 添加应用信息
   */
  const onAddAppInfo = async () => {
    const fields = form.getFieldsValue();
    const appInfo = app.appInfo;

    let params: ISoftAddField = {
      code: fields.code,
      appName: fields.appName,
      appPath: appInfo.apkPath,
      appSize: appInfo.appSize,
      firmId: fields.firmId,
      iconPath: field.id
        ? `${BASIC_CONFIG.SOURCE_URL}/${appIcon.replace(`${BASIC_CONFIG.SOURCE_URL}/`, '')}`
        : appIcon.replace(`${BASIC_CONFIG.SOURCE_URL}/`, ''),
      fileMd5: appInfo.signMd5,
      terminalTypes: checkedList.join(','),
      versionCode: fields.versionCode,
      versionName: fields.versionName,
      type: numeral(driverTypeValue).value(),
      description: fields.description,
      remark: fields.description,
    }
    if (field.id) {
      params = { ...params, id: field.id };
      setLoading(true);
      const res = await softInfoEdit(params);
      setLoading(false);
      if (res && res.code === RESPONSE_CODE.success) {
        notification.success({ message: '修改软件信息成功' });
        history.goBack();
      } else {
        notification.error({ message: res.msg || '修改软件信息失败，请重试' });
      }
    } else {
      setLoading(true);
      const res = await softInfoAdd(params);
      setLoading(false);
      if (res && res.code === RESPONSE_CODE.success) {
        notification.success({ message: '添加软件信息成功' });
        history.goBack();
      } else {
        notification.error({ message: res.msg || '添加软件信息失败，请重试' });
      }
    }
  }

  return (
    <Spin spinning={loading}>
      <div style={{ paddingTop: '10px', }}>
        <Form
          form={form}
          name="advanced_search"
          className="ant-advanced-search-form"
          {...formLayout}
          style={{ backgroundColor: 'white' }}
        >
          <Item label="软件类型" name='type' rules={[
            {
              required: true,
              message: '请选择软件类型',
            }]}
          >
            {renderSelectForm(
              {
                placeholder: '软件类型',
                formName: 'id',
                formType: FormItmeType.Select,
                selectData:
                  (common.dictList && common.dictList.driver_type && common.dictList.driver_type.data &&
                    common.dictList.driver_type.data.map((item: any) => {
                      return {
                        value: `${item.dictValue}`,
                        title: `${item.dictLabel}`,
                      };
                    })) ||
                  [],
                value: driverTypeValue,
                onChange: (id: string) => {
                  setDriverTypeValue(`${id}`);
                },
                span: 24
              } as any, false
            )}
          </Item>
          {
            field.id ? null : (
              <Item label="上传软件包" name='appUpload' rules={[
                {
                  required: true,
                  message: '请上传软件包',
                }]}
                labelCol={{ span: 3 }}
                wrapperCol={{ span: 16 }}
              >
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
              </Item>
            )
          }
          <Item label="软件名称" name='appName' rules={[
            {
              required: true,
              message: '请输入软件名称',
            }]}
          >
            <Input />
          </Item>
          <Item label="软件编码" name='code' rules={[
            {
              required: true,
              message: '如那件编码不能为空',
            }]}
          >
            <Input disabled={true} />
          </Item>
          <Item label="应用版本" name='versionName' rules={[
            {
              required: true,
              message: '应用版本不能为空',
            }]}
          >
            <Input disabled={true} />
          </Item>

          <Item label="内部版本" name='versionCode' rules={[
            {
              required: true,
              message: '内部版本不能为空',
            }]}
          >
            <Input disabled={true} />
          </Item>
          <Item label="应用图标" name='appIcon' rules={[
            {
              required: true,
              message: '应用图标不能为空',
            }]}
          >
            {
              typeof appIcon === 'string' && appIcon.length > 0 ? (
                <img
                  src={appIcon}
                  style={{ width: 80, height: 80, background: '#f2f2f2', borderRadius: 10 }}
                />
              ) : (
                  <div style={{ width: 80, height: 80, background: '#f2f2f2', borderRadius: 10 }}></div>
                )
            }
          </Item>
          <Item label="终端厂商" name='firmId' rules={[
            {
              required: true,
              message: '请选择终端厂商',
            }]}
          >
            {renderSelectForm(
              {
                placeholder: '终端厂商',
                formName: 'id',
                formType: FormItmeType.Select,
                selectData:
                  (terminalFirmList &&
                    terminalFirmList.map((item) => {
                      return {
                        value: `${item.id}`,
                        title: `${item.firmName}`,
                      };
                    })) ||
                  [],
                value: terminalFirmValue,
                onChange: (id: string) => {
                  setTerminalFirmValue(`${id}`);
                },
                span: 24
              } as any, false
            )}
          </Item>

          <Item label="终端型号" name='terminalTypes' rules={[
            {
              required: true,
              message: '请选择终端型号',
            }]}
          >
            <Col
              span={24}
              style={{
                borderRadius: 2,
                border: '1px solid #d9d9d9',
                padding: 10,
                display: 'flex',
                flexDirection: 'column',
                width: '100%'
              }}
            >
              <div>
                <Checkbox
                  indeterminate={indeterminate}
                  onChange={onCheckAllChange}
                  checked={checkAll}
                >
                  全选
                </Checkbox>
              </div>
              {
                terminalTypeOptions.length > 0 && (
                  <CheckboxGroup
                    options={terminalTypeOptions}
                    value={checkedList}
                    onChange={onChange}
                    style={{ marginTop: 10 }}
                  />
                )
              }
            </Col>
          </Item>
          <Item label="版本更新说明" name='description' rules={[
            {
              required: true,
              message: '请输入版本更新说明',
            }]}
          >
            <TextArea />
          </Item>
        </Form >
        <Item {...buttonLayout} >
          <Col>
            <Button type="primary" onClick={onSubmit}>
              保存
            </Button>
          </Col >
        </Item>
      </div>
    </Spin>
  );
};
