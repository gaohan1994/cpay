import { InputProps } from 'antd/lib/input';
import { SelectProps, OptionProps } from 'antd/lib/select';
import { TreeSelectProps } from 'antd/lib/tree-select';
import { DeptTreeData } from '@/pages/common/type';
import { CascaderProps } from 'antd/lib/cascader';
import { DatePickerProps } from 'antd/lib/date-picker';
import { PickerProps } from 'antd/lib/date-picker/generatePicker';

/**
 * 表单项
 */
export type FormItem =
  | IComponentFormNormalForm
  | IComponentFormSelectForm
  | IComponentFormTreeSelectForm
  | IComponentFormCommonTreeSelectForm
  | IComponentFormCommonSelectForm
  | IComponentFormCascader
  | IComponentFormDatePicker;

export enum FormItmeType {
  Normal,
  Select,
  SelectCommon,
  TreeSelect,
  TreeSelectCommon,
  Cascader,
  DatePicker,
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
  formName: string[] | string;
  formType: FormItmeType.SelectCommon;
  dictList: string[] | string;
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

/**
 * 判断是否是连级选择
 *
 * @export
 * @param {FormItem} data
 * @returns {data is IComponentFormCascader}
 */
export function isCascaderFrom(data: FormItem): data is IComponentFormCascader {
  return (<IComponentFormCascader>data).formType === FormItmeType.Cascader;
}
/**
 * 连级选择
 */
export interface IComponentFormCascader extends FormBaseProps, CascaderProps {
  formType: FormItmeType.Cascader;
}

/**
 * 日期选择
 *
 * @export
 * @interface IComponentFormDatePicker
 * @extends {FormBaseProps}
 */
export interface IComponentFormDatePicker extends FormBaseProps {
  formType: FormItmeType.DatePicker;
}

export function isDatePickerForm(
  data: FormItem
): data is IComponentFormDatePicker {
  return (<IComponentFormDatePicker>data).formType === FormItmeType.DatePicker;
}
