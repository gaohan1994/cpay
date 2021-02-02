/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-09-01 14:13:46 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-09-11 17:10:37
 * 
 * @todo 远程运维新增页面
 */
import React, { useState, useEffect, useRef } from 'react';
import { Spin, Form, Button, message, notification } from 'antd';
import { useStore } from '@/pages/common/costom-hooks';
import { CustomFormItems, ButtonLayout, getCustomSelectFromItemData } from '@/component/custom-form';
import { useForm } from 'antd/lib/form/Form';
import { useFormSelectData } from './costom-hooks';
import { CustomFromItem } from '@/common/type';
import { renderTreeSelect } from '@/component/form/render';
import { FormItmeType } from '@/component/form/type';
import { CustomRadioGroup } from '@/component/radio-group';
import { CustomCheckGroup } from '@/component/checkbox-group';
import { FormTusns } from '../../component/form-tusns';
import { taskOperationJobAdd, taskOperationJobDetail, taskOperationJobEdit } from '../../constants/api';
import { useQueryParam } from '@/common/request-util';
import { RESPONSE_CODE } from '@/common/config';
import { useHistory } from 'react-router-dom';
import { useDetail } from '@/pages/common/costom-hooks/use-detail';
import { merge } from 'lodash';
import numeral from 'numeral';
import FixedFoot, { ErrorField } from '@/component/fixed-foot';
import { FormTusnsFailed } from '../../component/form-tusns-failed';

const fieldLabels = {
  jobName: '任务名称',
  operatorCommand: '操作指令',
  firmId: '终端厂商',
  terminalTypeId: '终端类型',
  releaseType: '发布类型',
  deptId: '机构名称',
  isGroupUpdate: '组别过滤方式',
  groupIds: '终端组别',
  fialedTusns: '导入失败集合',
}

