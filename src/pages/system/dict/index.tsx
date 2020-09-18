/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-09-14 14:46:54 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-09-14 15:32:46
 * 
 * @todo 字典管理
 */
import React, { useState } from 'react';
import { Form, Table, Divider, notification, Modal, Spin, Tag, Radio } from 'antd';
import { useAntdTable } from 'ahooks';
import { formatListResult } from '@/common/request-util';
import Forms from '@/component/form';
import { FormItem, FormItmeType } from '@/component/form/type';
import { createTableColumns, getStandardPagination } from '@/component/table';
import history from '@/common/history-util';
import { PlusOutlined, LogoutOutlined, CloseOutlined } from '@ant-design/icons';
import invariant from 'invariant';
import { RESPONSE_CODE, getDownloadPath } from '@/common/config';
import { systemDictList, systemDictRemove, systemDictExport, systemDictAdd, systemDictEdit, checkDictTypeUnique } from './constants/api';
import { CustomFormItems } from '@/component/custom-form';
import TextArea from 'antd/lib/input/TextArea';
import { useSelectorHook } from '@/common/redux-util';
import { useStore } from '@/pages/common/costom-hooks';
import { getStatusColor } from '../common';

const customFormLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 14
  }
}


const fieldLabels = {
  dictName: '字典名称',
  dictType: '字典类型',
  status: '状态',
  remark: '备注'
}

type Props = {};

