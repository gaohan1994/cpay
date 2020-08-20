import React, { useState } from 'react';
import { Divider, Form, Button, Skeleton, Col } from 'antd';
import { merge } from 'lodash';
import { useQueryParam } from '@/common/request-util';
import { useDetail } from './costom-hooks';
import BaseParam from './component/base-param';
import { DetailType } from '../types';
import './component/index.scss';

const prefix = 'terminal-params-component-detail';

const Institution = () => {
  // const
};

/**
 * 终端参数设置
 */
export default () => {
  const id = useQueryParam('id');
  const type = useQueryParam('type');
  /**
   * 第一步初始化数据
   * 第二步
   * 1、新增则
   */
  const { terminalParams } = useDetail(id, type);
  const baseInitialValue = merge(
    {},
    (terminalParams && terminalParams.params) || {}
  );
  const initialValues = {
    base: type === DetailType.ADD ? {} : baseInitialValue,
  };
  const initToken = type === DetailType.ADD ? true : !!terminalParams.params;

  const onFinish = (values: any) => {
    console.log('values:', values);
  };

  return (
    <div style={{ minWidth: '1000px' }}>
      {initToken && (
        <Form
          name="terminal_params"
          initialValues={initialValues}
          onFinish={onFinish}
        >
          <Divider orientation="left">【机构信息】</Divider>

          <Form.Item name="base">
            <BaseParam type={type} />
          </Form.Item>

          <div style={{ marginLeft: '210px', marginTop: 20 }}>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
            </Form.Item>
          </div>
        </Form>
      )}
    </div>
  );
};
