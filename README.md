[TOC]

# 项目文档

## 使用的技术

项目主要使用了[react](https://react.docschina.org/)函数组件结合hook进行开发

同时也使用了[redux](https://www.redux.org.cn/)，[react-redux](https://www.redux.org.cn/docs/react-redux/)，[Antd组件库](https://ant.design/)，[ahooks](https://ahooks.js.org/)



## 构建与部署

```bash
npm i			# 下载依赖包
npm start		# 运行项目
npm run build	# 编译项目
```

### 部署到非根目录

webpack.config.js文件中的publicPath为：

```js
const publicUrlOrPath = getPublicUrlOrPath(
  process.env.NODE_ENV === 'development',
  require(resolveApp('package.json')).homepage,
  process.env.PUBLIC_URL
);
```

我们只需要在package.json文件中加入 `"homepage": "."` 就可以了



## 目录结构

```bash
config				# webpack配置
src
├──	assets			# 图片文件夹
├──	commom			# 全局配置以及全局工具包
├──	components		# 组件
├──	modules
│   ├──	layout-container	# 页面布局容器
│   ├──	redux-store			# 仓库
│   └──	route-container		# 路由配置容器
├──	pages			# 所有页面组件
│   ├──	common		# 页面通用文件，比如字典
│   ├──	exception	# 报错页面如404
│   └──	application	# 应用管理模块
│	│   ├── common		# 工具类文件
│	│   ├── reducer		# redux
│	│   ├── constants	# 接口
│	│   ├── types		# ts类型文件
│	│   ├── publish		# 子模块 应用发布模块
│	│   └── route.tsx	# 本模块路由
└──	index.tsx	# 入口文件
```



## 开发

### 新建页面

在page文件夹下创建对应模块文件夹，以及route.ts文件，进行对应路由配置

在src/common/route-config文件引入route.ts，路由就配置好了

在菜单管理页面新建菜单，路径字段填写需要和自定义的路由对应起来就可以了



### 列表

使用ahooks的useAntdTable

1. 创建表格

   ```tsx
   /*
    * 如果已经有数据了，想直接展示，添加dataSource属性就可以了
    */
   <Table
     rowKey={'id'}
     columns={columns}
     {...tableProps}
     rowSelection={
       selectedRowKeys,
       onChange: setSelectedRowKeys,
     }
     pagination={getStandardPagination(tableProps.pagination)}
   />
   ```

2. 获取列表数据信息

   ```tsx
   import { useAntdTable } from 'ahooks';
   const { tableProps, search }: any = useAntdTable(
     (paginatedParams, tableProps) => tmsAccessList({ ...tableProps, ...formatPaginate(paginatedParams) }),
     { form, formatResult: formatListResult }
   );
   ```

3. 创建列

   ```tsx
   const columns = const columns = createTableColumns([
     // 普通展示
     {
       title: '终端序列号',
       dataIndex: 'tusn',
     },
   ])
   ```

4. 自定义展示列字段

   ```tsx
   columns.push(
     {
       title: '操作',
       render: (item: any) => (
         <div>
           <a onClick={() => history.push(`/advertisement/apply/detail?id=${item.id}`)}>详情</a>
           <Divider type='vertical' />
           <a onClick={() => onDelete(item.id)}>删除</a>
         </div>
       ),
       fixed: 'left',
     },
   )
   ```

5. 字典类型展示列字段

   ```tsx
   columns.push(
     {
       title: '广告类型',
       dataIndex: 'type',
       dictType: 'advert_type',
     }
   )
   ```



### 表单

一般有两种表单，一种是表格的筛选表单，一种是普通的表单，本项目也分开进行封装，使用上也有些不同，在这里分别展开说明，

- #### 表格筛选表单

  1. 创建表单

     ```tsx
     import Forms from '@/component/form';
     <Forms
       form={form}
       forms={forms}
       formButtonProps={{
         reset,
         submit,
         extraButtons,
       }}
     />
     ```

  2. 创建按钮

     ```tsx
     const { reset, submit } = search;	// search是useAntdTable返回的
     const extraButtons: ButtonProps[] = [
       {
         title: '导出',
         icon: <LogoutOutlined />,
         type: 'primary',
         onClick: onExport,
       },
     ];
     ```

  3. 创建表单项

     ```tsx
     const forms: FormItem[] = [
       // 普通表单
       {
         placeholder: '终端序列号',
         formName: 'tusn',
         formType: FormItmeType.Normal,
       },
     ]
     ```

  4. 字典下拉框类型的表单

     ```tsx
     forms.push(
       {
         formName: 'adFileType',
         formType: FormItmeType.SelectCommon,
         dictList: 'advert_file_type',
       },
     )
     ```

  5. 下拉框类型表单

     ```tsx
     forms.push(
       {
         placeholder: '终端厂商',
         formName: 'firmId',
         formType: FormItmeType.Select,
         selectData:
           (terminalFirmList &&
             terminalFirmList.map((item) => {
               return {
                 value: `${item.id}`,
                 title: `${item.firmName}`,
               };
             })) ||
           [],
         value: terminalFirmValue,
         onChange: (id: string) => {
           setTerminalFirmValue(`${id}`);
         },
       },
     )
     ```

  6. dept树形筛选，如果是其他的树形，加上以下三个字段就可以了

     ```tsx
     forms.push(
       {
         formName: 'deptId',
         formType: FormItmeType.TreeSelectCommon,
         // treeSelectData: [...menus] || [],
         // nodeKey: 'menuId', 
         // nodeTitle: 'menuName',
       },
     )
     ```

  

- #### 普通表单

  1. 创建表单
  
     ```tsx
     import { Form } from 'antd';
     import { CustomFormItems } from '@/component/custom-form';
     const [form] = Form.useForm()
     <Form form={form}>
       <CustomFormItems items={forms} singleCol={true} />
     </Form>
     ```
  
  2. 创建表单项
  
     ```tsx
     const forms: FormItem[] = [
       // 基本使用
       {
         label: '名称',
         key: 'adName',
         requiredText: '请输入名称',
         show: false
       },
     ]
     ```
  
  3. 普通下拉框
  
     ```tsx
     forms.push(
       {
         label: '终端厂商',
         requiredText: '请选择终端厂商',
         placeholder: '终端厂商',
         render: () => {
           return renderSelectForm(
             {
               formName: 'firmId',
               formType: FormItmeType.Select,
               selectData: terminalFirmList &&
                 terminalFirmList.map((item) => {
                   return {
                     value: `${item.id}`,
                     title: `${item.firmName}`,
                   };
                 }),
               onChange: (firmId: any) => {
                 setFirmValue(firmId);
               },
             },
             false
           )
         },
         key: 'firmId',
       },
     )
     ```
  
  4. 字典下拉框
  
     ```tsx
     forms.push(
       {
         label: '广告类型',
         key: 'type',
         requiredText: '请选择广告类型',
         requiredType: 'select',
         render: () =>
           renderCommonSelectForm(
             {
               formName: 'type',
               formType: FormItmeType.SelectCommon,
               dictList: 'advert_type',
             },
             false
           ),
       },
     )
     ```
  
  5. 普通/字典通用下拉框
  
     ```tsx
     forms.push(
       {
         ...getCustomSelectFromItemData({
           label: fieldLabels.firmId,
           key: 'firmId',
           value: terminalFirmValue,
           list: terminalFirmList,
           valueKey: 'id',
           nameKey: 'firmName',
           required: true,
           // setValue: setTerminalFirmValue,
           onChange: (id: any) => {
             setTerminalFirmValue(id);
             form.setFieldsValue({ terminalType: undefined });
           },
         }),
       },
     )
     ```
  
  6. 级联下拉框
  
     ```tsx
     forms.push(
       {
         label: fieldLabels.parentId,
         key: 'parentId',
         requiredType: 'select' as any,
         render: () => renderTreeSelectForm({
           formName: 'menuId',
           formType: FormItmeType.TreeSelect,
           treeSelectData: [{ menuId: 0, menuName: '无' }, ...menuList],
           nodeKey: 'menuId',
           nodeTitle: 'menuName',
           span: 24,
           onChange: (id: number) => setParentId(id),
         placeholder: '请选择菜单'
         }, false)
       },
     )
     ```
  
  7. 时间表单
  
     ```tsx
     forms.push(
       {
         label: '有效起始时间',
         key: 'startTime',
         requiredText: '请选择起始时间',
         render: () => (
           <DatePicker
             format="YYYY-MM-DD HH:mm:ss"
             showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
             style={{ width: '100%' }}
             placeholder="请选择有效起始日期"
           />
         ),
       },
     )
     ```
  
  8. 单选，如果结构简单的话在render使用Radio.Group
  
     ```tsx
     forms.push(
       {
         label: fieldLabels.isGroupUpdate,
         key: 'isGroupUpdate',
         render: () =>
           <CustomRadioGroup
             list={isGroupUpdateList}
             valueKey={'dictValue'}
             nameKey={'dictLabel'}
             setForm={(value: any) => {
               form.setFieldsValue({ 'isGroupUpdate': value });
               setGroupFilterTypeValue(value);
             }}
           />
       },
     )
     ```
  
  9. 复选
  
     ```tsx
     forms.push(
       {
         label: fieldLabels.groupIds,
         key: 'groupIds',
         itemSingleCol: true,
         show: groupFilterTypeValue !== '0',
         render: () =>
           <CustomCheckGroup
             ref={groupRef}
             list={terminalGroupList}
             valueKey={'id'} nameKey={'name'}
             setForm={(value: any[]) => { 
               form.setFieldsValue({ 'groupIds': value }); 
               setTerminalGroupValue(value.join(',')) 
             }}
           />
       }
     )
     ```
  
     
  
- #### 提交与表单分离

  ```tsx
  import { CustomFormItems } from '@/component/custom-form';
  import FixedFoot, { ErrorField } from '@/component/fixed-foot';
  <Form form={form}>
    <Divider orientation="left">【参数配置】</Divider>
    <CustomFormItems items={forms} />
  </Form>
  <FixedFoot errors={error} fieldLabels={fieldLabels}>
    <Button type="primary" onClick={onFinish as any}>
      提交
    </Button>
    <Button onClick={() => history.goBack()}>返回</Button>
</FixedFoot>
  ```
  
  

### 字典

```tsx
import { useStore } from '@/pages/common/costom-hooks';
import { getDictText } from '@/pages/common/util/index'

// 请求字典数据
useStore(['advert_file_type', 'advert_type', 'advert_status']);

// 根据字段值以及字典类型获取
 getDictText(`${value}`, 'advert_type')
```



### 选择联动

可以使用useEffect监听某个值的变化，对应处理

```tsx
useEffect(() => {
  // 终端厂商变化导致终端型号要变
  if (firmValue !== '') {
    form.setFieldsValue({ terminalTypes: undefined });
    // 异步请求获取终端型号列表
    getTerminalTypeListByFirm({ firmId: firmValue }, (data) => {
      setTerminalFirmTypeList(data);
    });
  }
}, [firmValue]);
```



### 登录

如果用户没有登录或者token过期，无论在请求哪个接口时，都会返回`{code: '1', msg: '---'}`，我们在请求那里拦截响应，如果用户没有登录，就跳转页面到登录页面

```ts
fetch(`${BASE_URL}${url}`, option)
  .then((res) => res.json())
  .then(async (res) => {
    if(res.code === '1') { // 表明未登录
      window.location.hash = '#/login'
    }
    return res
  })
  .catch((error) => {
    notification.warn({
      message: error.message,
    });
  });
```



### 系统管理模块

#### 角色管理权限修改

这个部分注意，半选的元素也要被提交，并且在显示页面时，半选的部分不能设置为checked，否则所有子元素无论是否选中，都将为选中的状态。

以下是在页面加载时，对选中的数据做一些处理

```tsx
const getCheckedKeys = (list: any[], keys: string[], halfKeys: string[],  key: string | null) => {
  let flag = true
  list.length && list.forEach((item: any) => {
    const checked: boolean = checkedIds.indexOf(item.menuId) !== -1
    if(checked) {
      Array.isArray(item.children) && item.children.length 
        ? getCheckedKeys(item.children, keys, halfKeys, item.key) 
        : keys.push(item.key)
    } else {
      flag = false
    }
  })
  key && (flag ? keys.push(key) : halfKeys.push(key))
}
```



## 经验

### 菜单图标展示

在页面渲染过程中，不能直接异步引入图标，解决方案是引入所有图标，创建元素，引入的时候需要判断是否存在

```tsx
const renderIcon = (icon: string) => {
  const ele = (Icon as any)[icon]
  if(ele) {
    return (React.createElement( ele ))
  }
  return null
}
```







