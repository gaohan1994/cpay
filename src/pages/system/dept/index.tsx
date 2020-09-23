import React, { useState, useEffect, useCallback } from 'react';
import { Spin, Row, Col, Button, Tree, Form, notification, Modal, Table, Tag, Divider, Radio } from 'antd';
import { useSelectorHook, useRedux } from '@/common/redux-util';
import { useStore } from '@/pages/common/costom-hooks';
import './index.less';
import { CustomFormItems } from '@/component/custom-form';
import { useForm } from 'antd/lib/form/Form';
import { renderCommonTreeSelectForm } from '@/component/form/render';
import { FormItmeType, FormItem } from '@/component/form/type';
import { systemDeptEdits, systemDeptEdit, systemDeptAdd, systemDeptList, checkDeptNameUnique, checkDeptCodeUnique, systemDeptRemove } from './constants/api';
import invariant from 'invariant';
import { RESPONSE_CODE } from '@/common/config';
import { PlusOutlined, CaretDownOutlined, CaretRightOutlined } from '@ant-design/icons';
import { useAntdTable } from 'ahooks';
import { IResponseResult } from '@/common/type';
import { merge } from 'lodash';
import { createTableColumns } from '@/component/table';
import { formatDeptTreeData, getStatusColor } from '../common';
import Forms from '@/component/form';
import AddModal from './component/modal.add';

export default function Page() {
  useStore(['sys_normal_disable']);
  const dictList = useSelectorHook(state => state.common.dictList);;
  const [addForm] = useForm();

  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([] as any[]);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editItem, setEditItem] = useState({} as any);

  const formatDeptListResult = (result: IResponseResult<any>) => {
    const mergeResult = merge({}, result);
    const treeData = formatDeptTreeData(mergeResult.data || []);
    return {
      list: treeData,
      total: mergeResult.data.length || 0,
    };
  }

  const [form] = Form.useForm();
  const { tableProps, search }: any = useAntdTable(
    (paginatedParams: any, tableProps: any) => {
      return systemDeptList({
        pageSize: paginatedParams.pageSize, pageNum: paginatedParams.current, ...tableProps,
        orderByColumn: 'createTime', isAsc: 'desc'
      });
    },
    {
      form,
      formatResult: formatDeptListResult,
    }
  );
  const { submit, reset } = search;

  useEffect(() => {
    if (!addModalVisible) {
      setEditItem({});
      addForm.resetFields();
    }
  }, [addModalVisible]);

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
      content: `确认要删除当前机构吗?`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          setLoading(true);
          const result = await systemDeptRemove(item.deptId);
          setLoading(false);
          invariant(result && result.code === RESPONSE_CODE.success, result && result.msg || '删除机构失败，请重试');
          notification.success({ message: '删除机构成功!' });
          customSubmit();
        } catch (error) {
          notification.error({ message: error.message });
        }
      },
    });
  }

  const columns = createTableColumns([
    {
      title: '机构名称',
      dataIndex: 'deptName',
    },
    {
      title: '机构号',
      dataIndex: 'code',
    },
    {
      title: '排序',
      dataIndex: 'orderNum',
    },
    {
      title: '机构状态',
      dataIndex: 'status',
      dictType: 'sys_normal_disable',
      render: (item) => <Tag color={getStatusColor(item)}>{item}</Tag>
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 200,
    },
    {
      title: '操作',
      render: (key, item) => (
        <div>
          {
            item.parentId !== 0 && (
              <>
                <a onClick={() => onEdit(item)}>修改</a>
                <Divider type="vertical" />
                <a onClick={() => onRemove(item)}>删除</a>
              </>
            )
          }
        </div>
      ),
      fixed: 'right',
      align: 'center',
      width: 200,
    },
  ]);

  /**
   * @todo table查询表单
   */
  const forms: FormItem[] = [
    {
      formName: 'deptName',
      placeholder: '机构名称',
      formType: FormItmeType.Normal,
    },
    {
      formName: 'code',
      placeholder: '机构号',
      formType: FormItmeType.Normal,
    },
    {
      placeholder: '机构状态',
      formName: 'status',
      formType: FormItmeType.Select,
      selectData:
        (dictList &&
          dictList.sys_normal_disable && dictList.sys_normal_disable.data.map((item) => {
            return {
              value: `${item.dictValue}`,
              title: `${item.dictLabel}`,
            };
          })) ||
        [],
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  const onAdd = () => {
    setAddModalVisible(true);
  }

  const extraButtons = [
    { title: '新增', onClick: onAdd, icon: <PlusOutlined />, type: "primary" as any, },
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
        rowKey="deptId"
        columns={columns}
        rowSelection={rowSelection}
        {...tableProps}
        pagination={false}
        defaultExpandedRowKeys={[100]}
      />
      <AddModal
        modalVisible={addModalVisible}
        setModalVisible={setAddModalVisible}
        form={addForm}
        editItem={editItem}
        setLoading={setLoading}
        submit={customSubmit}
      />
    </Spin>
  );
}