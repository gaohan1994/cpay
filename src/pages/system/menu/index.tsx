import React, { useState, useEffect, useCallback } from 'react';
import { Spin, Row, Col, Button, Tree, Form, notification, Modal, Table, Tag, Divider, Radio } from 'antd';
import { useSelectorHook, useRedux } from '@/common/redux-util';
import { useStore } from '@/pages/common/costom-hooks';
import { CustomFormItems } from '@/component/custom-form';
import { useForm } from 'antd/lib/form/Form';
import { renderCommonTreeSelectForm } from '@/component/form/render';
import { FormItmeType, FormItem } from '@/component/form/type';
import { systemMenuList, systemMenuRemove } from './constants/api';
import invariant from 'invariant';
import { RESPONSE_CODE } from '@/common/config';
import { PlusOutlined, CaretDownOutlined, CaretRightOutlined } from '@ant-design/icons';
import { useAntdTable } from 'ahooks';
import { IResponseResult } from '@/common/type';
import { merge } from 'lodash';
import { createTableColumns } from '@/component/table';
import { getStatusColor } from '../common';
import Forms from '@/component/form';
import AddModal from './component/modal.add';
import { formatMenuTreeData } from '../common';
import { useDispatch } from 'react-redux';


const customFormLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 14
  }
}


export default function Page() {
  useStore(['menu_type', 'sys_show_hide']);
  const dictList = useSelectorHook(state => state.common.dictList);;
  const [addForm] = useForm();
  const dispatch  = useDispatch()

  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([] as any[]);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editItem, setEditItem] = useState({} as any);

  const formatMenuListResult = (result: IResponseResult<any>) => {
    const mergeResult = merge({}, result);
    const treeData = formatMenuTreeData(mergeResult.data || []);    
    return {
      list: treeData,
      total: mergeResult.data.length || 0,
    };
  }

  const [form] = Form.useForm();
  const { tableProps, search, data }: any = useAntdTable(
    (paginatedParams: any, tableProps: any) => {
      return systemMenuList(
        {
        // pageSize: paginatedParams.pageSize, pageNum: paginatedParams.current, 
        ...tableProps,
        // orderByColumn: 'createTime', isAsc: 'desc'
        },
        dispatch
      );
    },
    {
      form,
      formatResult: formatMenuListResult,
    }
  );
  const { submit, reset } = search;

  /**
  * @todo 自定义查询，把选中列表置空
  */
  const customSubmit = () => {
    setSelectedRowKeys([]);
    submit();
  }

  /**
   * @todo 自定义重置，把选中列表置空
   */
  const customReset = () => {
    setSelectedRowKeys([]);
    reset();
  }

  /**
   * @todo 修改
   * @param item 
   */
  const onEdit = (item: any) => {
    setAddModalVisible(true);
    addForm.setFieldsValue({ ...item, status: `${item.status}` });
    setEditItem(item);
  }

  /**
   * @todo 删除
   * @param item 
   */
  const onRemove = (item: any) => {
    Modal.confirm({
      title: '提示',
      content: `确认要删除当前菜单吗?`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          setLoading(true);
          const result = await systemMenuRemove(item.menuId);
          setLoading(false);
          invariant(result && result.code === RESPONSE_CODE.success, result && result.msg || '删除菜单失败，请重试');
          notification.success({ message: '删除菜单成功!' });
          customSubmit();
        } catch (error) {
          notification.error({ message: error.message });
        }
      },
    });
  }


  const columns = createTableColumns([
    {
      title: '操作',
      render: (key, item) => (
        <div>
          {
              <>
                <a onClick={() => onAdd(item)}>新增</a>
                <Divider type="vertical" />
                <a onClick={() => onEdit(item)}>修改</a>
                <Divider type="vertical" />
                <a onClick={() => onRemove(item)}>删除</a>
              </>
          }
        </div>
      ),
      fixed: 'right',
      align: 'center',
      width: 200,
    },
    {
      title: '菜单名称',
      dataIndex: 'menuName',
    },
    {
      title: '排序',
      dataIndex: 'orderNum',
    },
    {
      title: '请求地址',
      dataIndex: 'url',
    },
    {
      title: '类型',
      dataIndex: 'menuType',
      dictType: 'menu_type',
    },
    {
      title: '显示状态',
      dataIndex: 'visible',
      dictType: 'sys_show_hide',
      render: (item) => <Tag color={getStatusColor(item)}>{item}</Tag>
    },
    {
      title: '权限标识',
      dataIndex: 'perms'
    },
    
  ]);

  /**
   * @todo table查询表单
   */
  const forms: FormItem[] = [
    {
      formName: 'menuName',
      placeholder: '菜单名称',
      formType: FormItmeType.Normal,
    }
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  const onAdd = (item?: any) => {  
    if(item) {
      setEditItem({parentId: item.menuId})
    }
    setAddModalVisible(true);
  }

  const extraButtons = [
    { title: '新增', onClick: () => onAdd(), icon: <PlusOutlined />, type: "primary" as any, },
  ]

  return (
    <Spin spinning={loading}>
      <Forms
        form={form}
        forms={forms}
        formButtonProps={{
          submit: customSubmit,
          reset: customReset,
          extraButtons
        }}
      />
      <Table
        rowKey="menuId"
        columns={columns}
        // rowSelection={rowSelection}
        {...tableProps}
        pagination={false}
        defaultExpandedRowKeys={[100]}
      />
      <AddModal
        modalVisible={addModalVisible}
        setModalVisible={setAddModalVisible}
        form={addForm}
        editItem={editItem}
        setEditItem={setEditItem}
        setLoading={setLoading}
        submit={customSubmit}
      />
    </Spin>
  );
}