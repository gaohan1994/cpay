import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'antd/lib/form/Form';
import { Form, Button, Input, Row, Col, Upload, notification, Spin, Modal } from 'antd';
import { CustomFormItems, ButtonLayout, getCustomSelectFromItemData } from '@/component/custom-form';
import { useStore } from '@/pages/common/costom-hooks';
import { CustomCheckGroup } from '@/component/checkbox-group';
import { getUserDept } from '@/common/api';
import { useRedux, useSelectorHook } from '@/common/redux-util';
import { useFormSelectData } from './costom-hooks';
import UploadApp from '../component/UploadApp';
import { BASIC_CONFIG, RESPONSE_CODE } from '@/common/config';
import { PlusOutlined } from '@ant-design/icons';
import { getBase64 } from '../../common/util';
import { useQueryParam } from '@/common/request-util';
import { merge } from 'lodash';
import { useDetail } from '@/pages/common/costom-hooks/use-detail';
import { appInfoDetail, appInfoEdit, appInfoAdd } from '../../constants/api';
import { useHistory } from 'react-router-dom';
import FixedFoot, { ErrorField } from '@/component/fixed-foot';

const { TextArea } = Input;

const customFormLayout = {
  labelCol: {
    span: 3,
  },
  wrapperCol: {
    span: 16,
  },
}

const fieldLabels = {
  appUpload: '上传应用包',
  apkName: '应用名称',
  apkCode: '应用包名',
  versionName: '应用版本',
  versionCode: '内部版本',
  appIcon: '应用图标',
  deptId: '所属机构',
  groupId: '所属组别',
  typeId: '应用类别',
  firmId: '终端厂商',
  terminalTypes: '终端型号',
  keyWord: '关键词',
  versionDescription: '版本更新说明',
  apkDescription: '应用简介',
  picPaths: '应用截图',
}

