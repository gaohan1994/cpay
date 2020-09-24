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
  Skeleton,
  Col,
  notification,
  Row,
  Spin,
  Input,
  Switch,
} from 'antd';
import FixedFoot, { ErrorField } from '@/component/fixed-foot';
import { useHistory } from 'react-router-dom';
import { CustomFormItems } from '@/component/custom-form';
import { CustomFromItem } from '@/common/type';
import { RESPONSE_CODE } from '@/common/config';
import invariant from 'invariant';

const fieldLabels: any = {
  paramName: '参数名称',
  paramType: '参数类型',
  paramCode: '参数编号',
  applicableAppType: '适用的应用类型',
  enumValue: '枚举值',
  paramLength: '长度',
  decimalPlaces: '小数位数',
  templateId: '模板id',
};

export default (props: any) => {
  console.log('props', props);
  const history = useHistory();
  const [form] = Form.useForm();
  const search = props.location.search;
  const fields = formatSearch(search);
  const isEdit = !!fields.id;
  const [error, setError] = useState<ErrorField[]>([]);

  /**
   * 如果是修改则请求详情
   */
  useEffect(() => {
    if (!!fields.id) {
      terminalAcquiringEditData({ id: fields.id }).then((response) => {
        console.log('response', response);
        form.setFieldsValue({
          paramName: response.data.paramName,
          paramType: response.data.paramType,
          paramCode: response.data.paramCode,
          applicableAppType: response.data.applicableAppType,
          enumValue: response.data.enumValue,
          paramLength: response.data.paramLength,
          decimalPlaces: response.data.decimalPlaces,
        });
      });
    }
  }, []);

  const onFinish = async () => {
    try {
      const values = await form.validateFields();
      const fetchUrl = isEdit ? terminalAcquiringEdit : terminalAcquiringAdd;
      const payload: any = isEdit ? { ...values, id: fields.id } : values;
      console.log('payload', payload);
      const result = await fetchUrl(payload);
      console.log('result', result);
      invariant(result.code === RESPONSE_CODE.success, result.msg || ' ');
      notification.success({ message: '操作成功！' });
      history.goBack();
    } catch (error) {
      notification.warn({ message: error.message || '操作失败' });
      setError(error?.errorFields);
    }
  };

  const getFormItems = (): CustomFromItem[] => {
    let formItems: CustomFromItem[] = [];
    for (let key in fieldLabels) {
      formItems.push({
        label: fieldLabels[key],
        key: key,
        requiredType: 'input',
      });
    }
    return formItems;
  };

  return (
    <div>
      <Form form={form}>
        <Divider orientation="left">【参数配置】</Divider>
        <CustomFormItems items={getFormItems()} />
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