function Page(props: Props) {
  useStore(['sys_normal_disable']);
  const dictList = useSelectorHook(state => state.common.dictList);

  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([] as any[]);
  const [fetchField, setFetchField] = useState({} as any);
  const [modalVisible, setModalVisible] = useState(false);
  const [editItem, setEditItem] = useState({} as any);

  const [addForm] = Form.useForm();
  const [form] = Form.useForm();
  const { tableProps, search }: any = useAntdTable(
    (paginatedParams: any, tableProps: any) => {
      setFetchField(tableProps);
      return systemDictList({
        pageSize: paginatedParams.pageSize, pageNum: paginatedParams.current, ...tableProps,
        orderByColumn: 'createTime', isAsc: 'desc'
      });
    },
    {
      form,
      formatResult: formatListResult,
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
   * @todo 修改字典信息
   * @param item 
   */
  const onEdit = (item: any) => {
    setEditItem(item);
    addForm.setFieldsValue(item);
    showModal();
  }

  /**
   * @todo 删除字典
   * @param item 
   */
  const onRemove = async (item: any) => {
    Modal.confirm({
      title: '提示',
      content: `确认要删除当前字典吗?`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          const param = {
            ids: item.userId
          }
          setLoading(true);
          const result = await systemDictRemove(param);
          setLoading(false);
          invariant(result && result.code === RESPONSE_CODE.success, result && result.msg || '删除字典失败，请重试');
          notification.success({ message: '删除字典成功!' });
          customSubmit();
        } catch (error) {
          notification.error({ message: error.message });
        }
      },
    });
  }

  /**
   * @todo 批量删除字典
   */
  const onRemoveBatch = () => {
    if (selectedRowKeys.length === 0) {
      notification.error({ message: '请选择用字典！' });
      return;
    }
    Modal.confirm({
      title: '提示',
      content: `确认要删除选中的字典吗?`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          const param = {
            ids: selectedRowKeys.join(','),
          }
          setLoading(true);
          const result = await systemDictRemove(param);
          setLoading(false);
          invariant(result && result.code === RESPONSE_CODE.success, result && result.msg || '删除字典失败，请重试');
          notification.success({ message: '删除字典成功!' });
          customSubmit();
        } catch (error) {
          notification.error({ message: error.message });
        }
      },
    });
  }

  /**
   * @todo 跳转到字典数据列表
   * @param item 
   */
  const navToList = (item: any) => {
    history.push(`/system/dict/list?type=${item.dictType}`)
  }

  /**
   * @todo 创建table的列
   */
  const columns = createTableColumns([
    {
      title: '操作',
      render: (key, item) => (
        <div>
          <a onClick={() => onEdit(item)}>修改</a>
          <Divider type="vertical" />
          <a onClick={() => navToList(item)}>列表</a>
          <Divider type="vertical" />
          <a onClick={() => onRemove(item)}>删除</a>
        </div>
      ),
      fixed: 'left',
      align: 'center',
      width: 150,
    },
    {
      title: '字典名称',
      dataIndex: 'dictName',
    },
    {
      title: '字典类型',
      dataIndex: 'dictType',
    },
    {
      title: '状态',
      dataIndex: 'status',
      dictType: 'sys_normal_disable',
      render: (item) => <Tag color={getStatusColor(item)}>{item}</Tag>
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 200,
    },
  ]);

  /**
   * @todo table查询表单
   */
  const forms: FormItem[] = [
    {
      formName: 'dictName',
      placeholder: '字典名称',
      formType: FormItmeType.Normal,
    },
    {
      formName: 'dictType',
      placeholder: '字典类型',
      formType: FormItmeType.Normal,
    },
    {
      placeholder: '字典状态',
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

  /**
   * @todo 弹出新增弹窗
   */
  const onAdd = () => {
    showModal();
  }

  /**
   * @todo 导出字典信息
   */
  const onExport = () => {
    Modal.confirm({
      title: '确认要导出字典信息吗？',
      onOk: async () => {
        try {
          const result = await systemDictExport(fetchField);
          invariant(result.code === RESPONSE_CODE.success, result.msg || ' ');

          const href = getDownloadPath(result.data);
          window.open(href, '_blank');
          notification.success({ message: '导出成功' });
        } catch (error) {
          notification.warn({ message: error.message });
        }
      },
      okText: '确定',
      cancelText: '取消',
    });
  };

  const extraButtons = [
    { title: '新增', onClick: onAdd, icon: <PlusOutlined />, type: "primary" as any, },
    { title: '删除', onClick: onRemoveBatch, icon: <CloseOutlined /> },
    { title: '导出', onClick: onExport, icon: <LogoutOutlined />, type: "primary" as any, },
  ]

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  /**
   * @todo 显示弹窗
   */
  const showModal = () => {
    setModalVisible(true);
  }

  /**
   * @todo 隐藏弹窗
   */
  const hideModal = () => {
    setModalVisible(false);
    addForm.resetFields();
    setEditItem({});
  }

  /**
   * @todo 弹窗点击确定新增/修改字典
   */
  const handleOk = async () => {
    try {
      await addForm.validateFields();
      const fields = addForm.getFieldsValue();
      let param: any = {
        ...fields,
        status: fields.status !== undefined ? fields.status : 0
      }
      setLoading(true);
      if (editItem.dictId) {
        param = {
          ...param,
          dictId: editItem.dictId,
        }
        const result = await systemDictEdit(param);
        setLoading(false);
        invariant(result.code === RESPONSE_CODE.success, result.msg || '修改失败！');
        notification.success({ message: '修改成功！' });
      } else {
        const result = await systemDictAdd(param);
        setLoading(false);
        invariant(result.code === RESPONSE_CODE.success, result.msg || '新增失败！');
        notification.success({ message: '新增成功！' });
      }
      customSubmit();
      hideModal();
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
      if (errorInfo.message) {
        notification.error({ message: errorInfo.message });
      }
    }
  }

  /**
   * @todo 判断输入的字典类型是否符合要求
   * @param rule 
   * @param value 
   * @param callback 
   */
  const checkDictType = (rule: any, value: any, callback: any) => {
    if (value.length < 5) {
      callback('最少5个字符');
    }
    let flag = false;
    const param = {
      dictType: value
    }
    checkDictTypeUnique(param)
      .then(function (res) {
        if (res && res.code === RESPONSE_CODE.success) {
          flag = res.data === '1';
        }

        if (!flag) {
          callback();
        } else {
          callback('该字典已经存在');
        }
      }, function (error) {
        callback('字典类型校验失败')
      });
  }

  /**
   * @todo 新增表单内容
   */
  const addForms = [
    {
      label: fieldLabels.dictName,
      key: 'dictName',
      requiredType: 'input' as any,
    },
    {
      label: fieldLabels.dictType,
      key: 'dictType',
      requiredType: 'input' as any,
      rules: [
        { validator: checkDictType },
        {
          required: true,
          message: '请输入字典类型',
        },
      ]
    },
    {
      label: fieldLabels.status,
      key: 'status',
      render: () => <Radio.Group defaultValue={'0'}>
        {
          dictList && dictList.sys_normal_disable && dictList.sys_normal_disable.data.map(item => {
            return (
              <Radio value={item.dictValue}>{item.dictLabel}</Radio>
            )
          })
        }
      </Radio.Group>
    },
    {
      label: fieldLabels.remark,
      key: 'remark',
      render: () => <TextArea />
    },
  ];

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
        rowKey="dictId"
        columns={columns}
        rowSelection={rowSelection}
        {...tableProps}
        pagination={getStandardPagination(tableProps.pagination)}
      />
      <Modal
        visible={modalVisible}
        title={editItem.dictId ? "新增字典" : "修改字典"}
        onCancel={hideModal}
        onOk={handleOk}
      >
        <Form
          form={addForm}
          style={{ backgroundColor: 'white' }}
        >
          <CustomFormItems items={addForms} singleCol={true} customFormLayout={customFormLayout} />
        </Form>
      </Modal>
    </Spin>
  );
}
export default Page;

