/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-09-11 15:19:51 
 * @Last Modified by: centerm.gaohan
 * @Last Modified time: 2020-10-14 15:16:50
 * 
 * @todo 角色管理页面
 */
import React, { useState } from 'react';
import { Form, Table, Divider, Spin, Switch, Modal, notification, DatePicker, Col } from 'antd';
import { useAntdTable } from 'ahooks';
import { formatListResult } from '@/common/request-util';
import { useStore } from '@/pages/common/costom-hooks';
import Forms from '@/component/form';
import { createTableColumns, getStandardPagination } from '@/component/table';
import history from '@/common/history-util';
import { PlusOutlined, LogoutOutlined, CloseOutlined } from '@ant-design/icons';
import { systemRoleList, systemRoleChangeStatus, systemRoleExport, systemRoleRemove } from '../role/constants/api';
import { FormItem, FormItmeType } from '@/component/form/type';
import invariant from 'invariant';
import { RESPONSE_CODE, getDownloadPath } from '@/common/config';
import moment from 'moment';
import { useSelectorHook } from '@/common/redux-util';

const { RangePicker } = DatePicker;

type Props = {};

function Page(props: Props) {
  // 请求dept数据
  useStore(['sys_normal_disable']);
  const dictList = useSelectorHook(state => state.common.dictList);

  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [fetchField, setFetchField] = useState({} as any);

  const [form] = Form.useForm();
  const { tableProps, search }: any = useAntdTable(
    (paginatedParams: any, tableProps: any) => {
      if (Array.isArray(tableProps.params)) {
        if (tableProps.params.length === 2) {
          const beginTime = moment(tableProps.params[0]).format('YYYY-MM-DD HH:mm:ss');
          const endTime = moment(tableProps.params[1]).format('YYYY-MM-DD HH:mm:ss');
          // tableProps['params[beginTime]'] = beginTime;
          // tableProps['params[endTime]'] = endTime;
        } else if (tableProps.params.length === 1) {
          const beginTime = moment(tableProps.params[0]).format('YYYY-MM-DD HH:mm:ss');
          // tableProps['params[beginTime]'] = beginTime;
        }
      }
      delete tableProps.params;
      setFetchField(tableProps);
      return systemRoleList({
        pageSize: paginatedParams.pageSize, pageNum: paginatedParams.current, ...tableProps
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
   * @todo 修改
   * @param item 
   */
  const onEdit = (item: any) => {
    history.push(`/system/role/edit?id=${item.roleId}`);
  }

  /**
   * @todo 删除角色
   * @param item 
   */
  const onRemove = (item: any) => {
    Modal.confirm({
      title: '提示',
      content: `确认要删除当前角色吗?`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          const param = {
            ids: item.roleId
          }
          setLoading(true);
          const result = await systemRoleRemove(param);
          setLoading(false);
          invariant(result && result.code === RESPONSE_CODE.success, result && result.msg || '删除角色失败，请重试');
          notification.success({ message: '删除角色成功!' });
          customSubmit();
        } catch (error) {
          notification.error({ message: error.message });
        }
      },
    });
  }

  /**
   * @todo 批量删除角色
   */
  const onRemoveBatch = () => {
    if (selectedRowKeys.length === 0) {
      notification.error({ message: '请选择用角色！' });
      return;
    }
    Modal.confirm({
      title: '提示',
      content: `确认要删除选中的角色吗?`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          const param = {
            ids: selectedRowKeys.join(','),
          }
          setLoading(true);
          const result = await systemRoleRemove(param);
          setLoading(false);
          invariant(result && result.code === RESPONSE_CODE.success, result && result.msg || '删除角色失败，请重试');
          notification.success({ message: '删除角色成功!' });
          customSubmit();
        } catch (error) {
          notification.error({ message: error.message });
        }
      },
    });
  }

  /**
  * @todo 切换角色启用/停用状态
  * @param item 
  */
  const onChangeStatus = (item: any) => {
    const operateText = item.status === '0' ? '停用' : '启用'
    Modal.confirm({
      title: '提示',
      content: `确认要${operateText}当前角色吗?`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          const param = {
            roleId: item.roleId,
            status: item.status === '0' ? '1' : '0',
          }
          setLoading(true);
          const result = await systemRoleChangeStatus(param);
          setLoading(false);
          invariant(result && result.code === RESPONSE_CODE.success, result && result.msg || `${operateText}角色失败！`);
          notification.success({ message: `${operateText}角色成功!` });
          customSubmit();
        } catch (error) {
          notification.warn({ message: error.message });
        }
      },
    });
  }

  const renderRangePicker = (key: string) => {
    return (
      <Col span={12} key={key}>
        <Form.Item name={key}>
          <RangePicker showTime />
        </Form.Item>
      </Col>
    )
  }

  /**
   * @todo table查询表单
   */
  const forms: FormItem[] = [
    {
      formName: 'roleName',
      placeholder: '角色名称',
      formType: FormItmeType.Normal,
    },
    {
      formName: 'roleKey',
      placeholder: '权限字符',
      formType: FormItmeType.Normal,
    },
    {
      placeholder: '角色状态',
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
    // {
    //   formName: 'params',
    //   formType: FormItmeType.SelectCommon,
    //   dictList: 'params',
    //   render: () => renderRangePicker('params')
    // }
  ];

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
      title: '角色名称',
      dataIndex: 'roleName',
    },
    {
      title: '权限字符',
      dataIndex: 'roleKey',
    },
    {
      title: '显示顺序',
      dataIndex: 'roleSort',
    },
    {
      title: '角色状态',
      // dataIndex: 'status',
      render: (item) => <Switch checked={item.status === '0'} onChange={() => onChangeStatus(item)} />
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
  ]);

  const onAdd = () => {
    history.push(`/system/role/add`);
  }

  /**
   * @todo 导出角色信息
   */
  const onExport = () => {
    Modal.confirm({
      title: '确认要导角色信息吗？',
      onOk: async () => {
        try {
          const result = await systemRoleExport(fetchField);
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
        rowKey="roleId"
        rowSelection={rowSelection}
        columns={columns}
        {...tableProps}
        pagination={getStandardPagination(tableProps.pagination)}
      />
    </Spin>
  );
}
export default Page;

