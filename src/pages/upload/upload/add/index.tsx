import React, { useRef, useEffect, useState } from 'react';
import { useQueryParam, jsonToQueryString } from '@/common/request-util';
import { merge, forIn } from 'lodash';
import { Form, Input, Col, Row, Divider, Button, Card, Switch, DatePicker, Spin, message } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useFormSelectData } from './costom-hooks';
import { getFormCommonRules } from '../../common/util';
import { taskDownloadJobDetail, taskDownloadJobAdd } from '../constants/api';
import { ITerminalFirmItem, ITerminalType } from '@/pages/terminal/types';
import { CustomCheckGroup } from '@/component/checkbox-group';
import { useStore } from '@/pages/common/costom-hooks';
import { CustomFromItem } from '@/common/type';
import { getCustomSelectFromItemData, CustomFormItems } from '@/component/custom-form';
import { SoftInfoItem } from './component/soft-info-form';
import { useDetail } from '@/pages/common/costom-hooks/use-detail';
import { CustomRadioGroup } from '@/component/radio-group';
import moment from 'moment';
import { renderTreeSelect } from '@/component/form/render';
import { FormItmeType } from '@/component/form/type';
import { FormTusns } from '../../component/from-tusns';
import { TableTusns } from '../../component/table.tusns';
import numeral from 'numeral';

const groupFilterTypeList = [{ value: 0, label: '无' }, { value: 1, label: '指定' }, { value: 2, label: '排除' }]

const FormItemLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 14
  }
}

const ButtonLayout = {
  wrapperCol: {
    offset: 3,
    span: 16,
  }
}