export default function Page() {
  const id = useQueryParam('id');
  const type = useQueryParam('type');
  const groupRef: any = useRef();
  const [form] = useForm();
  const history = useHistory();
  const res = useStore(['terminal_operator_command', 'release_type', 'is_group_update']);
  const [loading, setLoading] = useState(false);
  const [tusnsOptions, setTusnsOptions] = useState([]);
  const [failedTusnsOptions, setFailedTusnsOptions] = useState([]);
  const [groupFilterTypeValue, setGroupFilterTypeValue] = useState('0');
  const [error, setError] = useState<ErrorField[]>([]);

  const {
    operatorCommandList,
    terminalFirmList,
    terminalFirmValue, setTerminalFirmValue,
    terminalTypeList,
    terminalTypeValue, setTerminalTypeValue,
    releaseTypeList,
    releaseTypeValue, setReleaseTypeValue,
    deptTreeData,
    deptId, setDeptId,
    terminalGroupList,
    setTerminalGroupValue,
    isGroupUpdateList,
  } = useFormSelectData({ ...form.getFieldsValue() }, form);

  const { detail } = useDetail(id, taskOperationJobDetail, setLoading);

  const initialValues = merge(
    {},
    (detail && detail) || {}
  );

  useEffect(() => {
    form.setFieldsValue({ 'tusns': tusnsOptions.join(';') });
  }, [tusnsOptions]);

  useEffect(() => {
    if (!res.loading) {
      form.setFieldsValue(initialValues);
      if (typeof detail.firmId === 'number') {
        setTerminalFirmValue(detail.firmId);
      }
      if (typeof detail.terminalTypeId === 'number') {
        setTerminalTypeValue(detail.terminalTypeId);
      }
      if (typeof detail.deptId === 'number') {
        setDeptId(detail.deptId);
      }
      if (typeof detail.releaseType === 'number') {
        setReleaseTypeValue(`${detail.releaseType}`);
        form.setFieldsValue({ releaseType: `${detail.releaseType}` });
      }

      if (detail.tusns) {
        // 在修改操作时：使用setTimeout是为了保证终端集合是在所有表单设置完以后再执行，
        // 由于获取终端信息是要根据（厂商、终端型号等参数），在终端集合组件
        // 中监听了这些参数的变化，当参数发生改变时把终端集合置空，如果不在
        // 所有表单设置完成后置空终端集合，会导致终端集合设置以后又被置空
        setTimeout(() => {
          setTusnsOptions(detail.tusns.split(';'));
        }, 0)
      }
      form.setFieldsValue({ isGroupUpdate: `${detail.isGroupUpdate}` });
      setGroupFilterTypeValue(`${detail.isGroupUpdate}`);

      if (detail.groupIds) {
        setTerminalGroupValue(detail.groupIds);
      }
    }
  }, [detail, res.loading]);

  useEffect(() => {
    if (detail.groupIds) {
      let arr: string[] = detail.groupIds.split(',');
      let numArr: number[] = [];
      for (let i = 0; i < arr.length; i++) {
        numArr.push(numeral(arr[i]).value());
      }
      if (groupRef && groupRef.current && groupRef.current.setCheckedList) {
        groupRef.current.setCheckedList(numArr);
      }
    }
  }, [groupRef.current])

  const forms: CustomFromItem[] = [
    {
      label: fieldLabels.jobName,
      key: 'jobName',
      requiredType: 'input' as any,
    },
    {
      ...getCustomSelectFromItemData({
        label: fieldLabels.operatorCommand,
        key: 'operatorCommand',
        list: operatorCommandList,
        valueKey: 'dictValue',
        nameKey: 'dictLabel',
        required: true,
      })
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
          form.setFieldsValue({ 'terminalTypeId': [] });
        }
      })
    },
    {
      ...getCustomSelectFromItemData({
        label: fieldLabels.terminalTypeId,
        key: 'terminalTypeId',
        list: terminalTypeList,
        valueKey: 'id',
        nameKey: 'typeName',
        required: true,
        value: terminalTypeValue,
        setValue: setTerminalTypeValue,
      })
    },
    {
      ...getCustomSelectFromItemData({
        label: fieldLabels.releaseType,
        key: 'releaseType',
        list: releaseTypeList,
        valueKey: 'dictValue',
        nameKey: 'dictLabel',
        value: releaseTypeValue,
        setValue: setReleaseTypeValue,
        required: true
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
          label: fieldLabels.deptId,
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
          label: fieldLabels.isGroupUpdate,
          key: 'isGroupUpdate',
          render: () =>
            <CustomRadioGroup
              list={isGroupUpdateList}
              valueKey={'dictValue'}
              nameKey={'dictLabel'}
              setForm={(value: any) => {
                form.setFieldsValue({ 'isGroupUpdate': value });
                setGroupFilterTypeValue(value);
              }}
            />
        },
        {
          label: fieldLabels.groupIds,
          key: 'groupIds',
          itemSingleCol: true,
          show: groupFilterTypeValue !== '0',
          render: () =>
            <CustomCheckGroup
              ref={groupRef}
              list={terminalGroupList}
              valueKey={'id'} nameKey={'name'}
              setForm={(value: any[]) => { form.setFieldsValue({ 'groupIds': value }); setTerminalGroupValue(value.join(',')) }}
            />
        },
      ]
    }
    return [];
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
          requiredType: 'select',
          render: () =>
            <FormTusns
              options={tusnsOptions}
              setOptions={setTusnsOptions}
              fetchParam={{
                firmId: terminalFirmValue,
                terminalTypeId: terminalTypeValue
              }}
              setFailedOptions={setFailedTusnsOptions}
              terminalTypeList={terminalTypeList}
            />
        },
        {
          label: fieldLabels.fialedTusns,
          key: 'fialedTusns',
          show: failedTusnsOptions.length > 0,
          render: () =>
            <FormTusnsFailed options={failedTusnsOptions} />
        }
      ]
    }
    return [];
  }

  const onSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log('Success:', values);
      const fields = form.getFieldsValue();
      let param: any = {
        ...fields,
        // copsSign: 0,
      }
      setLoading(true);
      if (id && type === '1') {
        param = {
          ...param,
          id
        }
        const res = await taskOperationJobEdit(param);
        setLoading(false);
        if (res && res.code === RESPONSE_CODE.success) {
          notification.success({ message: '修改终端操作任务成功' });
          history.goBack();
        } else {
          notification.error({ message: res.msg || '修改终端操作任务失败，请重试' });
        }
      } else {
        param = {
          ...param,
        }
        const res = await taskOperationJobAdd(param);
        setLoading(false);
        if (res && res.code === RESPONSE_CODE.success) {
          notification.success({ message: '添加终端操作任务成功' });
          history.goBack();
        } else {
          notification.error({ message: res.msg || '添加终端操作任务失败，请重试' });
        }
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
      setError(errorInfo.errorFields);
    }
  }

  return (
    <Spin spinning={res.loading || loading}>
      <div style={{ paddingTop: 10 }}>
        <Form
          form={form}
          className="ant-advanced-search-form"
          style={{ backgroundColor: 'white' }}
        >
          <CustomFormItems items={forms.concat(getReleaseTypeFormsByDept()).concat(getReleaseTypeFormsByCondition())} singleCol={true} />
        </Form>
      </div>
      <FixedFoot errors={error} fieldLabels={fieldLabels}>
        <Button type="primary" loading={loading} onClick={onSubmit}>
          提交
        </Button>
        <Button onClick={() => history.goBack()}>返回</Button>
      </FixedFoot>
    </Spin>
  )
}