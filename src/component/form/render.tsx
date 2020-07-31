import React from 'react';
import { Col, Form, Input, Select, TreeSelect } from 'antd';
import { DeptTreeData } from '@/pages/common/type';
import {
  IComponentFormNormalForm,
  IComponentFormSelectForm,
  IComponentFormTreeSelectForm,
  IComponentFormCommonSelectForm,
  IComponentFormCommonTreeSelectForm,
  FormItmeType,
} from './type';
import { useSelectorHook } from '@/common/redux-util';

const { Item } = Form;
const { Option } = Select;
const { TreeNode } = TreeSelect;

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
    .map((listItem) => state[listItem])
    .filter((i) => !!i)
    .map((item, index) => {
      return {
        formName: formName[index] || item.dictType,
        placeholder: item.dictName,
        formType: FormItmeType.Select,
        selectData: item.data.map((option) => {
          return {
            value: option.dictValue,
            title: option.dictLabel,
          };
        }),
      };
    });

  return renderDictListData;
}

/**
 * 渲染树形结构表单
 * @param data
 */
export function renderTreeSelectForm(data: IComponentFormTreeSelectForm) {
  const { formName, span, treeSelectData, ...rest } = data;
  return (
    <Col span={span || 6}>
      <Item name={formName}>
        <TreeSelect
          treeDefaultExpandAll
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          {...rest}
        >
          {treeSelectData.map((item) => {
            return renderTreeHelper(item);
          })}
        </TreeSelect>
      </Item>
    </Col>
  );
}

/**
 * 渲染普通表单查询条件
 * @param data
 */
export function renderNormalForm(data: IComponentFormNormalForm) {
  const { formName, span, ...rest } = data;
  return (
    <Col span={span || 4} key={formName}>
      <Item name={formName}>
        <Input {...rest} />
      </Item>
    </Col>
  );
}

/**
 * 渲染下拉框函数
 * @param data
 */
export function renderSelectForm(data: IComponentFormSelectForm) {
  const { formName, span, selectData, ...rest } = data;
  return (
    <Col span={span || 4} key={formName}>
      <Item name={formName}>
        <Select {...rest}>
          {selectData.map((option) => {
            const { value, title, ...optionRest } = option;
            return (
              <Option value={value} key={value} {...optionRest}>
                {title}
              </Option>
            );
          })}
        </Select>
      </Item>
    </Col>
  );
}

/**
 * 渲染通用字典下拉框
 * @param data
 */
export function renderCommonSelectForm(data: IComponentFormCommonSelectForm) {
  const { dictList, formName } = data;
  const renderDictListData = UseCommonSelectData(dictList, formName);
  return (
    <>
      {renderDictListData.map((item) => {
        return renderSelectForm(item);
      })}
    </>
  );
}

/**
 * 渲染通用字典下拉框
 * @param data
 */
export function renderCommonTreeSelectForm(
  data: IComponentFormCommonTreeSelectForm
) {
  const UseCommonTreeSelectData = (): IComponentFormTreeSelectForm => {
    const state = useSelectorHook((state) => state.common.deptTreeData);
    return {
      formType: FormItmeType.TreeSelect,
      formName: data.formName || 'deptId',
      treeSelectData: state,
      placeholder: '所属机构',
    };
  };

  return renderTreeSelectForm(UseCommonTreeSelectData());
}
