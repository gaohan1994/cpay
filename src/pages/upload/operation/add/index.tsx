/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-09-01 14:13:46 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-09-01 14:23:02
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
import { FormTusns } from '../../component/from-tusns';
import { TableTusns } from '../../component/table.tusns';
import { taskOperationJobAdd, taskOperationJobDetail, taskOperationJobEdit } from '../../constants/api';
import { useQueryParam } from '@/common/request-util';
import { RESPONSE_CODE } from '@/common/config';
import { useHistory } from 'react-router-dom';
import { useDetail } from '@/pages/common/costom-hooks/use-detail';
import { merge } from 'lodash';
import numeral from 'numeral';

export default function Page() {
  const id = useQueryParam('id');
  const type = useQueryParam('type');
  const groupRef: any = useRef();
  const [form] = useForm();
  const history = useHistory();
  const res = useStore(['terminal_operator_command', 'release_type', 'is_group_update']);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [tusnsOptions, setTusnsOptions] = useState([]);
  const [groupFilterTypeValue, setGroupFilterTypeValue] = useState('0');

  const {
    operatorCommandList,
    terminalFirmList,
    terminalFirmValue, setTerminalFirmValue,
    terminalTypeList,
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
      if (typeof detail.deptId === 'number') {
        setDeptId(detail.deptId);
      }
      if (typeof detail.releaseType === 'number') {
        setReleaseTypeValue(`${detail.releaseType}`);
        form.setFieldsValue({ releaseType: `${detail.releaseType}` });
      }
      if (detail.tusns) {
        setTusnsOptions(detail.tusns.split(';'))
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
      label: '任务名称',
      key: 'jobName',
      requiredType: 'input' as any,
    },
    {
      ...getCustomSelectFromItemData({
        label: '操作指令',
        key: 'operatorCommand',
        list: operatorCommandList,
        valueKey: 'dictValue',
        nameKey: 'dictLabel',
        required: true,
      })
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
          form.setFieldsValue({ 'terminalTypeId': [] });
        }
      })
    },
    {
      ...getCustomSelectFromItemData({
        label: '终端类型',
        key: 'terminalTypeId',
        list: terminalTypeList,
        valueKey: 'id',
        nameKey: 'typeName',
        required: true,
      })
    },
    {
      ...getCustomSelectFromItemData({
        label: '发布类型',
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
                setGroupFilterTypeValue(value);
              }}
            />
        },
        {
          label: '终端组别',
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
   * @todo 新增终端操作
   */
  const onAddTerminals = () => {
    if (terminalFirmValue.length === 0) {
      message.error('请选择终端厂商');
      return;
    }
    const terminalTypeId = form.getFieldValue('terminalTypeId');
    if (!terminalTypeId || terminalTypeId && terminalTypeId.length === 0) {
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
          requiredType: 'select',
          render: () => <FormTusns options={tusnsOptions} setOptions={setTusnsOptions} onAddTerminals={onAddTerminals} />
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
        copsSign: 0,
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
    }
  }

  return (
    <Spin spinning={res.loading || loading}>
      <div style={{ paddingTop: 10 }}>
        <Form
          form={form}
          className="ant-advanced-search-form"
        >
          <CustomFormItems items={forms.concat(getReleaseTypeFormsByDept()).concat(getReleaseTypeFormsByCondition())} singleCol={true} />
          <Form.Item {...ButtonLayout} >
            <Button type="primary" onClick={onSubmit}>
              保存
        </Button>
          </Form.Item>
        </Form>
        <TableTusns
          visible={modalVisible}
          hideModal={() => setModalVisible(false)}
          fetchParam={{ firmId: terminalFirmValue, terminalTypeIds: form.getFieldValue('terminalTypeId') }}
          setOptions={setTusnsOptions}
          options={tusnsOptions}
        />
      </div>

    </Spin>
  )
}