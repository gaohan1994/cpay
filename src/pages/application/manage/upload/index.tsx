import React, { useEffect, useState, useRef } from 'react';
import { Form, Row, Col, Input, Button, Upload, message, Select, Checkbox } from 'antd';
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
import { appInfoAdd, getAppTypeList } from '../../constants/api';
import { RESPONSE_CODE } from '../../../../common/config';
import { IAppType } from '../../types';
import history from '@/common/history-util';

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
    terminalFirmTypeOptions: [] as string[],
    appIcon: '',
    file: {} as any,
    key: '',
    appTypeList: [] as IAppType[],
    appTypeValue: '',
    indeterminate: false,
    checkAll: false,
    checkedList: [] as string[],
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
  const [terminalFirmTypeOptions, setTerminalFirmTypeOptions] = useState(
    initState.terminalFirmTypeOptions
  );
  const [appIcon, setAppIcon] = useState(initState.appIcon);
  const [file, setFile] = useState(initState.file);
  const [appTypeList, setAppTypeList] = useState(initState.appTypeList);
  const [appTypeValue, setAppTypeValue] = useState(initState.appTypeValue);
  const [indeterminate, setIndeterminate] = useState(initState.indeterminate);
  const [checkAll, setCheckAll] = useState(initState.checkAll);
  const [checkedList, setCheckedList] = useState(initState.checkedList);

  const [form] = Form.useForm();
  let uploadRef: any = useRef();

  /** 进入页面是获取组别列表以及应用类型列表 */
  useEffect(() => {
    getTerminalFirmList({}, setTerminalFirmList);
    form.setFieldsValue({
      appDept: '总行'
    });
    terminalGroupListByDept(100, (groupData) => {
      setTerminalGroup(groupData);
      setGroupValue(`${groupData[0].id}`);
    });
    getAppTypeList((typeList: any[]) => {
      setAppTypeList(typeList);
    });
  }, []);

  /** 监听上传的应用的应用信息，设置表单的值  */
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

  /** 监听终端厂商的值，获取终端类型列表 */
  useEffect(() => {
    if (terminalFirmValue.length > 0) {
      terminalTypeListByFirm({ firmId: terminalFirmValue }, setTerminalFirmTypeList);
    }
  }, [terminalFirmValue]);

  /** 监听终端类型列表的值，设置表单中的终端类型对应的checkgroup的options */
  useEffect(() => {
    let arr: string[] = [];
    for (let i = 0; i < terminalFirmTypeList.length; i++) {
      arr.push(terminalFirmTypeList[i].typeName);
    }
    setTerminalFirmTypeOptions(arr);
  }, [terminalFirmTypeList]);

  /** 监听终端类型选中列表，设置相应表单的值，如果不这样写，表单获取不到相应的值 */
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
  }, [checkedList])

  /** 终端类型checkbox的全选按钮点击事件 */
  const onCheckAllChange = (e: any) => {
    setCheckedList(e.target.checked ? terminalFirmTypeOptions : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  }

  /** 终端类型checkboxgroup的点击事件 */
  const onChange = (checkedList: any[]) => {
    setCheckedList(checkedList);
    setIndeterminate(!!checkedList.length && checkedList.length < terminalFirmTypeOptions.length);
    setCheckAll(checkedList.length === terminalFirmTypeOptions.length);
  }

  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
  };

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
    console.log('test bbb', fields, file, appInfo);
    let terminalTypes: string = '';
    for (let i = 0; i < checkedList.length; i++) {
      terminalTypes += checkedList[i];
      if (i !== checkedList.length - 1) {
        terminalTypes += ',';
      }
    }
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
      terminalTypes,
      typeId: fields.appType,
      versionCode: fields.appVersionCode,
      versionName: fields.appVersionName,
      versionDescription: fields.appUpdateDesc,
      picPaths: 'group1/M00/00/05/rB4KcF8qJXmAWFh5AABRWFdKDBo920.jpg;group1/M00/00/05/rB4KcF8qJXmASyDJAABlEkdafSY060.png;group1/M00/00/05/rB4KcF8qJXmAI2djAAIMQQhSxcg651.jpg'
    }
    const res = await appInfoAdd(params);
    if (res.code === RESPONSE_CODE.success) {
      message.success('添加应用信息成功');
      history.goBack();
    } else {
      message.error(res.msg || '添加应用信息失败，请重试');
    }
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
          {
            placeholder: '应用类别',
            formName: 'appType',
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
            terminalFirmTypeOptions.length > 0 && (
              <CheckboxGroup
                options={terminalFirmTypeOptions}
                value={checkedList}
                onChange={onChange}
                style={{ marginTop: 10 }}
              />
            )
          }
        </Col>
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
            <Input />
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