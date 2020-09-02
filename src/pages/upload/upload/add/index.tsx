/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-09-01 14:37:54 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-09-01 14:44:06
 * 
 * @todo 软件更新新增页面
 */
import React, { useRef, useEffect, useState } from 'react';
import { useQueryParam } from '@/common/request-util';
import { Form, Divider, Button, Card, Switch, DatePicker, Spin, message, notification } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useFormSelectData } from './costom-hooks';
import { taskDownloadJobDetail, taskDownloadJobAdd, taskDownloadJobEdit } from '../constants/api';
import { CustomCheckGroup } from '@/component/checkbox-group';
import { useStore } from '@/pages/common/costom-hooks';
import { CustomFromItem } from '@/common/type';
import { getCustomSelectFromItemData, CustomFormItems, ButtonLayout } from '@/component/custom-form';
import { SoftInfoItem } from './component/soft-info-form';
import { useDetail } from '@/pages/common/costom-hooks/use-detail';
import { CustomRadioGroup } from '@/component/radio-group';
import moment from 'moment';
import { renderTreeSelect } from '@/component/form/render';
import { FormItmeType } from '@/component/form/type';
import { FormTusns } from '../../component/from-tusns';
import { TableTusns } from '../../component/table.tusns';
import numeral from 'numeral';
import { RESPONSE_CODE } from '@/common/config';
import { useHistory } from 'react-router-dom';