export default function Page() {
  const id = useQueryParam('id');
  const type = useQueryParam('type');
  const [form] = useForm();
  const [softFrom1] = useForm();
  const [softFrom2] = useForm();
  const [softFrom3] = useForm();
  const [softFrom4] = useForm();
  const [softFrom5] = useForm();
  const softFroms = [softFrom1, softFrom2, softFrom3, softFrom4, softFrom5];
  useStore(['terminal_type', 'unionpay_connection', 'buss_type',
    'is_support_dcc', 'driver_type', 'dcc_sup_flag',
    'download_task_type', 'release_type', 'activate_type']);

  const [softInfoFormsNum, setSoftInfoFormsNum] = useState(1);
  const [validDateShow, setValidDateShow] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [tusnsOptions, setTusnsOptions] = useState([]);
  const [groupFilterTypeValue, setGroupFilterTypeValue] = useState(0);

  useEffect(() => {
    form.setFieldsValue({ 'tusns': tusnsOptions });
  }, [tusnsOptions])
  /**
   * 第一步初始化数据
   * 第二步
   * 1、新增则
   */
  const { detail } = useDetail(id, taskDownloadJobDetail);

  const initialValues = merge(
    {},
    (detail && detail) || {}
  );
  const {
    terminalFirmList,
    terminalFirmValue, setTerminalFirmValue,
    terminalModelList,
    terminalTypeList,
    unionpayConnectionList,
    bussTypeList,
    driverTypeList,
    dccSupFlagList, setDccSupFlagList,
    releaseTypeList, setReleaseTypeList,
    releaseTypeValue, setReleaseTypeValue,
    deptTreeData, setDeptTreeData,
    deptId, setDeptId,
    terminalGroupList, setTerminalGroupList,
    activateTypeList, setActivateTypeList
  } = useFormSelectData(form.getFieldsValue());

  /**
   * @todo 终端信息表单项
   */
  const terminalInfoForms: CustomFromItem[] = [
    {
      label: '任务名称',
      key: 'jobName',
      requiredType: 'input'
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
          form.setFieldsValue({ 'terminalTypes': [] });
          for (let i = 0; i < softFroms.length; i++) {
            softFroms[i].resetFields();
            setSoftInfoFormsNum(1);
          }
        }
      })
    },
    {
      label: '终端型号',
      key: 'terminalTypes',
      requiredType: 'select',
      render: () =>
        <CustomCheckGroup
          list={terminalModelList}
          valueKey={'id'} nameKey={'typeName'}
          setForm={(checkedList: any[]) => { form.setFieldsValue({ 'terminalTypes': checkedList }) }}
        />
    },
    {
      label: '终端类型',
      key: 'activateTypes',
      requiredType: 'select',
      render: () =>
        <CustomCheckGroup
          list={terminalTypeList}
          valueKey={'dictValue'} nameKey={'dictLabel'}
          setForm={(value: any[]) => { form.setFieldsValue({ 'activateTypes': value }) }}
        />
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
        label: '业务类型',
        key: 'bussType',
        list: bussTypeList,
        valueKey: 'dictValue',
        nameKey: 'dictLabel',
      })
    },
    {
      label: 'DCC交易',
      key: 'dccSupFlag',
      requiredType: 'select',
      itemSingleCol: true,
      render: () =>
        <CustomRadioGroup
          list={dccSupFlagList}
          valueKey={'dictValue'} nameKey={'dictLabel'}
          setForm={(value: any[]) => { form.setFieldsValue({ 'dccSupFlag': value }) }}
        />
    },
  ]

  /**
   * @todo 任务时间表单项
   */
  const taskTimeForms: CustomFromItem[] = [
    {
      label: '任务时间修改开关',
      key: 'validDateShow',
      render: () => <Switch defaultChecked={false} checked={validDateShow} onChange={setValidDateShow} />,
      labelCol: {
        span: 4
      },
      wrapperCol: {
        span: 20
      },
      itemSingleCol: true,
    },
    {
      show: validDateShow,
      label: '有效起始日期',
      key: 'validStartTime',
      requiredType: 'select',
      render: () => <DatePicker
        format="YYYY-MM-DD HH:mm:ss"
        style={{ width: '100%' }}
        showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
        placeholder="请选择有效起始日期"
      />
    },
    {
      show: validDateShow,
      label: '有效截止日期',
      key: 'validEndTime',
      requiredType: 'select',
      render: () => <DatePicker
        format="YYYY-MM-DD HH:mm:ss"
        style={{ width: '100%' }}
        showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
        placeholder="请选择有效截止日期"
      />
    }
  ]

  /**
   * @todo 更新方式表单项
   */
  const updateModeForms: CustomFromItem[] = [
    {
      label: '更新通知方式',
      key: 'showNotify',
      requiredType: 'select',
      render: () =>
        <CustomRadioGroup
          list={[{ value: 0, label: '静默安装' }, { value: 1, label: '非静默安装' }]}
          valueKey={'value'} nameKey={'label'}
          setForm={(value: any[]) => { form.setFieldsValue({ 'showNotify': value }) }}
        />
    },
    {
      label: '更细实时性',
      key: 'isRealTime',
      requiredType: 'select',
      render: () =>
        <CustomRadioGroup
          list={[{ value: 0, label: '实时更新' }, { value: 1, label: '空闲更新' }]}
          valueKey={'value'} nameKey={'label'}
          setForm={(value: any[]) => { form.setFieldsValue({ 'isRealTime': value }) }}
        />
    },
  ]

  /**
   * @todo 发布类型表单项
   */
  const releaseTypeForms: CustomFromItem[] = [
    {
      ...getCustomSelectFromItemData({
        label: '发布类型',
        key: 'releaseType',
        list: releaseTypeList,
        valueKey: 'dictValue',
        nameKey: 'dictLabel',
        value: releaseTypeValue,
        setValue: setReleaseTypeValue,
      })
    },
  ]

  /**
   * @todo 获取发布类型表单按机构方式表单项
   */
  const getReleaseTypeFormsByDept = (): CustomFromItem[] => {
    if (releaseTypeValue === '1') {
      return [
        {
          label: '机构名称',
          key: 'deptId',
          requiredType: 'select',
          render: () => renderTreeSelect(
            {
              placeholder: '请选择所属机构',
              formName: 'deptId',
              formType: FormItmeType.TreeSelect,
              treeSelectData: deptTreeData,
              value: deptId,
              onChange: (id: number) => {
                setDeptId(id);
              },
              span: 24
            } as any
          )
        },
        {
          label: '组别过滤方式',
          key: 'isGroupUpdate',
          render: () =>
            <CustomRadioGroup
              list={groupFilterTypeList}
              valueKey={'value'} nameKey={'label'}
              setForm={(value: any) => { form.setFieldsValue({ 'isGroupUpdate': value }); setGroupFilterTypeValue(value) }}
            />
        },
        {
          label: '升级范围',
          key: 'activateType',
          requiredType: 'select',
          render: () =>
            <CustomRadioGroup
              list={activateTypeList}
              valueKey={'dictValue'}
              nameKey={'dictLabel'}
              setForm={(value: any[]) => { form.setFieldsValue({ 'activateType': value }) }}
            />
        },
        {
          label: '终端组别',
          key: 'groupIds',
          itemSingleCol: true,
          show: groupFilterTypeValue !== 0,
          render: () =>
            <CustomCheckGroup
              list={terminalGroupList}
              valueKey={'id'} nameKey={'name'}
              setForm={(value: any[]) => { form.setFieldsValue({ 'groupIds': value }) }}
            />
        },
      ]
    }
    return [];
  }

  /**
   * @todo 新增终端操作
   */
  const onAddTerminals = () => {
    if (terminalFirmValue.length === 0) {
      message.error('请选择终端厂商');
      return;
    }
    const termianlModels = form.getFieldValue('terminalTypes');
    if (termianlModels && termianlModels.length === 0) {
      message.error('请选择终端型号');
      return;
    }

    setModalVisible(true)
  }

  /**
   * @todo 获取发布类型表单按条件查询方式表单项
   */
  const getReleaseTypeFormsByCondition = (): CustomFromItem[] => {
    if (releaseTypeValue === '0') {
      return [
        {
          label: '终端集合',
          key: 'tusns',
          itemSingleCol: true,
          requiredType: 'select',
          render: () => <FormTusns options={tusnsOptions} setOptions={setTusnsOptions} onAddTerminals={onAddTerminals} />
        }
      ]
    }
    return [];
  }

  /**
   * @todo 新增软件表单项
   */
  const onAddSoftInfoFormsItem = () => {
    if (softInfoFormsNum < 5) {
      setSoftInfoFormsNum(softInfoFormsNum + 1);
    } else {
      message.error('单个任务最大支持5个软件')
    }
  }

  /**
   * @todo 删除软件表单项
   * @param index 
   */
  const onDeleteSoftInfoFormsItem = (index: number) => {
    if (softInfoFormsNum > 1) {
      for (let i = index; i < softInfoFormsNum; i++) {
        softFroms[index].setFieldsValue(softFroms[i + 1].getFieldsValue());
      }
    }
    softFroms[softInfoFormsNum - 1].resetFields();
    setSoftInfoFormsNum(softInfoFormsNum - 1);
  }

  /**
   * @todo 提交
   */
  const onSubmit = async () => {
    try {
      const values = await form.validateFields();
      let arr: any[] = [];
      for (let i = 0; i < softInfoFormsNum; i++) {
        softFroms[i].validateFields();
        arr.push({ ...softFroms[i].getFieldsValue(), isDependApp: false });
      }
      let param: any = {
        ...form.getFieldsValue(),
        validDateShow: validDateShow ? 1 : 0,
        // downloadJobAppList: arr,
      }
      for (let i = 0; i < arr.length; i++) {
        const item = arr[i];
        for (const key in item) {
          if (Object.prototype.hasOwnProperty.call(item, key)) {
            const element = item[key];
            param[`downloadJobAppList[${i}].${key}`] = element;
          }
        }
      }
      console.log('test param', param);
      console.log('Success:', values);
      const res = await taskDownloadJobAdd(param);
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }

  return (
    <Spin spinning={false}>
      <Form
        form={form}
        name="terminal_params"
        initialValues={initialValues}
      >
        <Divider orientation="left">【终端信息】</Divider>
        <CustomFormItems items={terminalInfoForms} />
        <Divider orientation="left">【软件信息】</Divider>
        <Button type="primary" onClick={onAddSoftInfoFormsItem}>新增软件</Button>
        {
          softInfoFormsNum > 0 && new Array(softInfoFormsNum).fill({}).map((item: any, index: number) => {
            return (
              <Card key={`softInfo${index}`} title={`软件${index + 1}`} bordered={true} style={{ marginTop: 10 }} extra={<Button onClick={() => onDeleteSoftInfoFormsItem(index)}>删除</Button>}>
                <SoftInfoItem form={softFroms[index]} firmId={terminalFirmValue} />
              </Card>
            )
          })
        }
        <Divider orientation="left">【任务时间】</Divider>
        <CustomFormItems items={taskTimeForms} />
        <Divider orientation="left">【更新方式】</Divider>
        <CustomFormItems items={updateModeForms} />
        <Divider orientation="left">【发布类型】</Divider>
        <CustomFormItems items={releaseTypeForms.concat(getReleaseTypeFormsByDept()).concat(getReleaseTypeFormsByCondition())} />
        <Form.Item {...ButtonLayout} >
          <Button type="primary" onClick={onSubmit}>
            保存
        </Button>
        </Form.Item>
      </Form>
      <TableTusns
        visible={modalVisible}
        hideModal={() => setModalVisible(false)}
        fetchParam={{ firmId: terminalFirmValue, terminalTypeIds: form.getFieldValue('termianlModels') }}
        setOptions={setTusnsOptions}
        options={tusnsOptions}
      />
    </Spin>

  )
}