import React, { useState } from 'react';
import { Divider, Form, Button, Skeleton, Col, notification } from 'antd';
import { merge } from 'lodash';
import { useHistory } from 'react-router-dom';
import { useQueryParam } from '@/common/request-util';
import { useDetail } from './costom-hooks';
import BaseParam from './component/base-param';
import DeptParam from './component/dept-param';
import { DetailType } from '../types';
import './component/index.scss';
import invariant from 'invariant';
import { useStore } from '@/pages/common/costom-hooks';
import { TerminalParamItem } from '@/pages/terminal/params/types';
import { ITerminalParams } from './types';
import { useSelectorHook } from '@/common/redux-util';
import { terminalParamUpdate } from './constants';
import { RESPONSE_CODE } from '@/common/config';

type InitialValues = {
  base: ITerminalParams;
  dept: TerminalParamItem;
};

const prefix = 'terminal-params-component-detail';
/**
 * 终端参数设置
 */
export default () => {
  const history = useHistory();
  const [form] = Form.useForm();
  useStore([]);

  const [deptData] = useSelectorHook((state) => state.common.deptData);
  const id = useQueryParam('id');
  const type = useQueryParam('type');
  /**
   * 第一步初始化数据
   * 第二步
   */
  const { terminalParams } = useDetail(id, type);
  const baseInitialValue = merge(
    {},
    (terminalParams && terminalParams.params) || {}
  );
  const deptInitialValue = merge(
    {},
    (terminalParams && terminalParams.terminalParam) || {}
  );
  console.log('terminalParams:', terminalParams);
  const initialValues: InitialValues = {
    base:
      type === DetailType.ADD
        ? {}
        : {
            ...baseInitialValue,
            infoList:
              (deptInitialValue.paramContent &&
                deptInitialValue.paramContent.infoList) ||
              '',
          },
    dept: type === DetailType.ADD ? {} : deptInitialValue,
  } as any;
  const initToken = type === DetailType.ADD ? true : !!terminalParams.params;

  const formatParamsContent = (base: ITerminalParams) => {
    const mergeBase = merge({}, base);
    const baseParams: ITerminalParams = {
      ...mergeBase,
      infoList: base.infoList
        .split(/[\s\n]/)
        .filter((t) => !!t)
        .join('\n'),
    };
    console.log('baseParams', baseParams);
    return JSON.stringify(base);
  };

  const onFinish = async (values: typeof initialValues) => {
    try {
      console.log('values:', values);
      const payload = {
        deptId: values.dept?.deptId,
        groupId: values.dept?.groupId,
        paramContent: formatParamsContent(values.base),
        ...(type === DetailType.EDIT ? { id } : {}),
      };
      console.log('payload:', payload);
      const result = await terminalParamUpdate(type, payload);
      console.log('result', result);
      invariant(result.code === RESPONSE_CODE.success, result.msg || ' ');
      notification.success({ message: '操作成功！' });
      history.goBack();
    } catch (error) {
      notification.warn({ message: error.message });
    }
  };

  return (
    <div style={{ minWidth: '1000px' }}>
      {initToken && (
        <Form
          name="terminal_params"
          initialValues={initialValues}
          onFinish={onFinish as any}
        >
          <Form.Item name="dept">
            <DeptParam type={type} form={form} />
          </Form.Item>
          <Form.Item name="base">
            <BaseParam type={type} form={form} />
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
