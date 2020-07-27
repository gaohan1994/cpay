import React, { useEffect, useState } from 'react';
import { useMount } from 'ahooks';
import { Form, Row, Col, Input, Button } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router';
import './index.scss';

type Props = {};

export default (props: Props) => {
  const history = useHistory();
  useMount(() => {
    console.log('history', history);
  });
  const [form] = Form.useForm();

  const getFields = () => {
    const count = 10;
    const children = [];
    for (let i = 0; i < count; i++) {
      children.push(
        <Form.Item name={`field-${i}`} label={`Field ${i}`}>
          <Input placeholder='placeholder' />
        </Form.Item>
      );
    }
    return children;
  };

  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
  };

  return (
    <Form
      form={form}
      name='advanced_search'
      className='ant-advanced-search-form'
      onFinish={onFinish}
    >
      <Row style={{ padding: 12 }}>
        <Col span={12}>
          {getFields()}
          <Col style={{ textAlign: 'left' }}>
            <Button type='primary' htmlType='submit'>
              通过
            </Button>
            <Button
              style={{ margin: '0 8px' }}
              onClick={() => {
                form.resetFields();
              }}
            >
              不通过
            </Button>
          </Col>
        </Col>
        <Col span={12}>asd</Col>
      </Row>
    </Form>
  );
};
