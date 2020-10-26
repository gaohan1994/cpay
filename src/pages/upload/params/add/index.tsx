/*
 * @Author: centerm.gaohan 
 * @Date: 2020-10-19 14:13:10 
 * @Last Modified by: centerm.gaohan
 * @Last Modified time: 2020-10-19 15:42:08
 */

import React, { useRef, useEffect, useState } from 'react';
import { useQueryParam } from '@/common/request-util';
import {
  Form,
  Divider,
  Button,
  Card,
  Switch,
  DatePicker,
  Spin,
  message,
  notification,
} from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useFormSelectData } from '../../upload/add/costom-hooks';
import { issueJobEdit, issueJobAdd, issueJobDetail } from '../../constants/api';
import { CustomCheckGroup } from '@/component/checkbox-group';
import { useStore } from '@/pages/common/costom-hooks';
import { CustomFromItem } from '@/common/type';
import {
  getCustomSelectFromItemData,
  CustomFormItems,
  ButtonLayout,
} from '@/component/custom-form';
import { useDetail } from '@/pages/common/costom-hooks/use-detail';
import { CustomRadioGroup } from '@/component/radio-group';
import moment from 'moment';
import { renderTreeSelect } from '@/component/form/render';
import { FormItmeType } from '@/component/form/type';
import { FormTusns } from '../../component/form-tusns';
import numeral from 'numeral';
import { RESPONSE_CODE } from '@/common/config';
import { useHistory } from 'react-router-dom';
import FixedFoot, { ErrorField } from '@/component/fixed-foot';
import { FormTusnsFailed } from '../../component/form-tusns-failed';
import { SoftInfoItem } from './component/soft-info-form';

const fieldLabels = {
  jobName: '任务名称',
  firmId: '终端厂商',
  terminalTypes: '终端型号',
  activateTypes: '终端类型',
  cupConnMode: '银联间直连',
  bussType: '业务类型',
  dccSupFlag: 'DCC交易',
  zzFlag: '终端分类',
  validDateShow: '任务时间修改开关',
  validStartTime: '有效起始日期',
  validEndTime: '有效截止日期',
  showNotify: '更新通知方式',
  isRealTime: '更细实时性',
  releaseType: '发布类型',
  deptId: '机构名称',
  isGroupUpdate: '组别过滤方式',
  activateType: '升级范围',
  groupIds: '终端组别',
  tusns: '终端集合',
  fialedTusns: '导入失败集合',
};

