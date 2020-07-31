import { InputProps } from 'antd/lib/input';
import { SelectProps, OptionProps } from 'antd/lib/select';
import { TreeSelectProps } from 'antd/lib/tree-select';
import { DeptTreeData } from '@/pages/common/type';

/**
 * 表单项
 */
export type FormItem =
  | IComponentFormNormalForm
  | IComponentFormSelectForm
  | IComponentFormTreeSelectForm
  | IComponentFormCommonTreeSelectForm
  | IComponentFormCommonSelectForm;

export enum FormItmeType {
  Normal,
  Select,
  SelectCommon,
  TreeSelect,
  TreeSelectCommon,
}

/**
 * 表单基础属性
 */
export type FormBaseProps = {
  formName: string;
  formType: FormItmeType;
  span?: number;
};

/**
 * 判断是否是普通表单项
 * @param data
 */
export function isNormalForm(data: FormItem): data is IComponentFormNormalForm {
  return (<IComponentFormNormalForm>data).formType === FormItmeType.Normal;
}

/**
 * 搜索表单项
 */
export interface IComponentFormNormalForm extends FormBaseProps, InputProps {
  formType: FormItmeType.Normal;
}

/**
 * 判断是否是通用下拉框表单项
 * @param data
 */
export function isSelectForm(data: FormItem): data is IComponentFormSelectForm {
  return (<IComponentFormSelectForm>data).formType === FormItmeType.Select;
}
/**
 * 下拉框表单项
 */
export interface IComponentFormSelectForm
  extends FormBaseProps,
    SelectProps<any> {
  formType: FormItmeType.Select;
  selectData: Array<{
    value: string;
    title: string;
  }>;
}

/**
 * 判断是否是下拉框表单项
 * @param data
 */
export function isCommonSelectForm(
  data: FormItem
): data is IComponentFormCommonSelectForm {
  return (
    (<IComponentFormCommonSelectForm>data).formType ===
    FormItmeType.SelectCommon
  );
}
/**
 * 下拉框表单项
 */
export interface IComponentFormCommonSelectForm extends SelectProps<any> {
  formName: string[];
  formType: FormItmeType.SelectCommon;
  dictList: string[];
}

/**
 * 判断是否是下拉框表单项
 * @param data
 */
export function isTreeSelectForm(
  data: FormItem
): data is IComponentFormTreeSelectForm {
  return (
    (<IComponentFormTreeSelectForm>data).formType === FormItmeType.TreeSelect
  );
}
/**
 * 下拉框表单项
 */
export interface IComponentFormTreeSelectForm
  extends FormBaseProps,
    TreeSelectProps<any> {
  formType: FormItmeType.TreeSelect;
  treeSelectData: DeptTreeData[];
}

/**
 * 判断是否是通用下拉框表单项
 * @param data
 */
export function isCommonTreeSelectForm(
  data: FormItem
): data is IComponentFormCommonTreeSelectForm {
  return (
    (<IComponentFormCommonTreeSelectForm>data).formType ===
    FormItmeType.TreeSelectCommon
  );
}

export interface IComponentFormCommonTreeSelectForm
  extends FormBaseProps,
    TreeSelectProps<any> {
  formType: FormItmeType.TreeSelectCommon;
}
