/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-09-17 16:22:12 
 * @Last Modified by: centerm.gaohan
 * @Last Modified time: 2020-10-14 15:16:48
 * 
 * @todo 参数设置
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
import { systemConfigList, systemConfigRemove, systemConfigExport, systemConfigAdd, systemConfigEdit, checkConfigKeyUnique } from './constants/api';
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
  configName: '参数名称',
  configKey: '参数键名',
  valueType: '参数值类型',
  configValue: '参数键值',
  remark: '备注',
  configType: '系统内置'
}

type Props = {};

function Page(props: Props) {
  useStore(['sys_yes_no', 'config_value_type']);
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
      return systemConfigList({
        pageSize: paginatedParams.pageSize, pageNum: paginatedParams.current, ...tableProps,
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
   * @todo 修改参数信息
   * @param item 
   */
  const onEdit = (item: any) => {
    setEditItem(item);
    addForm.setFieldsValue(item);
    if (item.valueType !== undefined) {
      addForm.setFieldsValue({ valueType: `${item.valueType}` });
    }
    showModal();
  }

  /**
   * @todo 删除参数信息
   * @param item 
   */
  const onRemove = async (item: any) => {
    Modal.confirm({
      title: '提示',
      content: `确认要删除该条参数信息吗?`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          const param = {
            ids: item.configId
          }
          setLoading(true);
          const result = await systemConfigRemove(param);
          setLoading(false);
          invariant(result && result.code === RESPONSE_CODE.success, result && result.msg || '删除参数信息失败，请重试');
          notification.success({ message: '删除参数信息成功!' });
          customSubmit();
        } catch (error) {
          notification.error({ message: error.message });
        }
      },
    });
  }

  /**
   * @todo 批量删除参数信息
   */
  const onRemoveBatch = () => {
    if (selectedRowKeys.length === 0) {
      notification.error({ message: '请选择参数信息！' });
      return;
    }
    Modal.confirm({
      title: '提示',
      content: `确认要删除选中的参数信息吗?`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          const param = {
            ids: selectedRowKeys.join(','),
          }
          setLoading(true);
          const result = await systemConfigRemove(param);
          setLoading(false);
          invariant(result && result.code === RESPONSE_CODE.success, result && result.msg || '删除参数信息失败，请重试');
          notification.success({ message: '删除参数信息成功!' });
          customSubmit();
        } catch (error) {
          notification.error({ message: error.message });
        }
      },
    });
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
          <a onClick={() => onRemove(item)}>删除</a>
        </div>
      ),
      fixed: 'left',
      align: 'center',
      width: 120,
    },
    {
      title: '参数名称',
      dataIndex: 'configName',
    },
    {
      title: '参数键名',
      dataIndex: 'configKey',
    },
    {
      title: '参数键值',
      dataIndex: 'configValue',
    },
    {
      title: '系统内置',
      dataIndex: 'configType',
      dictType: 'sys_yes_no',
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
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      width: 200,
    },
  ]);

  /**
   * @todo table查询表单
   */
  const forms: FormItem[] = [
    {
      formName: 'configName',
      placeholder: '参数名称',
      formType: FormItmeType.Normal,
    },
    {
      formName: 'configKey',
      placeholder: '参数键名',
      formType: FormItmeType.Normal,
    },
    {
      placeholder: '系统内置',
      formName: 'configType',
      formType: FormItmeType.Select,
      selectData:
        (dictList &&
          dictList.sys_yes_no && dictList.sys_yes_no.data.map((item) => {
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
   * @todo 导出参数信息
   */
  const onExport = () => {
    Modal.confirm({
      title: '确认要导出参数信息吗？',
      onOk: async () => {
        try {
          const result = await systemConfigExport(fetchField);
          invariant(result.code === RESPONSE_CODE.success, result.msg || ' ');

          const href = getDownloadPath(result.data);
          // window.open(href, '_blank');
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
   * @todo 弹窗点击确定新增/修改参数信息
   */
  const handleOk = async () => {
    try {
      await addForm.validateFields();
      const fields = addForm.getFieldsValue();
      let param: any = {
        ...fields,
        configType: fields.configType !== undefined ? fields.configType : '0',
        valueType: fields.valueType !== undefined ? fields.valueType : '0'
      }
      setLoading(true);
      if (editItem.configId) {
        param = {
          ...param,
          configId: editItem.configId,
        }
        const result = await systemConfigEdit(param);
        setLoading(false);
        invariant(result.code === RESPONSE_CODE.success, result.msg || '修改失败！');
        notification.success({ message: '修改成功！' });
      } else {
        const result = await systemConfigAdd(param);
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
   * @todo 判断输入的参数键值是否符合要求
   * @param rule 
   * @param value 
   * @param callback 
   */
  const checkConfigKey = (rule: any, value: any, callback: any) => {
    let flag = false;
    const param = {
      configKey: value
    }
    checkConfigKeyUnique(param)
      .then(function (res) {
        if (res && res.code === RESPONSE_CODE.success) {
          flag = res.data === '1';
        }

        if (!flag) {
          callback();
        } else {
          callback('该参数键名已经存在');
        }
      }, function (error) {
        callback('参数键名校验失败')
      });
  }

  /**
   * @todo 新增表单内容
   */
  const addForms = [
    {
      label: fieldLabels.configName,
      key: 'configName',
      requiredType: 'input' as any,
    },
    {
      label: fieldLabels.configKey,
      key: 'configKey',
      requiredType: 'input' as any,
      rules: [
        { validator: checkConfigKey },
        {
          required: true,
          message: '请输入参数键名',
        },
      ]
    },
    {
      label: fieldLabels.valueType,
      key: 'valueType',
      render: () => <Radio.Group defaultValue={'0'}>
        {
          dictList && dictList.config_value_type && dictList.config_value_type.data.map(item => {
            return (
              <Radio value={item.dictValue}>{item.dictLabel}</Radio>
            )
          })
        }
      </Radio.Group>
    },
    {
      label: fieldLabels.configValue,
      key: 'configValue',
      requiredType: 'input' as any,
    },
    {
      label: fieldLabels.remark,
      key: 'remark',
      render: () => <TextArea />
    },
    {
      label: fieldLabels.configType,
      key: 'configType',
      render: () => <Radio.Group defaultValue={'0'}>
        {
          dictList && dictList.sys_yes_no && dictList.sys_yes_no.data.map(item => {
            return (
              <Radio value={item.dictValue}>{item.dictLabel}</Radio>
            )
          })
        }
      </Radio.Group>
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
        rowKey="configId"
        columns={columns}
        rowSelection={rowSelection}
        {...tableProps}
        pagination={getStandardPagination(tableProps.pagination)}
        scroll={{ x: 1200 }}
      />
      <Modal
        visible={modalVisible}
        title={editItem.configId ? "新增参数" : "修改参数"}
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

