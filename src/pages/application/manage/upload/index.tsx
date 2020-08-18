/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-08-10 14:50:09 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-08-13 11:32:52
 * 
 * @todo 应用上传页面
 */
import React, { useEffect, useState, useRef } from 'react';
import { Form, Row, Col, Input, Button, Upload, Select, Checkbox, notification, Modal, Spin } from 'antd';
import UploadApp from '../component/UploadApp';
import { renderCommonSelectForm } from '@/component/form/render';
import { FormItmeType } from '@/component/form/type';
import { ITerminalFirmItem, ITerminalType } from '@/pages/terminal/types';
import {
  terminalFirmList as getTerminalFirmList,
  terminalTypeListByFirm,
} from '@/pages/terminal/constants';
import { useSelectorHook, useRedux } from '@/common/redux-util';
import { BASIC_CONFIG } from '@/common/config';
import { ITerminalGroupByDeptId } from '@/pages/terminal/message/types';
import { terminalGroupListByDept } from '@/pages/terminal/message/constants/api';
import { appInfoAdd, getAppTypeList, appInfoDetail, appInfoEdit } from '../../constants/api';
import { RESPONSE_CODE } from '../../../../common/config';
import { IAppType, IAppInfoDetail } from '../../types';
import { PlusOutlined } from '@ant-design/icons';
import { formatSearch } from '@/common/request-util';
import { useHistory } from 'react-router-dom';
import numeral from 'numeral';
import { getUserDept } from '@/common/api';

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
  const app = useSelectorHook((state) => state.app);
  const common = useSelectorHook((state) => state.common);
  const [useSelector, dispatch] = useRedux();
  const history = useHistory();
  const { search } = history.location;
  const field = formatSearch(search);

  const initState = {
    deptId: -1, // 机构id
    terminalGroupList: [] as ITerminalGroupByDeptId[],  // 终端组别列表
    terminalGroupValue: '',                             // 终端组别选中的值
    terminalFirmList: [] as ITerminalFirmItem[],        // 终端厂商列表
    terminalFirmValue: '',                              // 终端厂商选中的值
    terminalTypeList: [] as ITerminalType[],            // 终端类型列表（与终端厂商有关）
    terminalTypeOptions: [] as string[],                // 终端类型列表选项
    appTypeList: [] as IAppType[],                      // 应用类型列表
    appTypeValue: '',                                   // 应用类型选中的值
    appIcon: '',                                        // 应用图标
    apkFile: {} as any,                                 // 上传的apk文件
    keyWord: '',                                        // 应用关键词
    indeterminate: false,                               // 复选框的全选按钮是否不定
    checkAll: false,                                    // 复选框是否全选
    checkedList: [] as string[],                        // 复选框列表
    imageFileList: [] as any[],                         // 图片文件列表
    previewImage: '',                                   // 当前预览文件
    previewVisible: false,                              // 预览modal是否显示
    previewTitle: '',                                   // 预览modal的标题
  }

  const [deptId, setDeptId] = useState(initState.deptId);
  const [terminalGroupList, setTerminalGroupList] = useState(initState.terminalGroupList);
  const [terminalGroupValue, setTerminalGroupValue] = useState(initState.terminalGroupValue);
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
  const [appTypeList, setAppTypeList] = useState(initState.appTypeList);
  const [appTypeValue, setAppTypeValue] = useState(initState.appTypeValue);
  const [indeterminate, setIndeterminate] = useState(initState.indeterminate);
  const [checkAll, setCheckAll] = useState(initState.checkAll);
  const [checkedList, setCheckedList] = useState(initState.checkedList);
  const [imageFileList, setImageFileList] = useState(initState.imageFileList);
  const [previewImage, setPreviewImage] = useState(initState.previewImage);
  const [previewVisible, setPreviewVisible] = useState(initState.previewVisible);
  const [previewTitle, setPreviewTitle] = useState(initState.previewTitle);
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();
  let uploadRef: any = useRef();

  /** 
   * @todo 进入页面是获取组别列表以及应用类型列表 
   */
  useEffect(() => {
    getUserDept(dispatch);

    /** 获取终端厂商列表 */
    getTerminalFirmList({}, (firmList: any[]) => {
      setTerminalFirmList(firmList);
    });

    /** 获取应用类型列表 */
    getAppTypeList({}, (typeList: any[]) => {
      setAppTypeList(typeList);
    });
  }, []);

  /**
   * @todo 监听用户所属机构的变化，将所属机构填入相应的表单（只在应用新增时监听，应用修改时详情里有对应
   * 的机构，不进行监听）
   */
  useEffect(() => {
    if (common.userDept && !field.id) {
      if (common.userDept.deptId && common.userDept.deptName) {
        setDeptId(common.userDept.deptId);
        form.setFieldsValue({
          appDept: common.userDept.deptName
        });
      }
    }
  }, [common.userDept]);

  /**
   * @todo 根据机构id获取终端组别列表
   */
  useEffect(() => {
    if (deptId > 0) {
      terminalGroupListByDept(deptId, (groupData) => {
        setTerminalGroupList(groupData);
      });
    }
  }, [deptId]);

  /**
   * @todo 监听应用类型列表和应用类型选中值的变化，当应用类型选中值不在应用类型列表中，需要清空应用选中类型
   */
  useEffect(() => {
    if (appTypeValue.length > 0 && appTypeList.length > 0) {
      let flag = false;
      for (let i = 0; i < appTypeList.length; i++) {
        console.log(appTypeList[i].id === numeral(appTypeValue).value());
        if (appTypeList[i].id === numeral(appTypeValue).value()) {
          flag = true;
          break;
        }
      }
      if (!flag) {
        setAppTypeValue('');
        form.setFieldsValue({ appType: undefined });
      }
    }
  }, [appTypeList, appTypeValue])

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
        form.setFieldsValue({ appTerminalFirm: undefined });
        setIndeterminate(false);
        setCheckAll(false);
        setCheckedList([]);
      }
    }
  }, [terminalFirmList, terminalFirmValue])

  /**
   * @todo 监听终端组别列表和终端组别选中值的变化，当终端组别选中值不在终端组别列表中，需要清空终端组别的选中值
   */
  useEffect(() => {
    if (terminalGroupValue.length > 0 && terminalGroupList.length > 0) {
      let flag = false;
      for (let i = 0; i < terminalGroupList.length; i++) {
        console.log(terminalGroupList[i].id === numeral(terminalGroupValue).value());
        if (terminalGroupList[i].id === numeral(terminalGroupValue).value()) {
          flag = true;
          break;
        }
      }
      if (!flag) {
        setTerminalGroupValue('');
        form.setFieldsValue({ appGroup: undefined });
      }
    }
  }, [terminalGroupList, terminalGroupValue])

  /** 
   * @todo 根据field.id判断是否为编辑页面，编辑页面需要获取应用详情，并设置相应的值 
   */
  useEffect(() => {
    if (field.id) {
      appInfoDetail(field.id, getDetailCallback);
    }
  }, [history.location.search]);

  /** 
   * @todo 监听上传的应用的应用信息，设置表单的值  
   */
  useEffect(() => {
    const appInfo = app.appInfo;
    console.log('appInfo', appInfo);
    form.setFieldsValue({
      appPackage: appInfo.appCode,
      appVersionName: appInfo.versionName,
      appVersionCode: appInfo.versionCode,
      appIcon: appInfo.iconPath,
      apkName: appInfo.appName
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
        appTerminalTypes: checkedList
      });
    } else {
      form.setFieldsValue({
        appTerminalTypes: ''
      });
    }
  }, [checkedList]);

  /**
   * @todo 获取到应用型详情的回调，设置各个form的值
   * @param result 
   */
  const getDetailCallback = (result: any) => {
    if (result && result.code === RESPONSE_CODE.success) {
      let detail: IAppInfoDetail = result.data;
      form.setFieldsValue({
        appPackage: detail.apkCode || '',
        appVersionName: detail.versionName || '',
        appVersionCode: detail.versionCode || '',
        apkName: detail.apkName || '',
        appKeyWord: detail.keyWord || '',
        appUpdateDesc: detail.versionDescription,
        appIntro: detail.apkDescription
      });
      if (detail.iconPath) {
        form.setFieldsValue({ appIcon: detail.iconPath || '' });
        setAppIcon(detail.iconPath);
      }

      if (detail.deptId) {
        setDeptId(detail.deptId);
        form.setFieldsValue({ appDept: detail.deptName });
      }

      if (detail.groupId) {
        setTerminalGroupValue(`${detail.groupId}`);
        form.setFieldsValue({ appGroup: `${detail.groupId}` });
      }

      if (detail.typeId) {
        setAppTypeValue(`${detail.typeId}`);
        form.setFieldsValue({ appType: `${detail.typeId}` });
      }

      if (detail.firmId) {
        setTerminalFirmValue(`${detail.firmId}`);
        form.setFieldsValue({ appTerminalFirm: `${detail.firmId}` });
      }
      if (detail.terminalTypes) {
        let arr: string[] = detail.terminalTypes.split(',');
        setCheckedList(arr);
      }
      if (detail.keyWord) {
        setKeyWord(detail.keyWord);
        form.setFieldsValue({ appKeyWord: detail.keyWord });
      }

      if (typeof detail.picPaths === 'string' && detail.picPaths.length > 0) {
        let fileList: any[] = [];
        const picArr: string[] = detail.picPaths.split(';');
        for (let i = 0; i < picArr.length; i++) {
          fileList.push({
            uid: `-${i + 1}`,
            name: 'image.png',
            status: 'done',
            url: picArr[i]
          })
        }
        if (fileList.length > 0) {
          setImageFileList(fileList);
          form.setFieldsValue({ appPics: fileList })
        }
      }
    } else {
      notification.warn(result.msg || '获取详情失败，请刷新页面重试');
    }
  }

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

    let picPaths: string[] = [];
    if (imageFileList.length < 3 || imageFileList.length > 5) {
      notification.error({ message: '请上传3-5张截图' });
    }
    for (let i = 0; i < imageFileList.length; i++) {
      let originPic = '';
      if (imageFileList[i].url) {
        originPic = imageFileList[i].url;
      } else if (imageFileList[i].response && imageFileList[i].response.data) {
        originPic = imageFileList[i].response.data;
      } else {
        continue;
      }
      let pic = field.id
        ? `${BASIC_CONFIG.SOURCE_URL}/${originPic.replace(`${BASIC_CONFIG.SOURCE_URL}/`, '')}`
        : originPic.replace(`${BASIC_CONFIG.SOURCE_URL}/`, '');
      picPaths.push(pic);
    }
    let params: any = {
      apkCode: fields.appPackage,
      apkCopsSign: 0,
      apkDescription: fields.appIntro,
      apkName: fields.appName,
      apkPath: appInfo.apkPath,
      appSize: appInfo.appSize,
      deptId: 100,
      deptName: '总行',
      firmId: fields.appTerminalFirm,
      groupId: fields.appGroup,
      iconPath: field.id
        ? `${BASIC_CONFIG.SOURCE_URL}/${appIcon.replace(`${BASIC_CONFIG.SOURCE_URL}/`, '')}`
        : appIcon.replace(`${BASIC_CONFIG.SOURCE_URL}/`, ''),
      keyWord: keyWord,
      signMd5: appInfo.signMd5,
      terminalTypes: checkedList.join(','),
      typeId: fields.appType,
      versionCode: fields.appVersionCode,
      versionName: fields.appVersionName,
      versionDescription: fields.appUpdateDesc,
      picPaths: picPaths.join(';'),
      permissions: appInfo.permissions,
    }
    if (field.id) {
      params = { ...params, id: field.id };
      setLoading(true);
      const res = await appInfoEdit(params);
      setLoading(false);
      if (res && res.code === RESPONSE_CODE.success) {
        notification.success({ message: '修改应用信息成功' });
        history.goBack();
      } else {
        notification.error({ message: res.msg || '修改应用信息失败，请重试' });
      }
    } else {
      setLoading(true);
      const res = await appInfoAdd(params);
      setLoading(false);
      if (res && res.code === RESPONSE_CODE.success) {
        notification.success({ message: '添加应用信息成功' });
        history.goBack();
      } else {
        notification.error({ message: res.msg || '添加应用信息失败，请重试' });
      }
    }

  }

  /**
   * @todo 上传组件
   */
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div className="ant-upload-text">上传</div>
    </div>
  );

  /**
   * @todo 预览操作
   * @param file 要预览的图片文件
   */
  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };

  /**
   * @todo 监听上传应用截组件改变的文件
   * @param param0 
   */
  const handleChange = ({ fileList }: any) => {
    let arr: any[] = [];
    for (let i = 0; i < fileList.length; i++) {
      let file = fileList[i];
      // 判断是否是图片
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      // 判断是否小于等于5M
      const isLt5M = file.size / 1024 / 1024 <= 5;
      if (isJpgOrPng && isLt5M) {
        arr.push(file);
      }
    }
    if (arr.length > 5) {
      notification.error({ message: '最多只能上传5张' });
      arr = arr.slice(0, 5);
    }
    setImageFileList(arr)
  };

  const beforeUpload = (file: any) => {
    // 判断是否是图片
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      notification.error({ message: '只能上传jpg或png文件' });
    }
    // 判断是否小于等于5M
    const isLt5M = file.size / 1024 / 1024 <= 5;
    if (!isLt5M) {
      notification.error({ message: '超过限制5M' });
    }
    return isJpgOrPng && isLt5M;
  }

  return (
    <Spin spinning={loading} style={{ backgroundColor: 'white' }}>
      <div style={{ paddingTop: '10px', }}>
        <Form
          form={form}
          name="advanced_search"
          className="ant-advanced-search-form"
          {...formLayout}
          style={{ backgroundColor: 'white' }}
        >
          {
            field.id ? null : (
              <Item label="上传应用包" name='appUpload' rules={[
                {
                  required: true,
                  message: '请上传应用包',
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
                      renderRequire={() =>
                        <div style={{ marginLeft: 10, whiteSpace: 'nowrap' }}>
                          (请上传不超过100M的APK)
                      </div>
                      } />
                  </Col>
                </Row>
              </Item>
            )
          }
          <Item label="应用名称" name='apkName' rules={[
            {
              required: true,
              message: '请输入应用名称',
            }]}
          >
            <Input />
          </Item>
          <Item label="应用包名" name='appPackage' rules={[
            {
              required: true,
              message: '应用包名不能为空',
            }]}
          >
            <Input disabled={true} />
          </Item>
          <Item label="应用版本" name='appVersionName' rules={[
            {
              required: true,
              message: '应用版本不能为空',
            }]}
          >
            <Input disabled={true} />
          </Item>

          <Item label="内部版本" name='appVersionCode' rules={[
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
          <Item label="所属机构" name='appDept'>
            <Input disabled={true} />
          </Item>
          <Item label="所属组别" name='appGroup' rules={[
            {
              required: true,
              message: '请选择所属组别',
            }]}
          >
            {renderCommonSelectForm(
              {
                placeholder: '所属组别',
                formName: 'groupId',
                formType: FormItmeType.Select,
                selectData:
                  (terminalGroupList &&
                    terminalGroupList.map((item) => {
                      return {
                        value: `${item.id}`,
                        title: `${item.name}`,
                      };
                    })) ||
                  [],
                value: terminalGroupValue,
                onChange: (id: string) => {
                  setTerminalGroupValue(`${id}`);
                },
                span: 24
              } as any, false
            )}
          </Item>

          <Item label="应用类别" name='appType' rules={[
            {
              required: true,
              message: '请选择应用类别',
            }]}
          >
            {renderCommonSelectForm(
              {
                placeholder: '应用类别',
                formName: 'typeName',
                formType: FormItmeType.Select,
                selectData:
                  (Array.isArray(appTypeList) &&
                    appTypeList.map((item) => {
                      return {
                        value: `${item.id}`,
                        title: `${item.typeName}`,
                      };
                    })) ||
                  [],
                value: appTypeValue,
                onChange: (id: string) => {
                  setAppTypeValue(`${id}`);
                }
                , span: 24
              } as any, false
            )}
          </Item>

          <Item label="终端厂商" name='appTerminalFirm' rules={[
            {
              required: true,
              message: '请选择终端厂商',
            }]}
          >
            {renderCommonSelectForm(
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

          <Item label="终端型号" name='appTerminalTypes' rules={[
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

          <Item label="应用截图" name='appPics' rules={[
            {
              required: true,
              message: '请上传3-5张应用图片',
            }]}
            labelCol={{ span: 3 }}
            wrapperCol={{ span: 16 }}
          >
            <Row style={{ alignItems: 'center' }} >
              <Upload
                action={`${BASIC_CONFIG.BASE_URL}/cpay-admin/file/upload/tmp`}
                listType="picture-card"
                fileList={imageFileList}
                beforeUpload={beforeUpload}
                onPreview={handlePreview}
                onChange={handleChange}
                multiple={true}
                withCredentials={true}
              >
                {imageFileList.length >= 5 ? null : uploadButton}
              </Upload>
              <div>3-5张截图，文件格式：png或jpg，分辨率建议：960*540，大小：单张不得超过5M。</div>
            </Row>
          </Item>
          <Item label="关键词" name='appKeyWord' rules={[
            {
              required: true,
              message: '请输入关键词',
            }]}
            labelCol={{ span: 3 }}
            wrapperCol={{ span: 16 }}
          >
            <Row style={{ alignItems: 'center' }} >
              <Col span={12}>
                <Input value={keyWord} onChange={({ target: { value } }) => setKeyWord(value)} />
              </Col>
              <div style={{ marginLeft: 10 }}> (多个关键词请以逗号分隔。)</div>
            </Row>
          </Item>

          <Item label="版本更新说明" name='appUpdateDesc' rules={[
            {
              required: true,
              message: '请输入版本更新说明',
            }]}
          >
            <TextArea />
          </Item>

          <Item label="应用简介" name='appIntro' rules={[
            {
              required: true,
              message: '请输入应用简介',
            }]}
          >
            <TextArea />
          </Item>

          <Item {...buttonLayout} >
            <Col>
              <Button type="primary" onClick={onSubmit}>
                保存
              </Button>
            </Col >
          </Item>

          <Modal
            visible={previewVisible}
            title={previewTitle}
            footer={null}
            onCancel={() => setPreviewVisible(false)}
          >
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          </Modal>
        </Form >
      </div>
    </Spin>
  );
};

function getBase64(file: any) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}