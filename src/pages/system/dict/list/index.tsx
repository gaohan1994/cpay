/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-09-14 14:46:54 
 * @Last Modified by: centerm.gaohan
 * @Last Modified time: 2020-10-14 15:16:41
 * 
 * @todo 字典管理
 */
import React, { useState, useEffect } from 'react';
import { Form, Table, Divider, notification, Modal, Spin, Tag, Radio, Input } from 'antd';
import { useAntdTable } from 'ahooks';
import { formatListResult } from '@/common/request-util';
import Forms from '@/component/form';
import { FormItem, FormItmeType } from '@/component/form/type';
import { createTableColumns, getStandardPagination } from '@/component/table';
import { PlusOutlined, LogoutOutlined, CloseOutlined } from '@ant-design/icons';
import invariant from 'invariant';
import { RESPONSE_CODE, getDownloadPath } from '@/common/config';
import { CustomFormItems } from '@/component/custom-form';
import TextArea from 'antd/lib/input/TextArea';
import { systemDictDataList, systemDictDataExport, systemDictDataRemove, systemDictDataEdit, systemDictDataAdd, checkKeyUniqueByType } from './constants/api';
import { useQueryParam } from '@/common/request-util';
import { systemDictListCallback } from '../constants/api';
import { renderSelectForm } from '@/component/form/render';
import { useStore } from '@/pages/common/costom-hooks';
import { useSelectorHook } from '@/common/redux-util';
import { getStatusColor } from '../../common';

const customFormLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 14
  }
}


const fieldLabels = {
  dictLabel: '字典标签',
  dictValue: '字典键值',
  dictType: '字典类型',
  dictSort: '字典排序',
  status: '状态',
  remark: '备注',
}

type Props = {};

function Page(props: Props) {
  const type = useQueryParam('type');
  useStore(['sys_normal_disable']);
  const dictList = useSelectorHook(state => state.common.dictList);

  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([] as any[]);
  const [fetchField, setFetchField] = useState({} as any);
  const [modalVisible, setModalVisible] = useState(false);
  const [editItem, setEditItem] = useState({} as any);
  const [dictTypeList, setDictTypeList] = useState([] as any);
  const [dictType, setDictType] = useState('');

  const [addForm] = Form.useForm();
  const [form] = Form.useForm();
  const { tableProps, search }: any = useAntdTable(
    (paginatedParams: any, tableProps: any) => {
      setFetchField({ ...tableProps, dictType: dictType.length > 0 ? dictType : type });
      return systemDictDataList({
        pageSize: paginatedParams.pageSize,
        pageNum: paginatedParams.current,
        ...tableProps,
        dictType: dictType.length > 0 ? dictType : type,
        orderByColumn: 'createTime',
        isAsc: 'desc',
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
    form.setFieldsValue({ dictType: dictType });
  }

  /**
   * @todo 获取字典列表
   */
  useEffect(() => {
    setLoading(true);
    systemDictListCallback({}, (res: any) => {
      setLoading(false);
      if (res && res.code === RESPONSE_CODE.success) {
        setDictTypeList(res.data.rows);
        setDictType(type);
        form.setFieldsValue({ dictType: type });
      }
    });
  }, []);

  /**
   * @todo 修改字典数据
   * @param item 
   */
  const onEdit = (item: any) => {
    setEditItem(item);
    addForm.setFieldsValue(item);
    showModal();
  }

  /**
   * @todo 删除字典数据
   * @param item 
   */
  const onRemove = async (item: any) => {
    Modal.confirm({
      title: '提示',
      content: `确认要删除当前字典数据吗?`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          const param = {
            ids: item.dictCode
          }
          setLoading(true);
          const result = await systemDictDataRemove(param);
          setLoading(false);
          invariant(result && result.code === RESPONSE_CODE.success, result && result.msg || '删除字典数据失败，请重试');
          notification.success({ message: '删除字典数据成功!' });
          customSubmit();
        } catch (error) {
          notification.error({ message: error.message });
        }
      },
    });
  }

  /**
   * @todo 批量删除字典数据
   */
  const onRemoveBatch = () => {
    if (selectedRowKeys.length === 0) {
      notification.error({ message: '请选择用字典数据！' });
      return;
    }
    Modal.confirm({
      title: '提示',
      content: `确认要删除选中的字典数据吗?`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          const param = {
            ids: selectedRowKeys.join(','),
          }
          setLoading(true);
          const result = await systemDictDataRemove(param);
          setLoading(false);
          invariant(result && result.code === RESPONSE_CODE.success, result && result.msg || '删除字典数据失败，请重试');
          notification.success({ message: '删除字典数据成功!' });
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
      title: '字典标签',
      dataIndex: 'dictLabel',
    },
    {
      title: '字典键值',
      dataIndex: 'dictValue',
    },
    {
      title: '字典排序',
      dataIndex: 'dictSort',
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
      formName: 'dictType',
      formType: FormItmeType.Normal,
      render: () =>
        renderSelectForm({
          formName: 'dictType',
          placeholder: '字典名称',
          selectData:
            (dictTypeList &&
              dictTypeList.map((item: any) => {
                return {
                  title: item.dictName,
                  value: item.dictType,
                } as any;
              })) ||
            [],
          formType: FormItmeType.Select,
          value: dictType,
          onChange: (type: string) => setDictType(type)
        }),
    },
    {
      formName: 'dictLabel',
      placeholder: '字典标签',
      formType: FormItmeType.Normal,
    },
    {
      placeholder: '数据状态',
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
   * @todo 导出用户信息
   */
  const onExport = () => {
    Modal.confirm({
      title: '确认要导出字典数据吗？',
      onOk: async () => {
        try {
          const result = await systemDictDataExport(fetchField);
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
    addForm.setFieldsValue({ dictType });
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
   * @todo 弹窗点击确定新增机构
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
      if (editItem.dictCode) {
        param = {
          ...param,
          dictCode: editItem.dictCode,
        }
        const result = await systemDictDataEdit(param);
        setLoading(false);
        invariant(result.code === RESPONSE_CODE.success, result.msg || '修改失败！');
        notification.success({ message: '修改成功！' });
      } else {
        const result = await systemDictDataAdd(param);
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

  const checkDictValue = (rule: any, value: any, callback: any) => {
    let flag = false;
    const param = {
      dictType: dictType,
      dictValue: value,
    }
    checkKeyUniqueByType(param)
      .then(function (res) {
        if (res && res.code === RESPONSE_CODE.success) {
          flag = res.data === true;
        }
        if (!flag) {
          callback();
        } else {
          callback('该字典键值已经存在');
        }
      }, function (error) {
        callback('字典键值校验失败')
      });
  }


  const addForms = [
    {
      label: fieldLabels.dictLabel,
      key: 'dictLabel',
      requiredType: 'input' as any,
    },
    {
      label: fieldLabels.dictValue,
      key: 'dictValue',
      requiredType: 'input' as any,
      // 改成新增才需要校验，修改不用
      rules: editItem.dictId ? [] : [
        { validator: checkDictValue },
        {
          required: true,
          message: '请输入字典键值',
        },
      ]
    },
    {
      label: fieldLabels.dictType,
      key: 'dictType',
      render: () => <Input disabled />
    },
    {
      label: fieldLabels.dictSort,
      key: 'dictSort',
      requiredType: 'input' as any,
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
        rowKey="dictCode"
        columns={columns}
        rowSelection={rowSelection}
        {...tableProps}
        pagination={getStandardPagination(tableProps.pagination)}
      />
      <Modal
        visible={modalVisible}
        title={editItem.dictId ? "修改字典数据" : "新增字典数据"}
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

