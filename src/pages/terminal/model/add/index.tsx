import React, { useEffect, useState } from 'react';
import { Table, Form, Button, notification, Select, Radio } from 'antd';
import {
  CustomFormItems,
  getCustomSelectFromItemData,
} from '@/component/custom-form';
import { CustomFromItem } from '@/common/type';
import { terminalFirmList as getTerminalFirmList } from '../../constants';
import FixedFoot from '@/component/fixed-foot';
import {
  terminalTypeAdd,
  terminalTypeDetail,
  terminalTypeEdit,
} from '../constants';
import { useHistory } from 'react-router-dom';
import { RESPONSE_CODE } from '@/common/config';
import invariant from 'invariant';
import { formatSearch } from '@/common/request-util';

export default () => {
  const history = useHistory();
  const [form] = Form.useForm();
  const [currentModel, setCurrentModel] = useState({} as any);
  const [terminalFirmList, setTerminalFirmList] = useState([] as any[]);
  const [firmValue, setFirmValue] = useState('');
  const [error, setError] = useState<any[]>([]);

  useEffect(() => {
    const { search } = history.location;
    const field = formatSearch(search);
    if (field.id) {
      terminalTypeDetail({ id: field.id }).then((response) => {
        if (response.code === RESPONSE_CODE.success) {
          form.setFieldsValue({
            typeCode: response.data.typeCode,
            typeName: response.data.typeName,
            firmId: response.data.firmId,
            status: response.data.status,
          });
          setCurrentModel(response.data);
        }
      });
    }
  }, [history.location]);

  useEffect(() => {
    getTerminalFirmList({}, setTerminalFirmList);
  }, []);

  const onSubmit = async () => {
    try {
      const isEdit = !!currentModel.id;
      const fetchUrl = isEdit ? terminalTypeEdit : terminalTypeAdd;
      await form.validateFields();

      const fields = form.getFieldsValue();
      const payload = isEdit
        ? {
          id: currentModel.id,
          ...fields,
        }
        : {
          ...fields,
        };
      const result = await fetchUrl(payload);
      invariant(result.code === RESPONSE_CODE.success, result.msg || ' ');
      notification.success({ message: isEdit ? '修改成功！' : '添加成功！' });
      history.goBack();
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
      setError(errorInfo.errorFields);
    }
  };

  /**
   * @todo 表单数据
   */
  const forms: CustomFromItem[] = [
    {
      label: '型号代码',
      key: 'typeCode',
      requiredType: 'input' as any,
    },
    {
      label: '型号名称',
      key: 'typeName',
      requiredType: 'input' as any,
    },
    {
      ...getCustomSelectFromItemData({
        label: '终端厂商',
        key: 'firmId',
        value: firmValue,
        list: terminalFirmList,
        valueKey: 'id',
        nameKey: 'firmName',
        required: true,
        onChange: (id: any) => {
          setFirmValue(id);
        },
      }),
    },
    {
      label: '是否启用',
      key: 'status',
      render: () => {
        return (
          <Radio.Group>
            <Radio value={0}>是</Radio>
            <Radio value={1}>否</Radio>
          </Radio.Group>
        );
      },
    },
  ];
  return (
    <div style={{ paddingTop: 10 }}>
      <Form
        form={form}
        className="ant-advanced-search-form"
        style={{ backgroundColor: 'white' }}
      >
        <CustomFormItems items={forms} singleCol={true} />
        <FixedFoot errors={error} fieldLabels={[]}>
          <Button type="primary" onClick={onSubmit}>
            提交
          </Button>
          <Button onClick={() => history.goBack()}>返回</Button>
        </FixedFoot>
      </Form>
    </div>
  );
};