export default function Page() {
  const id = useQueryParam('id');
  const type = useQueryParam('type');
  const [form] = useForm();
  const history = useHistory();
  const [paramsForm] = useForm();
  // const [paramsForm2] = useForm();
  // const [paramsForm3] = useForm();
  // const [paramsForm4] = useForm();
  // const [paramsForm5] = useForm();
  // const paramsForms = [paramsForm1, paramsForm2, paramsForm3, paramsForm4, paramsForm5];
  /** 获取字典数据 */
  const dictRes = useStore([
    'terminal_type',
    'unionpay_connection',
    'buss_type',
    'is_dcc_sup',
    'zz_flag',
    'download_task_type',
    'driver_type',
    'release_type',
    'activate_type',
    'is_group_update',
  ]);

  // const [softInfoFormsNum, setSoftInfoFormsNum] = useState(1);
  const [validDateShow, setValidDateShow] = useState(false);
  const [tusnsOptions, setTusnsOptions] = useState([]);
  const [failedTusnsOptions, setFailedTusnsOptions] = useState([]);
  const [groupFilterTypeValue, setGroupFilterTypeValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dictLoading, setDictLoading] = useState(true);
  const terminalTypesRef: any = useRef();
  const activateTypesRef: any = useRef();
  const groupIdsRef: any = useRef();
  const [terminalTypes, setTerminalTypes] = useState([] as any[]);
  const [activeTypes, setActiveTypes] = useState([] as any[]);
  const [groupIdsInit, setGroupIdsInit] = useState(false);
  const [error, setError] = useState<ErrorField[]>([]);

  const { detail } = useDetail(id, issueJobDetail, setLoading);

  const {
    terminalFirmList,
    terminalFirmValue,
    setTerminalFirmValue,
    terminalTypeList,
    activateTypesList,
    unionpayConnectionList,
    cupConnModeValue,
    setCupConnModeValue,
    bussTypeList,
    bussTypeValue,
    setBussTypeValue,
    dccSupFlagList,
    dccSupFlagValue,
    setDccSupFlagValue,
    releaseTypeList,
    releaseTypeValue,
    setReleaseTypeValue,
    deptTreeData,
    deptId,
    setDeptId,
    terminalGroupList,
    activateTypeList,
    isGroupUpdateList,
    zzFlagList,
    zzFlagValue,
    setZzFlagValue,
  } = useFormSelectData(form.getFieldsValue());

  useEffect(() => {
    setDictLoading(dictRes.loading);
  }, [dictRes.loading]);

  useEffect(() => {
    form.setFieldsValue({ tusns: tusnsOptions.join(';') });
  }, [tusnsOptions]);

  /**
   * @todo 组别过滤方式改变后，设置相应的组别表单选中值
   */
  useEffect(() => {
    if (!groupIdsInit) {
      const issueParamJobOutput = detail.issueParamJobOutput || {};
      if (
        groupIdsRef &&
        groupIdsRef.current &&
        groupIdsRef.current.setCheckedList &&
        issueParamJobOutput.groupIds
      ) {
        setGroupIdsInit(true);
        const arr: string[] = issueParamJobOutput.groupIds.split(',');
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
    if (detail.issueParamJobOutput) {
      const issueParamJobOutput = detail.issueParamJobOutput;
      form.setFieldsValue({
        ...issueParamJobOutput,
        cupConnMode: `${issueParamJobOutput.cupConnMode}`,
        releaseType: `${issueParamJobOutput.releaseType}`,
        dccSupFlag: `${issueParamJobOutput.dccSupFlag}`,
        isGroupUpdate: `${issueParamJobOutput.isGroupUpdate}`,
        activateType: `${issueParamJobOutput.activateType}`,
      });
      setBussTypeValue(issueParamJobOutput.bussType);
      setCupConnModeValue(`${issueParamJobOutput.cupConnMode}`);
      setDccSupFlagValue(`${issueParamJobOutput.dccSupFlag}`);
      setZzFlagValue(issueParamJobOutput.zzFlag);
      setGroupFilterTypeValue(issueParamJobOutput.isGroupUpdate);
      setReleaseTypeValue(`${issueParamJobOutput.releaseType}`);
      setTerminalFirmValue(issueParamJobOutput.firmId);
      setDeptId(issueParamJobOutput.deptId);
      if (
        terminalTypesRef &&
        terminalTypesRef.current &&
        terminalTypesRef.current.setCheckedList &&
        issueParamJobOutput.terminalTypes
      ) {
        terminalTypesRef.current.setCheckedList(
          issueParamJobOutput.terminalTypes.split(',')
        );
      }
      if (
        activateTypesRef &&
        activateTypesRef.current &&
        activateTypesRef.current.setCheckedList &&
        issueParamJobOutput.activateTypes
      ) {
        activateTypesRef.current.setCheckedList(
          issueParamJobOutput.activateTypes.split(',')
        );
      }
      setValidDateShow(issueParamJobOutput.validDateShow === 1 ? true : false);
      if (issueParamJobOutput.validDateShow === 1) {
        form.setFieldsValue({
          validStartTime: moment(issueParamJobOutput.validStartTime || 0),
          validEndTime: moment(issueParamJobOutput.validEndTime || 0),
        });
      }
      if(issueParamJobOutput.paramTemplateId) {
        paramsForm.setFieldsValue({
          paramTemplateId: issueParamJobOutput.paramTemplateId
        })
      }
      
    }
    if (detail.tusnList) {
      // 在修改操作时：使用setTimeout是为了保证终端集合是在所有表单设置完以后再执行，
      // 由于获取终端信息是要根据（厂商、终端型号等参数），在终端集合组件
      // 中监听了这些参数的变化，当参数发生改变时把终端集合置空，如果不在
      // 所有表单设置完成后置空终端集合，会导致终端集合设置以后又被置空
      setTimeout(() => {
        setTusnsOptions(detail.tusnList);
      }, 0);
    }
  }, [detail, dictLoading]);

  /**
   * @todo 重置软件信息表单
   */
  const resetSoftInfo = () => {
      // setSoftInfoFormsNum(1);
  };

  /**
   * @todo 终端信息表单项
   */
  const terminalInfoForms: CustomFromItem[] = [
    {
      label: fieldLabels.jobName,
      key: 'jobName',
      requiredType: 'input',
    },
    {
      ...getCustomSelectFromItemData({
        label: fieldLabels.firmId,
        key: 'firmId',
        value: terminalFirmValue,
        list: terminalFirmList,
        valueKey: 'id',
        nameKey: 'firmName',
        required: true,
        onChange: (id: any) => {
          setTerminalFirmValue(id);
          form.setFieldsValue({ terminalTypes: undefined });
          resetSoftInfo();
        },
      }),
    },
    {
      label: fieldLabels.terminalTypes,
      key: 'terminalTypes',
      requiredType: 'select',
      render: () => (
        <CustomCheckGroup
          ref={terminalTypesRef}
          list={terminalTypeList}
          valueKey={'typeCode'}
          nameKey={'typeName'}
          setForm={(checkedList: any[]) => {
            form.setFieldsValue({ terminalTypes: checkedList });
            setTerminalTypes(checkedList);
            resetSoftInfo();
          }}
        />
      ),
    },
    {
      label: fieldLabels.activateTypes,
      key: 'activateTypes',
      requiredType: 'select',
      render: () => (
        <CustomCheckGroup
          ref={activateTypesRef}
          list={activateTypesList}
          valueKey={'dictValue'}
          nameKey={'dictLabel'}
          setForm={(value: any[]) => {
            form.setFieldsValue({ activateTypes: value });
            setActiveTypes(value);
          }}
        />
      ),
    },
    {
      ...getCustomSelectFromItemData({
        label: fieldLabels.cupConnMode,
        key: 'cupConnMode',
        list: unionpayConnectionList,
        valueKey: 'dictValue',
        nameKey: 'dictLabel',
        value: cupConnModeValue,
        onChange: (id: any) => {
          setCupConnModeValue(id);
          resetSoftInfo();
        },
      }),
    },
    {
      ...getCustomSelectFromItemData({
        label: fieldLabels.bussType,
        key: 'bussType',
        list: bussTypeList,
        valueKey: 'dictValue',
        nameKey: 'dictLabel',
        setValue: setBussTypeValue,
      }),
    },
    {
      label: fieldLabels.dccSupFlag,
      key: 'dccSupFlag',
      requiredType: 'select',
      render: () => (
        <CustomRadioGroup
          list={dccSupFlagList}
          valueKey={'dictValue'}
          nameKey={'dictLabel'}
          setForm={(value: any) => {
            form.setFieldsValue({ dccSupFlag: value });
            setDccSupFlagValue(value);
            resetSoftInfo();
          }}
        />
      ),
    },
    {
      ...getCustomSelectFromItemData({
        label: fieldLabels.zzFlag,
        key: 'zzFlag',
        list: zzFlagList,
        valueKey: 'dictValue',
        nameKey: 'dictLabel',
        required: true,
        setValue: setZzFlagValue,
      }),
    },
  ];

  /**
   * @todo 任务时间表单项
   */
  const taskTimeForms: CustomFromItem[] = [
    {
      label: fieldLabels.validDateShow,
      key: 'validDateShow',
      render: () => (
        <Switch
          defaultChecked={false}
          checked={validDateShow}
          onChange={setValidDateShow}
        />
      ),
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 20,
      },
      itemSingleCol: true,
    },
    {
      show: validDateShow,
      label: fieldLabels.validStartTime,
      key: 'validStartTime',
      requiredType: 'select',
      render: () => (
        <DatePicker
          format="YYYY-MM-DD HH:mm:ss"
          style={{ width: '100%' }}
          showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
          placeholder="请选择有效起始日期"
        />
      ),
    },
    {
      show: validDateShow,
      label: fieldLabels.validEndTime,
      key: 'validEndTime',
      requiredType: 'select',
      render: () => (
        <DatePicker
          format="YYYY-MM-DD HH:mm:ss"
          style={{ width: '100%' }}
          showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
          placeholder="请选择有效截止日期"
        />
      ),
    },
  ];

  /**
   * @todo 更新方式表单项
   */
  const updateModeForms: CustomFromItem[] = [
    {
      label: fieldLabels.showNotify,
      key: 'showNotify',
      requiredType: 'select',
      render: () => (
        <CustomRadioGroup
          list={[
            { value: 0, label: '静默安装' },
            { value: 1, label: '非静默安装' },
          ]}
          valueKey={'value'}
          nameKey={'label'}
          setForm={(value: any[]) => {
            form.setFieldsValue({ showNotify: value });
          }}
        />
      ),
    },
    {
      label: fieldLabels.isRealTime,
      key: 'isRealTime',
      requiredType: 'select',
      render: () => (
        <CustomRadioGroup
          list={[
            { value: 0, label: '实时更新' },
            { value: 1, label: '空闲更新' },
          ]}
          valueKey={'value'}
          nameKey={'label'}
          setForm={(value: any[]) => {
            form.setFieldsValue({ isRealTime: value });
          }}
        />
      ),
    },
  ];

  /**
   * @todo 发布类型表单项
   */
  const releaseTypeForms: CustomFromItem[] = [
    {
      ...getCustomSelectFromItemData({
        label: fieldLabels.releaseType,
        key: 'releaseType',
        list: releaseTypeList,
        valueKey: 'dictValue',
        nameKey: 'dictLabel',
        value: releaseTypeValue,
        setValue: setReleaseTypeValue,
        required: true,
      }),
    },
  ];

  /**
   * @todo 获取发布类型表单按机构方式表单项
   */
  const getReleaseTypeFormsByDept = (): CustomFromItem[] => {
    if (releaseTypeValue === '1') {
      return [
        {
          label: fieldLabels.deptId,
          key: 'deptId',
          requiredType: 'select',
          render: () =>
            renderTreeSelect({
              placeholder: '请选择所属机构',
              formName: 'deptId',
              formType: FormItmeType.TreeSelect,
              treeSelectData: deptTreeData,
              value: deptId,
              onChange: (id: number) => {
                setDeptId(id);
              },
              span: 24,
            } as any),
        },
        {
          label: fieldLabels.isGroupUpdate,
          key: 'isGroupUpdate',
          render: () => (
            <CustomRadioGroup
              list={isGroupUpdateList}
              valueKey={'dictValue'}
              nameKey={'dictLabel'}
              setForm={(value: any) => {
                form.setFieldsValue({ isGroupUpdate: value });
                setGroupFilterTypeValue(numeral(value).value());
              }}
            />
          ),
        },
        {
          label: fieldLabels.activateType,
          key: 'activateType',
          requiredType: 'select',
          render: () => (
            <CustomRadioGroup
              list={activateTypeList}
              valueKey={'dictValue'}
              nameKey={'dictLabel'}
              setForm={(value: any[]) => {
                form.setFieldsValue({ activateType: value });
              }}
            />
          ),
        },
        {
          label: fieldLabels.groupIds,
          key: 'groupIds',
          itemSingleCol: true,
          show: groupFilterTypeValue !== 0,
          render: () => (
            <CustomCheckGroup
              ref={groupIdsRef}
              list={terminalGroupList}
              valueKey={'id'}
              nameKey={'name'}
              setForm={(value: any[]) => {
                form.setFieldsValue({ groupIds: value });
              }}
            />
          ),
        },
      ];
    }
    return [];
  };

  /**
   * @todo 获取发布类型表单按条件查询方式表单项
   */
  const getReleaseTypeFormsByCondition = (): CustomFromItem[] => {
    if (releaseTypeValue === '0') {
      return [
        {
          label: fieldLabels.tusns,
          key: 'tusns',
          itemSingleCol: true,
          requiredType: 'select',
          render: () => (
            <FormTusns
              options={tusnsOptions}
              setOptions={setTusnsOptions}
              setFailedOptions={setFailedTusnsOptions}
              fetchParam={{
                firmId: terminalFirmValue,
                terminalTypeCodes: terminalTypes,
                activeTypes: activeTypes,
                cupConnMode: cupConnModeValue,
                bussType: bussTypeValue,
                dccSupFlag: dccSupFlagValue,
                zzFlag: zzFlagValue,
              }}
            />
          ),
        },
        {
          label: fieldLabels.fialedTusns,
          key: 'fialedTusns',
          itemSingleCol: true,
          show: failedTusnsOptions.length > 0,
          render: () => <FormTusnsFailed options={failedTusnsOptions} />,
        },
      ];
    }
    return [];
  };

  /**
   * @todo 提交
   */
  const onSubmit = async () => {
    try {
      await form.validateFields();
      const fields = form.getFieldsValue();
      let arr: any[] = [];
      const templateParams = await paramsForm.validateFields();
      let param: any = {
        ...form.getFieldsValue(),
        validDateShow: validDateShow ? 1 : 0,
        paramTemplateId: templateParams.paramTemplateId // 参数模板的值
      };
      // 组别过滤方式为0（无）时，没有组别集合
      if (groupFilterTypeValue === 0 && param.groupIds) {
        delete param.groupIds;
      }
      if (validDateShow) {
        param = {
          ...param,
          validStartTime: fields.validStartTime.format('YYYY-MM-DD HH:mm:ss'),
          validEndTime: fields.validEndTime.format('YYYY-MM-DD HH:mm:ss'),
        };
      }

      setLoading(true);
      if (id && !type) {
        param = {
          ...param,
          id,
        };
        const res = await issueJobEdit(param);
        setLoading(false);
        if (res && res.code === RESPONSE_CODE.success) {
          notification.success({ message: '修改参数下发任务成功' });
          history.goBack();
        } else {
          notification.error({
            message: res.msg || '修改参数下发任务失败，请重试',
          });
        }
      } else {
        const res = await issueJobAdd(param);
        setLoading(false);
        if (res && res.code === RESPONSE_CODE.success) {
          notification.success({ message: '添加参数下发任务成功' });
          history.goBack();
        } else {
          notification.error({
            message: res.msg || '添加参数下发任务失败，请重试',
          });
        }
      }
    } catch (errorInfo) {
      setError(errorInfo.errorFields);
    }
  };


  return (
    <Spin spinning={loading || dictLoading}>
      <Form form={form} style={{ paddingBottom: 100 }}>
        <Divider orientation="left">【终端信息】</Divider>
        <CustomFormItems items={terminalInfoForms} />
        <Divider orientation="left">【参数信息】</Divider>
        <SoftInfoItem form={paramsForm} />
        <Divider orientation="left">【任务时间】</Divider>
        <CustomFormItems items={taskTimeForms} />
        <Divider orientation="left">【更新方式】</Divider>
        <CustomFormItems items={updateModeForms} />
        <Divider orientation="left">【发布类型】</Divider>
        <CustomFormItems
          items={releaseTypeForms
            .concat(getReleaseTypeFormsByDept())
            .concat(getReleaseTypeFormsByCondition())}
        />
      </Form>
      <FixedFoot errors={error} fieldLabels={fieldLabels}>
        <Button type="primary" loading={loading} onClick={onSubmit}>
          提交
        </Button>
        <Button onClick={() => history.goBack()}>返回</Button>
      </FixedFoot>
    </Spin>
  );
}
