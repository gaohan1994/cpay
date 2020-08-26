import React from 'react';
import { Row, Col, Form, Input } from 'antd';
import { getFormCommonRules } from '@/pages/upload/common/util';
import { renderSelectForm } from '@/component/form/render';
import { FormItmeType } from '@/component/form/type';
import { CustomFromItem } from '@/common/type';

interface CustomSelctFromItenDataProps {
  label: string;
  key: string;
  value?: any;
  onChange?: Function;
  setValue?: Function;
  list: any[];
  valueKey: string;
  nameKey: string;
  required?: boolean
}
export function getCustomSelectFromItemData(props: CustomSelctFromItenDataProps) {
  const { label, key, value, onChange, setValue, list, valueKey, nameKey, required } = props;
  return {
    label: label,
    key: key,
    requiredType: required && 'select' as any,
    render: () =>
      <CustomSelectFormItem
        label={label}
        selectData={
          (list &&
            list.map((item: any) => {
              return {
                value: item[valueKey],
                title: `${item[nameKey]}`,
              };
            })) ||
          []}
        value={value}
        onChange={(id: string) => {
          onChange ? onChange(id) : setValue && setValue(id);
        }}
      />
  }
}

export interface CustomSelectFormItemProps {
  selectData?: Array<{
    value: string;
    title: string;
  }>,
  value?: any;
  onChange?: any;
  label: string;
}

export function CustomSelectFormItem(props: CustomSelectFormItemProps) {
  return renderSelectForm(
    {
      placeholder: `请选择${props.label}`,
      formName: 'id',
      formType: FormItmeType.Select,
      selectData: props.selectData,
      value: props.value,
      onChange: props.onChange,
      span: 24
    } as any, false
  )
}

export const ButtonLayout = {
  wrapperCol: {
    offset: 3,
    span: 16,
  }
}

const FormItemLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 14
  }
}

const SingleFormItemLayout = {
  labelCol: {
    span: 3,
  },
  wrapperCol: {
    span: 8,
  },
}

const ItemSingleFormItemLayout = {
  labelCol: {
    span: 3,
  },
  wrapperCol: {
    span: 19,
  },
}

export interface CustomFormItemsProps {
  items: CustomFromItem[],
  singleCol?: boolean;
}
export function CustomFormItems(props: CustomFormItemsProps) {
  const { items, singleCol } = props;

  return (
    <Row gutter={24}>
      {
        items.map(item => {
          const { label, key, render, requiredText, requiredType, show = true, itemSingleCol, ...rest } = item;
          if (!show) {
            return <div key={key} />;
          }
          let rules = (requiredType || requiredText) ? getFormCommonRules(label, requiredType || 'input', requiredText) : [];
          let formLayout = singleCol ? SingleFormItemLayout : FormItemLayout;
          formLayout = itemSingleCol ? ItemSingleFormItemLayout : formLayout;
          return (
            <Col span={(singleCol || itemSingleCol) ? 24 : 12} key={key}>
              <Form.Item label={label} name={key} rules={rules} {...formLayout} {...rest}>
                {
                  render
                    ? render()
                    : <Input />
                }
              </Form.Item>
            </Col>
          )
        })
      }
    </Row>
  )
}