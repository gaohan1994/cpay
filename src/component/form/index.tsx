import React, { useState, useEffect } from 'react';
import { Form, Row, Col } from 'antd';
import FormButton, { FormButtonProps } from '@/component/form-button';
import {
  FormItem,
  isNormalForm,
  isSelectForm,
  isCommonSelectForm,
  isCommonTreeSelectForm,
  isTreeSelectForm,
  isCascaderFrom,
  isDatePickerForm,
} from './type';
import {
  renderNormalForm,
  renderSelectForm,
  renderTreeSelectForm,
  renderCommonSelectForm,
  renderCommonTreeSelectForm,
  renderCascaderForm,
  renderDatePickerForm,
} from './render';
import { useWindowSize } from './hooks';
import { merge } from 'lodash';

export type Props = {
  form: any; // antd 创建的form对象
  forms: Array<FormItem>; // 具体表单数据
  formButtonProps: FormButtonProps; // 搜索按钮props
};

/**
 * @todo 全局通用的form查询组件
 *
 * 搜搜条件按照特定规矩排序
 * 传入基础搜索条件
 * 传入高级搜索条件
 * 传入特定搜索条件
 *
 * @param {Props} props
 * @returns
 */
function CommonForm(props: Props) {
  const { forms, form, formButtonProps } = props;
  const { reset, submit, ...rest } = formButtonProps;
  /**
   * @param count 表单每行表格的数量
   */
  const [count, setCount] = useState(4);
  const { height, width } = useWindowSize();

  useEffect(() => {
    if (width <= 768) {
      setCount(3);
      return;
    }
    if (width <= 1200) {
      setCount(4);
      return;
    }
    if (width <= 1600) {
      setCount(6);
      return;
    }
    if (width <= 2000) {
      setCount(8);
      return;
    }
  }, [height, width]);

  const renderItem = (item: FormItem) => {
    if (!!isCommonTreeSelectForm(item)) {
      return renderCommonTreeSelectForm(item);
    }
    if (!!isCommonSelectForm(item)) {
      return renderCommonSelectForm(item);
    }
    if (!!isNormalForm(item)) {
      return renderNormalForm(item);
    }
    if (!!isSelectForm(item)) {
      return renderSelectForm(item);
    }
    if (!!isCascaderFrom(item)) {
      return renderCascaderForm(item);
    }
    if (!!isTreeSelectForm(item)) {
      return renderTreeSelectForm(item);
    }
    if (!!isDatePickerForm(item)) {
      return renderDatePickerForm(item);
    }
  };
  return (
    <div>
      <Form form={form}>
        <Row gutter={24}>
          {forms && (
            <>
              {forms.map((item) => {
                const mergeItem: any = merge({}, item);

                if (item.render) {
                  return item.render();
                } else {
                  const { span } = mergeItem;
                  const defaultSpan = 24 / count;
                  return (
                    <Col
                      span={
                        typeof span === 'number'
                          ? span > defaultSpan
                            ? span
                            : defaultSpan
                          : defaultSpan || 6
                      }
                    >
                      {renderItem(item)}
                    </Col>
                  );
                }
              })}
            </>
          )}
        </Row>
        <Row>
          <FormButton reset={reset} submit={submit} {...rest} />
        </Row>
      </Form>
    </div>
  );
}

export default CommonForm;
