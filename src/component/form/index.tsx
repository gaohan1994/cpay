import React from 'react';
import { Form, Row } from 'antd';
import FormButton, { FormButtonProps } from '@/component/form-button';
import {
  FormItem,
  isNormalForm,
  isSelectForm,
  isCommonSelectForm,
  isCommonTreeSelectForm,
  isTreeSelectForm,
} from './type';
import {
  renderNormalForm,
  renderSelectForm,
  renderTreeSelectForm,
  renderCommonSelectForm,
  renderCommonTreeSelectForm,
} from './render';

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
function AdvertisementForm(props: Props) {
  const { forms, form, formButtonProps } = props;
  // 渲染表单按钮
  const { reset, submit, ...rest } = formButtonProps;

  return (
    <div>
      <Form form={form}>
        <Row gutter={24}>
          {forms && (
            <>
              {forms.map((item) => {
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
                if (!!isTreeSelectForm(item)) {
                  return renderTreeSelectForm(item);
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

export default AdvertisementForm;
