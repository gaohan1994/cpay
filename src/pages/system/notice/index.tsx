/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-09-17 16:23:37 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-09-22 17:24:51
 * 
 * @todo 通知公告
 */
import React, { useState } from 'react';
import { Form, Table, Divider, notification, Modal, Spin, Tag, Radio } from 'antd';
import { useAntdTable } from 'ahooks';
import { formatListResult } from '@/common/request-util';
import Forms from '@/component/form';
import { FormItem, FormItmeType } from '@/component/form/type';
import { createTableColumns, getStandardPagination } from '@/component/table';
import { PlusOutlined, LogoutOutlined, CloseOutlined } from '@ant-design/icons';
import invariant from 'invariant';
import { RESPONSE_CODE } from '@/common/config';
import { systemNoticeList, systemNoticeRemove, systemNoticeAdd, systemNoticeEdit } from './constants/api';
import { CustomFormItems } from '@/component/custom-form';
import TextArea from 'antd/lib/input/TextArea';
import { useSelectorHook } from '@/common/redux-util';
import { useStore } from '@/pages/common/costom-hooks';
import { getStatusColor } from '../common';
import history from '@/common/history-util';

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
  useStore(['sys_notice_status', 'sys_notice_type']);
  const dictList = useSelectorHook(state => state.common.dictList);

  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([] as any[]);

  const [form] = Form.useForm();
  const { tableProps, search }: any = useAntdTable(
    (paginatedParams: any, tableProps: any) => {
      return systemNoticeList({
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
   * @todo 修改公告信息
   * @param item 
   */
  const onEdit = (item: any) => {
    history.push(`/system/notice/edit?id=${item.noticeId}`);
  }

  /**
   * @todo 删除公告信息
   * @param item 
   */
  const onRemove = async (item: any) => {
    Modal.confirm({
      title: '提示',
      content: `确认要删除该条公告吗?`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          const param = {
            ids: item.noticeId
          }
          setLoading(true);
          const result = await systemNoticeRemove(param);
          setLoading(false);
          invariant(result && result.code === RESPONSE_CODE.success, result && result.msg || '删除公告失败，请重试');
          notification.success({ message: '删除公告成功!' });
          customSubmit();
        } catch (error) {
          notification.error({ message: error.message });
        }
      },
    });
  }

  /**
   * @todo 批量删除公告信息
   */
  const onRemoveBatch = () => {
    if (selectedRowKeys.length === 0) {
      notification.error({ message: '请选择公告！' });
      return;
    }
    Modal.confirm({
      title: '提示',
      content: `确认要删除选中的公告吗?`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          const param = {
            ids: selectedRowKeys.join(','),
          }
          setLoading(true);
          const result = await systemNoticeRemove(param);
          setLoading(false);
          invariant(result && result.code === RESPONSE_CODE.success, result && result.msg || '删除公告失败，请重试');
          notification.success({ message: '删除参数公告成功!' });
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
      title: '公告标题',
      dataIndex: 'noticeTitle',
    },
    {
      title: '公告类型',
      dataIndex: 'noticeType',
      dictType: 'sys_notice_type'
    },
    {
      title: '公告状态',
      dataIndex: 'status',
      dictType: 'sys_notice_status',
      // render: (item) => <Tag color={getStatusColor(item)}>{item}</Tag>
    },
    {
      title: '创建者',
      dataIndex: 'createBy',
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
      formName: 'noticeTitle',
      placeholder: '公告标题',
      formType: FormItmeType.Normal,
    },
    {
      formName: 'createBy',
      placeholder: '操作人员',
      formType: FormItmeType.Normal,
    },
    {
      placeholder: '公告类型',
      formName: 'noticeType',
      formType: FormItmeType.Select,
      selectData:
        (dictList &&
          dictList.sys_notice_type && dictList.sys_notice_type.data.map((item) => {
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
    history.push(`/system/notice/add`);
  }

  const extraButtons = [
    { title: '新增', onClick: onAdd, icon: <PlusOutlined />, type: "primary" as any, },
    { title: '删除', onClick: onRemoveBatch, icon: <CloseOutlined /> },
  ]

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

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
          dictList && dictList.sys_notice_type && dictList.sys_notice_type.data.map(item => {
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
        rowKey="noticeId"
        columns={columns}
        rowSelection={rowSelection}
        {...tableProps}
        pagination={getStandardPagination(tableProps.pagination)}
      />
    </Spin>
  );
}
export default Page;

