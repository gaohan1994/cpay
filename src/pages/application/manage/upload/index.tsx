import React, { useEffect, useState, useRef } from 'react';
import { Form, Row, Col, Input, Button, Upload, message, Select } from 'antd';
import UploadApp from '../component/UploadApp';
import { renderCommonSelectForm, renderCascaderForm } from '@/component/form/render';
import { FormItmeType } from '@/component/form/type';
import { useStore } from '@/pages/common/costom-hooks';
import { ITerminalFirmItem, ITerminalType } from '@/pages/terminal/types';
import {
  terminalFirmList as getTerminalFirmList,
  terminalTypeListByFirm as getTerminalTypeListByFirm,
  terminalTypeListByFirm,
} from '@/pages/terminal/constants';
import { useSelectorHook } from '@/common/redux-util';
import { BASIC_CONFIG } from '@/common/config';
import { ITerminalGroupByDeptId } from '@/pages/terminal/message/types';
import { terminalGroupListByDept } from '@/pages/terminal/message/constants/api';
import { appInfoAdd } from '../../constants/api';

const { Item } = Form;
const { Option } = Select;
const { TextArea } = Input;

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
  useStore(['app_type']);
  // const history = useHistory();
  // useEffect(() => {
  //   const { search } = history.location;
  //   const field = formatSearch(search);
  //   if (field.id) {
  //     advertInfoDetail(field.id);
  //   }
  // }, [history.location.search]);

  const initState = {
    terminalGroup: [] as ITerminalGroupByDeptId[],
    groupValue: '',
    terminalFirmList: [] as ITerminalFirmItem[],
    terminalFirmValue: '',
    terminalFirmTypeList: [] as ITerminalType[],
    terminalFirmTypeValue: '',
    appIcon: '',
    file: {} as any,
    key: '',
  }

  const [terminalGroup, setTerminalGroup] = useState(initState.terminalGroup);
  const [groupValue, setGroupValue] = useState(initState.groupValue);
  const [terminalFirmList, setTerminalFirmList] = useState(
    initState.terminalFirmList
  );
  const [terminalFirmValue, setTerminalFirmValue] = useState(
    initState.terminalFirmValue
  );
  const [terminalFirmTypeList, setTerminalFirmTypeList] = useState(
    initState.terminalFirmTypeList
  );
  const [terminalFirmTypeValue, setTerminalFirmTypeValue] = useState(
    initState.terminalFirmTypeValue
  );
  const [appIcon, setAppIcon] = useState(initState.appIcon);
  const [file, setFile] = useState(initState.file);
  // const [keyWord, setKeyWord] = useState(initState.key);

  const [form] = Form.useForm();
  let uploadRef: any = useRef();

  useEffect(() => {
    getTerminalFirmList({}, setTerminalFirmList);
    form.setFieldsValue({
      appDept: '总行'
    });
    terminalGroupListByDept(100, (groupData) => {
      setTerminalGroup(groupData);
      setGroupValue(`${groupData[0].id}`);
    });
  }, []);

  useEffect(() => {
    const appInfo = app.appInfo;
    console.log('appInfo', appInfo);
    form.setFieldsValue({
      appPackage: appInfo.appCode,
      appVersionName: appInfo.versionName,
      appVersionCode: appInfo.versionCode,
      appIcon: appInfo.iconPath,
      appName: appInfo.appName
    });
    setAppIcon(appInfo.iconPath);
    if (uploadRef && uploadRef.current && uploadRef.current.file) {
      setFile(uploadRef.current.file);
    }
  }, [app.appInfo]);

  useEffect(() => {
    terminalTypeListByFirm({firmId: terminalFirmValue}, setTerminalFirmTypeList);
  }, [terminalFirmValue]);

  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
  };

  const onSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log('Success:', values);
      onAddAppInfo();
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }

  const onAddAppInfo = async () => {
    const fields = form.getFieldsValue();
    const appInfo = app.appInfo;
    console.log('test bbb', fields, file, appInfo);
    const params = {
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
      iconPath: appInfo.iconPath,
      keyWord: fields.appKeyWord,
      signMd5: appInfo.signMd5,
      termTypeId: fields.appTerminalType,
      typeId: fields.appType,
      versionCode: fields.appVersionCode,
      versionName: fields.appVersionName,
      versionDescription: fields.appUpdateDesc,
      picPaths: 'group1/M00/00/05/rB4KcF8qJXmAWFh5AABRWFdKDBo920.jpg;group1/M00/00/05/rB4KcF8qJXmASyDJAABlEkdafSY060.png;group1/M00/00/05/rB4KcF8qJXmAI2djAAIMQQhSxcg651.jpg'
    }
    const res = await appInfoAdd(params);
  }

  return (
    <Form
      form={form}
      name="advanced_search"
      className="ant-advanced-search-form"
      onFinish={onFinish}
      {...formLayout}
    >
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
            <Input disabled={true} value={file.name || ''} />
          </Col>
          <Col span={12}>
            <UploadApp uploadRef={uploadRef} maxSize='100M' />
          </Col>
        </Row>
      </Item>
      <Item label="应用名称" name='appName' rules={[
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
              src={`${BASIC_CONFIG.SOURCE_URL}/${appIcon}`}
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
              (terminalGroup &&
                terminalGroup.map((item) => {
                  return {
                    value: `${item.id}`,
                    title: `${item.remark}`,
                  };
                })) ||
              [],
            value: groupValue,
            onChange: (id: string) => {
              setGroupValue(`${id}`);
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
          { formName: 'appType', dictList: 'app_type', formType: FormItmeType.SelectCommon, span: 24 } as any, false
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

      <Item label="终端型号" name='appTerminalType' rules={[
        {
          required: true,
          message: '请选择终端型号',
        }]}
      >
        {renderCommonSelectForm(
          {
            placeholder: '终端型号',
            formName: 'groupId',
            formType: FormItmeType.Select,
            selectData:
              (terminalFirmTypeList &&
                terminalFirmTypeList.map((item) => {
                  return {
                    value: `${item.id}`,
                    title: `${item.typeName}`,
                  };
                })) ||
              [],
            value: terminalFirmTypeValue,
            onChange: (id: string) => {
              setTerminalFirmTypeValue(`${id}`);
            },
            span: 24
          } as any, false
        )}
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
            <Input/>
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
    </Form >
  );
};


// {
//   checked: false
//   id: 100
//   name: "总行"
//   pId: 0
//   title: "总行"
// }