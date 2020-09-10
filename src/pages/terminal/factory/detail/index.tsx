import React, { useEffect, useState } from 'react';
import { Form, Button, notification, Input } from 'antd';
import { CustomFormItems } from '@/component/custom-form';
import { CustomFromItem } from '@/common/type';
import FixedFoot from '@/component/fixed-foot';
import { useHistory } from 'react-router-dom';
import { RESPONSE_CODE } from '@/common/config';
import invariant from 'invariant';
import { formatSearch } from '@/common/request-util';
import { firmEdit, terminalFirmDetail } from '../constants';

const { TextArea } = Input;

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
      terminalFirmDetail(field.id).then((response: any) => {
        if (response.code === RESPONSE_CODE.success) {
          form.setFieldsValue({
            firmId: response.data.code,
            firmName: response.data.firmName,
            publicKey: response.data.publicKey,
            tusnHeader: response.data.tusnHeader,
          });
          setCurrentModel(response.data);
        }
      });
    }
  }, [history.location]);

  const onSubmit = async () => {
    try {
      await form.validateFields();

      const fields = form.getFieldsValue();
      const payload = {
        id: currentModel.id,
        ...fields,
      };
      const result = await firmEdit(payload);
      invariant(result.code === RESPONSE_CODE.success, result.msg || ' ');
      notification.success({ message: '修改成功！' });
      history.goBack();
    } catch (errorInfo) {
      setError(errorInfo.errorFields);
    }
  };

  /**
   * @todo 表单数据
   */
  const forms: CustomFromItem[] = [
    {
      label: '厂商代码',
      key: 'firmId',
      requiredType: 'input' as any,
    },
    {
      label: '厂商名称',
      key: 'firmName',
      requiredType: 'input' as any,
    },
    {
      label: '终端公钥',
      key: 'publicKey',
      render: () => {
        return <TextArea />;
      },
    },
    {
      label: 'TUSN标识',
      key: 'tusnHeader',
      requiredType: 'input' as any,
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
