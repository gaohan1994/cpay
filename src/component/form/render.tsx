import React from 'react';
import {
  Col,
  Form,
  Input,
  Select,
  TreeSelect,
  Cascader,
  DatePicker,
} from 'antd';
import { DeptTreeData } from '@/pages/common/type';
import {
  IComponentFormNormalForm,
  IComponentFormSelectForm,
  IComponentFormTreeSelectForm,
  IComponentFormCommonSelectForm,
  IComponentFormCommonTreeSelectForm,
  FormItmeType,
  IComponentFormCascader,
  IComponentFormDatePicker,
} from './type';
import { useSelectorHook } from '@/common/redux-util';

const { Item } = Form;
const { Option } = Select;
const { TreeNode } = TreeSelect;

export function ComponentContainer(props: any) {
  const { span, formName, formProps } = props;
  return (
    <Col span={span || 6}>
      <Item name={formName} {...formProps}>
        {props.children}
      </Item>
    </Col>
  );
}

/**
 * 渲染treeSelect
 */
export function renderTreeHelper(data: DeptTreeData) {
  // 有叶子节点
  if (!!data.children) {
    return (
      <TreeNode key={data.id} value={data.id} title={data.name}>
        {data.children.map((item) => {
          return renderTreeHelper(item);
        })}
      </TreeNode>
    );
  }
  // 无叶子结点
  return <TreeNode key={data.id} value={data.id} title={data.name} />;
}

/**
 * 获得要渲染字典的select数据
 * @param dictList
 */
export function UseCommonSelectData(
  dictList: string[],
  formName: string[] = []
): IComponentFormSelectForm[] {
  const state = useSelectorHook((state) => state.common.dictList);

  /**
   * 要渲染的字典数据
   * @param {renderDictList}
   */
  const renderDictListData: IComponentFormSelectForm[] = dictList
    .map((listItem) => state[listItem] || [])
    .filter((i) => !!i)
    .map((item, index) => {
      return !!item.dictType
        ? {
            formName: formName[index] || item.dictType,
            placeholder: item.dictName,
            formType: FormItmeType.Select,
            selectData: item.data.map((option) => {
              return {
                value: option.dictValue,
                title: option.dictLabel,
              };
            }),
          }
        : (undefined as any);
    })
    .filter((d) => !!d);

  return renderDictListData;
}

export function renderTreeSelect(data: IComponentFormTreeSelectForm) {
  const { formName, span, treeSelectData, formType, ...rest } = data;
  return (
    <TreeSelect
      key={formName}
      treeDefaultExpandAll
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      {...rest}
    >
      {treeSelectData.map((item) => {
        return renderTreeHelper(item);
      })}
    </TreeSelect>
  );
}

/**
 * 渲染树形结构表单
 * @param data
 */
export function renderTreeSelectForm(
  data: IComponentFormTreeSelectForm,
  isFrom?: boolean
) {
  const { formName, span, treeSelectData, formProps, ...rest } = data;
  if (isFrom !== false) {
    return (
      <ComponentContainer {...data} key={formName}>
        {renderTreeSelect(data)}
      </ComponentContainer>
    );
  } else {
    return renderTreeSelect(data);
  }
}

/**
 * 渲染普通表单查询条件
 * @param data
 */
export function renderNormalForm(data: IComponentFormNormalForm) {
  const { formName, span, formType, ...rest } = data;
  return (
    <ComponentContainer {...data}>
      <Input {...rest} />
    </ComponentContainer>
  );
}

/**
 * 渲染下拉框函数
 * @param data
 */
export function renderSelect(data: IComponentFormSelectForm) {
  const { formName, span, selectData, formType, ...rest } = data;
  return (
    <Select {...rest} key={formName}>
      {Array.isArray(selectData) &&
        selectData.length > 0 &&
        selectData.map((option) => {
          const { value, title, ...optionRest } = option;
          return (
            <Option value={value} key={value} {...optionRest}>
              {title}
            </Option>
          );
        })}
    </Select>
  );
}

/**
 * 渲染下拉框函数
 * @param data
 */
export function renderSelectForm(
  data: IComponentFormSelectForm,
  isForm?: boolean
) {
  const { formName, span } = data;
  if (isForm !== false) {
    return (
      <ComponentContainer {...data}>{renderSelect(data)}</ComponentContainer>
    );
  } else {
    return renderSelect(data);
  }
}

/**
 * 渲染通用字典下拉框
 * @param data
 */
export function renderCommonSelectForm(
  data: IComponentFormCommonSelectForm,
  isForm?: boolean
) {
  const { dictList, formName, ...rest } = data;

  /**
   * 如果是多个字典则直接渲染多个
   */
  if (Array.isArray(dictList) && Array.isArray(formName)) {
    const renderDictListData = UseCommonSelectData(dictList, formName);
    return (
      <>
        {renderDictListData.map((item) => {
          return renderSelectForm(item, isForm);
        })}
      </>
    );
  }

  const renderDictListData = UseCommonSelectData(
    [dictList] as string[],
    [formName] as string[]
  );
  const targetDictData = renderDictListData[0];
  return renderSelectForm(
    {
      ...rest,
      ...targetDictData,
    },
    isForm
  );
}

/**
 * 渲染通用字典下拉框
 * @param data
 */
export function renderCommonTreeSelectForm(
  data: IComponentFormCommonTreeSelectForm,
  isForm?: boolean
) {
  const UseCommonTreeSelectData = (): IComponentFormTreeSelectForm => {
    const state = useSelectorHook((state) => state.common.deptTreeData);
    const { formName, ...rest } = data;
    return {
      ...rest,
      formType: FormItmeType.TreeSelect,
      formName: formName || 'deptId',
      treeSelectData: state,
      placeholder: '所属机构',
    };
  };

  return renderTreeSelectForm(UseCommonTreeSelectData(), isForm);
}

export function renderCascader(data: IComponentFormCascader) {
  const { formName, span, ...rest } = data;
  return <Cascader {...rest} key={formName} />;
}

export function renderCascaderForm(
  data: IComponentFormCascader,
  isForm?: boolean
) {
  const { formName, span, ...rest } = data;
  if (isForm !== false) {
    return (
      <ComponentContainer {...data}>{renderCascader(data)}</ComponentContainer>
    );
  } else {
    return renderCascader(data);
  }
}

export function renderDatePickerForm(data: IComponentFormDatePicker) {
  const { formName, span, ...rest } = data;

  return (
    <ComponentContainer {...data}>
      <DatePicker style={{ width: '100%' }} {...rest} />
    </ComponentContainer>
  );
}
