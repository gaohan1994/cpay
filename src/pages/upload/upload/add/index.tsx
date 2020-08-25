import React, { useRef, useEffect, useState } from 'react';
import { useQueryParam } from '@/common/request-util';
import { merge } from 'lodash';
import { Form, Input, Col, Row, Divider, Button, Card, Switch, DatePicker, Spin } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useFormSelectData } from './costom-hooks';
import { getFormCommonRules } from '../../common/util';
import { taskDownloadJobDetail } from '../constants/api';
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
    'download_task_type', 'release_type']);

  const [softInfoFormsNum, setSoftInfoFormsNum] = useState(1);
  const [validDateShow, setValidDateShow] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {

  }, [])
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
    releseTypeList, setReleaseTypeList,
    releaseTypeValue, setReleaseTypeValue,
    deptTreeData, setDeptTreeData,
    deptId, setDeptId,
    terminalGroupList, setTerminalGroupList
  } = useFormSelectData(form.getFieldsValue());

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
        setValue: setTerminalFirmValue,
        list: terminalFirmList,
        valueKey: 'id',
        nameKey: 'firmName',
        required: true
      })
    },
    {
      label: '终端型号',
      key: 'termianlModels',
      requiredType: 'select',
      render: () =>
        <CustomCheckGroup
          list={terminalModelList}
          valueKey={'id'} nameKey={'typeName'}
          setForm={(checkedList: any[]) => { form.setFieldsValue({ 'termianlModels': checkedList }) }}
        />
    },
    {
      label: '终端类型',
      key: 'termianlTypes',
      requiredType: 'select',
      render: () =>
        <CustomCheckGroup
          list={terminalTypeList}
          valueKey={'dictValue'} nameKey={'dictLabel'}
          setForm={(value: any[]) => { form.setFieldsValue({ 'termianlTypes': value }) }}
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

  const taskTimeForms: CustomFromItem[] = [
    {
      label: '任务时间修改开关',
      key: 'validDateShow',
      render: () => <Switch checked={validDateShow} onChange={setValidDateShow} />,
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

  const releaseTypeForms: CustomFromItem[] = [
    {
      ...getCustomSelectFromItemData({
        label: '发布类型',
        key: 'releseType',
        list: releseTypeList,
        valueKey: 'dictValue',
        nameKey: 'dictLabel',
        value: releaseTypeValue,
        setValue: setReleaseTypeValue,
      })
    },
  ]

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
          key: 'groupFilterType',
          render: () =>
            <CustomRadioGroup
              list={[{ value: 0, label: '无' }, { value: 1, label: '指定' }, { value: 2, label: '排除' }]}
              valueKey={'value'} nameKey={'label'}
              setForm={(value: any[]) => { form.setFieldsValue({ 'groupFilterType': value }) }}
            />
        },
        {
          label: '升级范围',
          key: 'update',
          requiredType: 'select',
          render: () =>
            <CustomRadioGroup
              list={[{ value: 0, label: '存量 + 增量' }, { value: 1, label: '仅存量' }]}
              valueKey={'value'} nameKey={'label'}
              setForm={(value: any[]) => { form.setFieldsValue({ 'update': value }) }}
            />
        },
        {
          label: '终端组别',
          key: 'groupIds',
          itemSingleCol: true,
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

  const getReleaseTypeFormsByCondition = (): CustomFromItem[] => {
    if (releaseTypeValue === '0') {
      return [
        {
          label: '终端集合',
          key: 'tusns',
          itemSingleCol: true,
          requiredType: 'select',
          render: () => <FormTusns options={[]} setOptions={() => { }} onAddTerminals={() => { }} />
        }
      ]
    }
    return [];
  }


  const onAddSoftInfoFormsItem = () => {
    if (softInfoFormsNum < 5) {
      setSoftInfoFormsNum(softInfoFormsNum + 1);
    }
  }

  const onDeleteSoftInfoFormsItem = (index: number) => {
    if (softInfoFormsNum > 1) {
      for (let i = index; i < softInfoFormsNum; i++) {
        softFroms[index].setFieldsValue(softFroms[i + 1].getFieldsValue());
      }
    }
    softFroms[softInfoFormsNum - 1].resetFields();
    setSoftInfoFormsNum(softInfoFormsNum - 1);
  }

  const onSubmit = async () => {
    try {
      console.log('test aaa', form.getFieldsValue());
      const values = await form.validateFields();
      console.log('Success:', values);
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
                <SoftInfoItem form={softFroms[index]} firmId={undefined} />
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
      <TableTusns visible={modalVisible} hideModal={() => setModalVisible(false)} handleOk={() => { }} handleCancel={() => { }} fetchParam={{ firmId: 28 }} />
    </Spin>

  )
}