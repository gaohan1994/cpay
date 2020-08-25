import React, { useEffect, useState } from 'react';
import { Form, Row, Col, Input, DatePicker } from 'antd';
import { useStore } from '@/pages/common/costom-hooks';
import { useSelectorHook } from '@/common/redux-util';
import {} from '@/component/form';

export default () => {
  const [form] = Form.useForm();
  useStore(['advert_file_type', 'advert_type', 'advert_device_screen_type']);
  const common = useSelectorHook((state) => state.common);
  console.log('common:', common);
  const initState = {};
  const [] = useState();
  useEffect(() => {
    // 请求组别
  }, []);

  const onFinish = (values: any) => {
    console.log('values:', values);
  };

  return (
    <div>
      <Form form={form} onFinish={onFinish}>
        <Form.Item
          label="名称"
          name="adName"
          rules={[
            {
              required: true,
              message: '请输入名称',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="有效起始时间"
          name="startTime"
          rules={[
            {
              required: true,
              message: '请选择起始时间',
            },
          ]}
        >
          <DatePicker />
        </Form.Item>
        <Form.Item
          label="有效结束时间"
          name="endTime"
          rules={[
            {
              required: true,
              message: '请选择结束时间',
            },
          ]}
        >
          <DatePicker />
        </Form.Item>
        <Form.Item
          label="有效结束时间"
          name="endTime"
          rules={[
            {
              required: true,
              message: '请选择结束时间',
            },
          ]}
        >
          <DatePicker />
        </Form.Item>
      </Form>
    </div>
  );
};
