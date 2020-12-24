[TOC]

# 框架部分

## 一、项目技术

react-hooks 作为数据驱动和数据存储的技术详细使用说明参考资料如下

[react-hooks 文档](https://react.docschina.org/docs/hooks-intro.html)

## 二、项目目录说明

```javascript
|-- build // 项目打包之后的文件
|-- config // 项目webpack配置信息
|-- node_modules // 项目所谓要的包文件
|-- public // 项目静态资源
|-- scripts // 项目启动命令
|-- src
  |-- assets // 静态资源
  |-- common // 公用类和工具
    |-- request-util.js // 封装好的请求接口文件
    |-- config.ts // 项目配置信息
    |-- history-util.ts // 项目路由工具
    |-- menu-config.ts // 项目menu配置信息
    |-- redux-util.ts // 项目redux配置信息
    |-- route-config.ts // 项目路由配置信息
    |-- util.ts // 项目常用小工具
    |-- validator.ts // 项目校验工具
  |-- component // 组件库
    |-- checkbox-group // 多选组件
    |-- custom-form // 自定义form组件
    |-- fixed-foot // 自定义底部组件
    |-- form // 封装好的表单组件
    |-- form-button // 封装好的表单按钮组件与form配套
    |-- modal // 封装好的模态框组件
    |-- table // 封装好的table组件
  |-- modules // 项目模块
    |-- layout-container // 项目整体样式架构
    |-- redux-store // 项目redux架构
    |-- route-container // 项目路由架构
  |-- pages // 页面文件集合
  |-- index.tsx // 入口文件
```

## 三、项目架构

项目路由架构

首先通过函数把各个模块配置的树形结构的路由扁平化至一层，在通过渲染模式渲染，同时访问第三级路由的时候也可以在面包屑返回到二级路由

```javascript
const formatMenuConfig = (menuList: any[]) => {
  if (!Array.isArray(menuList) || !menuList.length) {
    return [];
  }
  const arr = menuList.map((item) => {
    const obj: ILayoutSiderMenu = {
      name: item.menuName,
      icon: item.icon,
      path: item.url && item.url.substring(1, item.url.length),
      value: item.url && item.url.substring(1, item.url.length),
    };
    Array.isArray(item.children) &&
      item.children.length &&
      (obj.subMenus = formartChildren(item.children));
    return obj;
  });
  arr.unshift({
    name: '主页',
    icon: 'HomeOutlined',
    path: 'home',
    value: 'home',
  });
  return arr;
};
```

```tsx
<BrowserRouter>
  <Router history={history}>
    <Switch>
      {login && <Route key={'login'} {...login} />}
      <LayouContainer menus={formatMenuConfig(menus)}>
        {routes.map((item: WebNavigator, index: number) => {
          const { ...rest } = item;
          return <Route key={index} {...rest} />;
        })}
      </LayouContainer>
    </Switch>
  </Router>
</BrowserRouter>
```

全局级别的初始化函数初始化字典数据、并缓存入 redux 中

```ts
/**
 * 全局通用级别的初始化函数
 *
 * @export
 * @param {string} dictType
 */
export function useStore(dictType: string[]): CommonHooksState {
  // const [state, dispatch] = useRedux(common, initState);
  const [useSelector, dispatch] = useRedux();
  const state = useSelector((state) => state.common);
  const parentId = state?.userDept?.parentId;

  const [timer, setTimer] = useState(0);

  const getDeptCallback = useCallback((deptData: GetDeptTreeDataCallback) => {
    const [data, treeData] = deptData;
    dispatch({
      type: ACTION_TYPES_COMMON.RECEIVE_DEPT_DATA,
      payload: data,
    });
    dispatch({
      type: ACTION_TYPES_COMMON.RECEIVE_DEPT_TREE_DATA,
      payload: treeData,
    });
  }, []);

  const getDictListCallback = useCallback((dictList: DictItem[]) => {
    if (dictList.length === 0) {
      return;
    }

    dictList.map((item) => {
      dispatch({
        type: ACTION_TYPES_COMMON.RECEIVE_DICT_LIST,
        payload: {
          dictType: item.dictType,
          data: {
            dictName: item.dictName || '',
            dictType: item.dictType || '',
            data: item.dictDataList || [],
          },
        },
      });
    });
  }, []);

  useEffect(() => {
    /**
     * 请求机构数据
     * @time 1014加入缓存机制，全局请求一次
     */
    getDeptTreeData(getDeptCallback);
    setTimer((prevTimer) => prevTimer + 1);
  }, [parentId]);

  useEffect(() => {
    /**
     * 请求字典数据
     */
    const promises =
      dictType.length > 0 && getDictList(dictType, getDictListCallback);
  }, []);

  const isLoading = () => {
    let flag = false;
    for (let i = 0; i < dictType.length; i++) {
      if (!(dictType[i] && state.dictList && state.dictList[dictType[i]])) {
        flag = true;
        break;
      }
    }
    return flag;
  };

  return {
    deptList: state.deptData,
    deptTreeList: state.deptTreeData,
    dictList: state.dictList || ({} as any),
    loading: isLoading(),
  };
}
```

自定义组件库：

form 组件

首先定义组件类型、渲染对应组件 （只截取部分）其中与项目的字典数据进行了结合在创建的时候可以直接使用字典数据

```ts
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
  render?: any;
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
  render?: any;
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
  nodeKey?: string;
  nodeTitle?: string;
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
  formType: FormItmeType.TreeSelectCommon | FormItmeType.TreeSelect;
  treeSelectData?: any[];
  nodeKey?: string;
  nodeTitle?: string;
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
export type IComponentFormDatePicker = {
  formType: FormItmeType.DatePicker;
} & FormBaseProps &
  DatePickerProps;

export function isDatePickerForm(
  data: FormItem
): data is IComponentFormDatePicker {
  return (<IComponentFormDatePicker>data).formType === FormItmeType.DatePicker;
}
```

```tsx
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
```