export default function Page() {
  const id = useQueryParam('id');
  useStore(['terminal_type']);
  const history = useHistory();
  const [form] = useForm();
  const uploadRef: any = useRef();
  const typesRef: any = useRef();
  const [useSelector, dispatch] = useRedux();
  const common = useSelectorHook((state) => state.common);
  const [loading, setLoading] = useState(false);
  const [deptId, setDeptId] = useState(-1);
  const [keyWord, setKeyWord] = useState('');
  const [appIcon, setAppIcon] = useState('');
  const [apkFile, setApkFile] = useState({} as any);
  const [imageFileList, setImageFileList] = useState([] as any[]);
  const [previewImage, setPreviewImage] = useState('');
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewTitle, setPreviewTitle] = useState('');
  const [error, setError] = useState<ErrorField[]>([]);

  const {
    terminalGroupList,
    setTerminalGroupValue,
    appTypeList,
    setAppTypeValue,
    terminalFirmList,
    terminalFirmValue, setTerminalFirmValue,
    terminalTypeList,
    appInfo
  } = useFormSelectData({ ...form.getFieldsValue(), deptId: deptId }, form);

  const { detail } = useDetail(id, appInfoDetail, setLoading);

  const initialValues = merge(
    {},
    (detail && detail) || {}
  );

  useEffect(() => {
    getUserDept(dispatch);
  }, []);

  useEffect(() => {
    if (common.userDept) {
      if (common.userDept.deptId && common.userDept.deptName) {
        setDeptId(common.userDept.deptId);
        form.setFieldsValue({
          deptId: common.userDept.deptName
        });
      }
    }
  }, [common.userDept]);

  useEffect(() => {
    form.setFieldsValue({
      apkCode: appInfo.appCode,
      versionName: appInfo.versionName,
      versionCode: appInfo.versionCode,
      appIcon: appInfo.iconPath,
      apkName: appInfo.appName
    });
    if (typeof appInfo.iconPath === 'string' && appInfo.iconPath.length > 0) {
      setAppIcon(`${BASIC_CONFIG.SOURCE_URL}/${appInfo.iconPath}`);
    }
    if (uploadRef && uploadRef.current && uploadRef.current.file) {
      setApkFile(uploadRef.current.file);
    }
  }, [appInfo]);

  useEffect(() => {
    form.setFieldsValue(initialValues);
    if (detail.iconPath) {
      form.setFieldsValue({ appIcon: detail.iconPath || '' });
      setAppIcon(detail.iconPath);
    }
    if (detail.deptId) {
      form.setFieldsValue({
        deptId: detail.deptName
      });
      setDeptId(detail.deptId);
    }
    if (detail.terminalTypes) {
      let arr: string[] = detail.terminalTypes.split(',');
      if (typesRef && typesRef.current && typesRef.current.setCheckedList) {
        typesRef.current.setCheckedList(arr);
      }
    }
    if (detail.keyWord) {
      setKeyWord(detail.keyWord);
    }
    if (detail.typeId) {
      setAppTypeValue(detail.typeId);
    }
    if (detail.groupId) {
      setTerminalGroupValue(detail.groupId);
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
        form.setFieldsValue({ picPaths: fileList })
      }
    }
  }, [detail])

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
            renderRequire={() =>
              <div style={{ marginLeft: 10, whiteSpace: 'nowrap' }}>
                (请上传不超过100M的APK)
              </div>
            } />
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

  /**
   * @todo 监听上传应用截组件改变的文件
   * @param param0 
   */
  const handleChange = ({ fileList }: any) => {
    let arr: any[] = [];
    for (let i = 0; i < fileList.length; i++) {
      let file = fileList[i];
      // 判断是否是图片
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.name === 'image.png';
      // 判断是否小于等于5M
      const isLt5M = file.size / 1024 / 1024 <= 5 || file.name === 'image.png';
      if (isJpgOrPng && isLt5M) {
        arr.push(file);
      }
    }
    if (arr.length > 5) {
      notification.error({ message: '最多只能上传5张' });
      arr = arr.slice(0, 5);
    }
    setImageFileList(arr);
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

  const renderImagePics = () => {
    return (
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
          {
            imageFileList.length >= 5 ? null : (
              <div>
                <PlusOutlined />
                <div className="ant-upload-text">上传</div>
              </div>
            )
          }
        </Upload>
        <div>3-5张截图，文件格式：png或jpg，分辨率建议：960*540，大小：单张不得超过5M。</div>
      </Row>
    )
  }

  const forms = [
    {
      show: !id,
      label: fieldLabels.appUpload,
      key: 'appUpload',
      requiredText: '请上传应用包',
      render: renderUpload,
      ...customFormLayout,
    },
    {
      label: fieldLabels.apkName,
      key: 'apkName',
      requiredType: 'input' as any,
    },
    {
      label: fieldLabels.apkCode,
      key: 'apkCode',
      requiredText: '应用包名不能为空',
      render: () => <Input disabled />
    },
    {
      label: fieldLabels.versionName,
      key: 'versionName',
      requiredText: '应用版本不能为空',
      render: () => <Input disabled />
    },
    {
      label: fieldLabels.versionCode,
      key: 'versionCode',
      requiredText: '内部版本不能为空',
      render: () => <Input disabled />
    },
    {
      label: fieldLabels.appIcon,
      key: 'appIcon',
      requiredText: '应用图标不能为空',
      render: renderIcon
    },
    {
      label: fieldLabels.deptId,
      key: 'deptId',
      requiredText: '所属机构不能为空',
      render: () => <Input disabled />
    },
    {
      ...getCustomSelectFromItemData({
        label: fieldLabels.groupId,
        key: 'groupId',
        list: terminalGroupList,
        valueKey: 'id',
        nameKey: 'name',
        required: true,
      })
    },
    {
      ...getCustomSelectFromItemData({
        label: fieldLabels.typeId,
        key: 'typeId',
        list: appTypeList,
        valueKey: 'id',
        nameKey: 'typeName',
        required: true,
      })
    },
    {
      ...getCustomSelectFromItemData({
        label: fieldLabels.firmId,
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
      label: fieldLabels.terminalTypes,
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
      label: fieldLabels.keyWord,
      key: 'keyWord',
      requiredType: 'input' as any,
      ...customFormLayout,
      render: () =>
        <Row style={{ alignItems: 'center' }} >
          <Col span={12}>
            <Input value={keyWord} onChange={({ target: { value } }) => setKeyWord(value)} />
          </Col>
          <div style={{ marginLeft: 10 }}> (多个关键词请以逗号分隔。)</div>
        </Row>
    },
    {
      label: fieldLabels.versionDescription,
      key: 'versionDescription',
      requiredType: 'input' as any,
      render: () => <TextArea />
    },
    {
      label: fieldLabels.apkDescription,
      key: 'apkDescription',
      requiredType: 'input' as any,
      render: () => <TextArea />
    },
    {
      label: fieldLabels.picPaths,
      key: 'picPaths',
      requiredText: '请上传3-5张截图',
      ...customFormLayout,
      render: renderImagePics
    },
  ]

  const onSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log('Success:', values);
      let picPaths: string[] = [];
      if (imageFileList.length < 3 || imageFileList.length > 5) {
        notification.error({ message: '请上传3-5张截图' });
        return;
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
        let pic = id
          ? `${BASIC_CONFIG.SOURCE_URL}/${originPic.replace(`${BASIC_CONFIG.SOURCE_URL}/`, '')}`
          : originPic.replace(`${BASIC_CONFIG.SOURCE_URL}/`, '');
        picPaths.push(pic);
      }
      const fields = form.getFieldsValue();
      let param: any = {
        ...fields,
        deptId,
        apkCopsSign: 0,
        iconPath: id
          ? `${BASIC_CONFIG.SOURCE_URL}/${appIcon.replace(`${BASIC_CONFIG.SOURCE_URL}/`, '')}`
          : appIcon.replace(`${BASIC_CONFIG.SOURCE_URL}/`, ''),
        picPaths: picPaths.join(';'),
      }
      setLoading(true);
      if (id) {
        param = {
          ...param,
          id
        }
        const res = await appInfoEdit(param);
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
          apkPath: appInfo.apkPath,
          appSize: appInfo.appSize,
          signMd5: appInfo.signMd5,
          permissions: appInfo.permissions,
        }
        const res = await appInfoAdd(param);
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
      setError(errorInfo.errorFields);
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
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={() => setPreviewVisible(false)}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
      <FixedFoot errors={error} fieldLabels={fieldLabels}>
        <Button type="primary" loading={loading} onClick={onSubmit}>
          发布
        </Button>
        <Button onClick={() => history.goBack()}>返回</Button>
      </FixedFoot>
    </Spin>

  )
}