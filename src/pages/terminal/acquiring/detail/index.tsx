import React, { useEffect, useState } from 'react';
import {
  terminalAcquiringEditData,
  terminalAcquiringEdit,
  terminalAcquiringAdd,
} from '../constants';
import { formatSearch } from '@/common/request-util';

import {
  Divider,
  Form,
  Button,
  notification,
  Input,
  DatePicker
} from 'antd';
import FixedFoot, { ErrorField } from '@/component/fixed-foot';
import { useHistory } from 'react-router-dom';
import { CustomFormItems } from '@/component/custom-form';
import { CustomFromItem } from '@/common/type';
import { RESPONSE_CODE } from '@/common/config';
import invariant from 'invariant';
import { useStore } from '@/pages/common/costom-hooks';
import { renderCommonSelectForm } from '@/component/form/render';
import { FormItmeType } from '@/component/form/type';
import { useSelectorHook } from '@/common/redux-util';
// import TextArea from 'antd/lib/input/TextArea';
const { TextArea } = Input;

const fieldLabels: any = {
  paramName: '参数名称',
  paramType: '参数类型',
  paramCode: '参数编号',
  applicableAppType: '适用的应用类型',
  enumValue: '枚举列表',
  paramLength: '长度',
  decimalPlaces: '小数位数',
  templateId: '模板id',
};

export default (props: any) => {
  console.log('props', props);
  const history = useHistory();
  const [form] = Form.useForm();
  const { loading } = useStore(['acquiring_param_belong_app', 'acquiring_param_type']);
  const common = useSelectorHook((state) => state.common);
  const search = props.location.search;
  const fields = formatSearch(search);
  const isEdit = !!fields.id;
  const [error, setError] = useState<ErrorField[]>([]);

  const [selectedParamsType, setSelectedParamsType] = useState('');
  /**
   * 如果是修改则请求详情
   */
  useEffect(() => {
    if (!!fields.id && !loading) {
      terminalAcquiringEditData({ id: fields.id }).then((response) => {
        setSelectedParamsType(response.data.paramType);
        form.setFieldsValue({
          paramName: response.data.paramName,
          paramType: response.data.paramType,
          paramCode: response.data.paramCode,
          applicableAppType: response.data.applicableAppType,
          enumValue: response.data.enumValue,
          paramLength: response.data.paramLength,
          decimalPlaces: response.data.decimalPlaces,
          paramValueText: response.data.paramValueText,
          paramValueInt: response.data.paramValueInt,
          paramValueFloat: response.data.paramValueFloat,
          paramValueDate: response.data.paramValueDate,
          paramValueEnum: response.data.paramValueEnum,
          remark: response.data.remark,
        });
      });
    }

  }, [loading]);

  useEffect(() => {
    const currentType = common.dictList?.acquiring_param_type?.data.find(d => d.dictValue === selectedParamsType);
    console.log('currentType', currentType);
  }, [selectedParamsType]);

  const onFinish = async () => {
    try {
      const values = await form.validateFields();
      const fetchUrl = isEdit ? terminalAcquiringEdit : terminalAcquiringAdd;
      const payload: any = isEdit
        ? { ...values, id: fields.id, }
        : { ...values, };
      console.log('payload', payload);
      const result = await fetchUrl(payload);
      console.log('result', result);
      invariant(result.code === RESPONSE_CODE.success, result.msg || ' ');
      notification.success({ message: '操作成功！' });
      history.goBack();
    } catch (error) {
      error.message && notification.warn({ message: error.message });
      setError(error?.errorFields);
    }
  };

  const forms: CustomFromItem[] = [
    {
      label: '参数编号',
      key: 'paramCode',
      requiredType: 'input',
    },
    {
      label: '参数名称',
      key: 'paramName',
      requiredType: 'input',
    },
    {
      label: '适用应用名称',
      key: 'applicableAppType',
      requiredText: '请选择适用应用名称',
      render: () =>
        renderCommonSelectForm({
          formName: 'applicableAppType',
          formType: FormItmeType.SelectCommon,
          dictList: 'acquiring_param_belong_app',
        }, false)
    },
    {
      // 1文本 2整形 3浮点 4日期 5枚举
      label: '参数类型',
      key: 'paramType',
      requiredText: '请选择参数类型',
      render: () =>
        renderCommonSelectForm({
          formName: 'paramType',
          formType: FormItmeType.SelectCommon,
          dictList: 'acquiring_param_type',
          onChange: (value) => {
            setSelectedParamsType(value);
          }
        }, false)
    },
    {
      ...selectedParamsType === '1' ? {
        label: '文本',
        key: 'paramValueText',
        render: () => {
          return (
            <Input
              // 如果不是文本类型则不能输入
              disabled={selectedParamsType !== '1'}
            />
          )
        }
      } : {} as any
    },
    {
      ...selectedParamsType === '2' ? {
        label: '整数',
        key: 'paramValueInt',
        render: () => {
          return (
            <Input
              type='number'
              // 如果不是文本类型则不能输入
              disabled={selectedParamsType !== '2'}
            />
          )
        }
      } : {} as any
    },
    {
      ...selectedParamsType === '3' ? {
        label: '浮点型',
        key: 'paramValueFloat',
        render: () => {
          return (
            <Input
              type='number'
              // 如果不是浮点类型则不能输入
              disabled={selectedParamsType !== '3'}
            />
          )
        }
      } : {} as any
    },
    {
      ...selectedParamsType === '4' ? {
        label: '日期',
        key: 'paramValueDate',
        render: () => {
          return (
            <DatePicker
              style={{ width: '100%' }}
              disabled={selectedParamsType !== '4'}
            />
          )
        }
      } : {} as any
    },
    {
      ...selectedParamsType === '5' ? {
        label: '枚举列表',
        key: 'paramValueEnum',
        render: () => {
          return (
            <Input
              // 如果不是枚举类型则不能输入
              disabled={selectedParamsType !== '5'}
            />
          )
        }
      } : {} as any
    },
    {
      label: '备注',
      key: 'remark',
      requiredType: 'input',
      render: () => <TextArea rows={5} />
    }
  ].filter(t => !!t.key);

  return (
    <div>
      <Form form={form}>
        <Divider orientation="left">【参数配置】</Divider>
        <CustomFormItems items={forms} />
      </Form>
      <FixedFoot errors={error} fieldLabels={fieldLabels}>
        <Button type="primary" onClick={onFinish as any}>
          提交
        </Button>
        <Button onClick={() => history.goBack()}>返回</Button>
      </FixedFoot>
    </div>
  );
};