export default function Page() {
  const id = useQueryParam('id');
  const type = useQueryParam('type');
  const [form] = useForm();
  const history = useHistory();
  const [softFrom1] = useForm();
  const [softFrom2] = useForm();
  const [softFrom3] = useForm();
  const [softFrom4] = useForm();
  const [softFrom5] = useForm();
  const softFroms = [softFrom1, softFrom2, softFrom3, softFrom4, softFrom5];
  /** 获取字典数据 */
  const dictRes = useStore(['terminal_type', 'unionpay_connection', 'buss_type',
    'dcc_sup_flag', 'zz_flag', 'download_task_type', 'driver_type',
    'release_type', 'activate_type', 'is_group_update',]);

  const [softInfoFormsNum, setSoftInfoFormsNum] = useState(1);
  const [validDateShow, setValidDateShow] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [tusnsOptions, setTusnsOptions] = useState([]);
  const [groupFilterTypeValue, setGroupFilterTypeValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dictLoading, setDictLoading] = useState(true);
  const terminalTypesRef: any = useRef();
  const activateTypesRef: any = useRef();
  const groupIdsRef: any = useRef();
  const [terminalTypes, setTerminalTypes] = useState([] as any[]);
  const [groupIdsInit, setGroupIdsInit] = useState(false);

  /**
   * 第一步初始化数据
   * 第二步
   * 1、新增则
   */
  const { detail } = useDetail(id, taskDownloadJobDetail, setLoading);

  const {
    terminalFirmList,
    terminalFirmValue, setTerminalFirmValue,
    terminalTypeList,
    activateTypesList,
    unionpayConnectionList,
    cupConnModeValue, setCupConnModeValue,
    bussTypeList,
    dccSupFlagList,
    dccSupFlagValue, setDccSupFlagValue,
    releaseTypeList,
    releaseTypeValue, setReleaseTypeValue,
    deptTreeData,
    deptId, setDeptId,
    terminalGroupList,
    activateTypeList,
    isGroupUpdateList,
    zzFlagList
  } = useFormSelectData(form.getFieldsValue());

  useEffect(() => {
    setDictLoading(dictRes.loading);
  }, [dictRes.loading]);

  useEffect(() => {
    form.setFieldsValue({ 'tusns': tusnsOptions });
  }, [tusnsOptions])

  /**
   * @todo 组别过滤方式改变后，设置相应的组别表单选中值
   */
  useEffect(() => {
    if (!groupIdsInit) {
      const downloadJobOutput = detail.downloadJobOutput || {};
      if (groupIdsRef && groupIdsRef.current && groupIdsRef.current.setCheckedList && downloadJobOutput.groupIds) {
        setGroupIdsInit(true);
        const arr: string[] = downloadJobOutput.groupIds.split(',');
        const numArr: number[] = [];
        for (let i = 0; i < arr.length; i++) {
          numArr.push(numeral(arr[i]).value());
        }
        groupIdsRef.current.setCheckedList(numArr);
      }
    }
  }, [groupFilterTypeValue]);

  /**
   * @todo 当字典数据获取完，且获取到详情数据，设置相应的表单数据
   */
  useEffect(() => {
    if (dictLoading) {
      return;
    }
    if (detail.downloadJobOutput) {
      const downloadJobOutput = detail.downloadJobOutput;
      form.setFieldsValue({
        ...downloadJobOutput,
        cupConnMode: `${downloadJobOutput.cupConnMode}`,
        releaseType: `${downloadJobOutput.releaseType}`,
        dccSupFlag: `${downloadJobOutput.dccSupFlag}`,
        isGroupUpdate: `${downloadJobOutput.isGroupUpdate}`,
        activateType: `${downloadJobOutput.activateType}`,
      });
      setGroupFilterTypeValue(downloadJobOutput.isGroupUpdate);
      setReleaseTypeValue(`${downloadJobOutput.releaseType}`);
      setTerminalFirmValue(downloadJobOutput.firmId);
      setDeptId(downloadJobOutput.deptId);
      if (terminalTypesRef && terminalTypesRef.current && terminalTypesRef.current.setCheckedList && downloadJobOutput.terminalTypes) {
        terminalTypesRef.current.setCheckedList(downloadJobOutput.terminalTypes.split(','));
      }
      if (activateTypesRef && activateTypesRef.current && activateTypesRef.current.setCheckedList && downloadJobOutput.activateTypes) {
        activateTypesRef.current.setCheckedList(downloadJobOutput.activateTypes.split(','))
      }
      setValidDateShow(downloadJobOutput.validDateShow === 1 ? true : false);
      if (downloadJobOutput.validDateShow === 1) {
        form.setFieldsValue({
          validStartTime: moment(downloadJobOutput.validStartTime || 0),
          validEndTime: moment(downloadJobOutput.validEndTime || 0)
        });
      }
      setTimeout(() => {
        if (downloadJobOutput.downloadJobAppList) {
          const downloadJobAppList = downloadJobOutput.downloadJobAppList;
          if (Array.isArray(downloadJobAppList) && downloadJobAppList.length > 0) {
            for (let i = 0; i < downloadJobAppList.length; i++) {
              softFroms[i].setFieldsValue(downloadJobAppList[i]);
              softFroms[i].setFieldsValue({
                appType: `${downloadJobAppList[i].appType}`,
                actionType: `${downloadJobAppList[i].actionType}`,
                appCode: downloadJobAppList[i].appCode,
                appId: downloadJobAppList[i].appId
              });
            }
          } else {
            setSoftInfoFormsNum(0);
          }
        } else {
          setSoftInfoFormsNum(0);
        }
      }, 100);

    }
  }, [detail, dictLoading]);

  /**
   * @todo 重置软件信息表单
   */
  const resetSoftInfo = () => {
    for (let i = 0; i < softFroms.length; i++) {
      softFroms[i].resetFields();
      setSoftInfoFormsNum(1);
    }
  }

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
          form.setFieldsValue({ 'terminalTypes': undefined });
          resetSoftInfo();
        }
      })
    },
    {
      label: '终端型号',
      key: 'terminalTypes',
      requiredType: 'select',
      render: () =>
        <CustomCheckGroup
          ref={terminalTypesRef}
          list={terminalTypeList}
          valueKey={'typeCode'} nameKey={'typeName'}
          setForm={(checkedList: any[]) => {
            form.setFieldsValue({ 'terminalTypes': checkedList });
            setTerminalTypes(checkedList);
            resetSoftInfo();
          }}
        />
    },
    {
      label: '终端类型',
      key: 'activateTypes',
      requiredType: 'select',
      render: () =>
        <CustomCheckGroup
          ref={activateTypesRef}
          list={activateTypesList}
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
        value: setCupConnModeValue,
        onChange: (id: any) => {
          setCupConnModeValue(id);
          resetSoftInfo();
        }
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
      render: () =>
        <CustomRadioGroup
          list={dccSupFlagList}
          valueKey={'dictValue'} nameKey={'dictLabel'}
          setForm={(value: any) => {
            form.setFieldsValue({ 'dccSupFlag': value });
            setDccSupFlagValue(value);
            resetSoftInfo();
          }}
        />
    },
    {
      ...getCustomSelectFromItemData({
        label: '终端分类',
        key: 'zzFlag',
        list: zzFlagList,
        valueKey: 'dictValue',
        nameKey: 'dictLabel',
        required: true
      })
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
        required: true,
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
              list={isGroupUpdateList}
              valueKey={'dictValue'}
              nameKey={'dictLabel'}
              setForm={(value: any) => {
                form.setFieldsValue({ 'isGroupUpdate': value });
                setGroupFilterTypeValue(numeral(value).value());
              }}
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
              ref={groupIdsRef}
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
    if (!termianlModels || termianlModels && termianlModels.length === 0) {
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
      await form.validateFields();
      const fields = form.getFieldsValue();
      let arr: any[] = [];
      for (let i = 0; i < softInfoFormsNum; i++) {
        await softFroms[i].validateFields();
        arr.push({ ...softFroms[i].getFieldsValue(), isDependApp: false });
      }
      let param: any = {
        ...form.getFieldsValue(),
        validDateShow: validDateShow ? 1 : 0,
      }
      // 组别过滤方式为0（无）时，没有组别集合
      if (groupFilterTypeValue === 0 && param.groupIds) {
        delete param.groupIds;
      }
      if (validDateShow) {
        param = {
          ...param,
          validStartTime: fields.validStartTime.format('YYYY-MM-DD HH:mm:ss'),
          validEndTime: fields.validEndTime.format('YYYY-MM-DD HH:mm:ss'),
        }
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
      setLoading(true);
      if (id && type === '1') {
        param = {
          ...param,
          id
        }
        const res = await taskDownloadJobEdit(param);
        setLoading(false);
        if (res && res.code === RESPONSE_CODE.success) {
          notification.success({ message: '修改软件更新任务成功' });
          history.goBack();
        } else {
          notification.error({ message: res.msg || '修改软件更新任务失败，请重试' });
        }
      } else {
        const res = await taskDownloadJobAdd(param);
        setLoading(false);
        if (res && res.code === RESPONSE_CODE.success) {
          notification.success({ message: '添加软件更新任务成功' });
          history.goBack();
        } else {
          notification.error({ message: res.msg || '添加软件更新任务失败，请重试' });
        }
      }

    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }

  /**
   * @todo 获取软件信息选中的软件的appid以及依赖的软件的appid的集合（用以控制不重复选择软件以及依赖软件可选列表）
   */
  const getSoftAppIds = () => {
    let appIds: any[] = [];
    for (let i = 0; i < softFroms.length; i++) {
      appIds.push({ appId: softFroms[i].getFieldValue('appId'), dependAppIds: softFroms[i].getFieldValue('dependAppIds') });
    }
    return appIds;
  }

  return (
    <Spin spinning={loading || dictLoading}>
      <Form
        form={form}
      >
        <Divider orientation="left">【终端信息】</Divider>
        <CustomFormItems items={terminalInfoForms} />
        <Divider orientation="left">【软件信息】</Divider>
        <Button type="primary" onClick={onAddSoftInfoFormsItem}>新增软件</Button>
        {
          softInfoFormsNum > 0 && new Array(softInfoFormsNum).fill({}).map((item: any, index: number) => {
            return (
              <Card key={`softInfo${index}`} title={`软件${index + 1}`} bordered={true} style={{ marginTop: 10 }} extra={<Button onClick={() => onDeleteSoftInfoFormsItem(index)}>删除</Button>}>
                <SoftInfoItem
                  form={softFroms[index]}
                  commonValue={{ ...form.getFieldsValue() }}
                  appIds={getSoftAppIds()}
                />
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
        fetchParam={{
          firmId: terminalFirmValue,
          terminalTypeIds: form.getFieldValue('termianlModels'),
        }}
        setOptions={setTusnsOptions}
        options={tusnsOptions}
      />
    </Spin>

  )
}