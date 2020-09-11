/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-08-10 14:50:24 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-09-10 17:32:15
 * 
 * @todo 应用管理列表页
 */
import React, { useState, useEffect } from 'react';
import { Form, Table, Row, Popconfirm, Modal, notification, Divider, Tag, Col, Spin } from 'antd';
import { useAntdTable } from 'ahooks';
import { appInfoList, getAppTypeList, appInfoRemove, appAuditSubmit } from '../constants/api';
import { formatListResult } from '@/common/request-util';
import { useStore } from '@/pages/common/costom-hooks';
import Forms from '@/component/form';
import { FormItem, FormItmeType } from '@/component/form/type';
import { createTableColumns, getStandardPagination } from '@/component/table';
import history from '@/common/history-util';
import { ITerminalGroupByDeptId } from '@/pages/terminal/message/types';
import { terminalGroupListByDept } from '@/pages/terminal/message/constants/api';
import { DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { IAppType } from '../types';
import { RESPONSE_CODE } from '@/common/config';
import invariant from 'invariant';
import { getAppStatusColor } from '../common/util';

type Props = {};

function Page(props: Props) {
  // 请求字典数据
  useStore(['app_status']);

  const initState = {
    terminalGroupList: [] as ITerminalGroupByDeptId[],  // 终端组别列表
    terminalGroupValue: '',                             // 终端组别选中值
    formTreeValue: -1,                                  // 机构树选中的值
    appTypeList: [] as IAppType[],                      // 应用类型列表
    appTypeValue: '',                                   // 应用类型选中的值
  };

  const [selectedRowKeys, setSelectedRowKeys] = useState([] as any[]);  // 选中的列的key值列表
  const [terminalGroupList, setTerminalGroupList] = useState(initState.terminalGroupList);
  const [terminalGroupValue, setTerminalGroupValue] = useState(initState.terminalGroupValue);
  const [formTreeValue, setFormTreeValue] = useState(initState.formTreeValue);
  const [appTypeList, setAppTypeList] = useState(initState.appTypeList);
  const [appTypeValue, setAppTypeValue] = useState(initState.appTypeValue);
  const [loading, setLoading] = useState(false);

  /**
   * @todo 根据选中的机构id的值去获取组别列表
   */
  useEffect(() => {
    terminalGroupListByDept(formTreeValue, (groupData) => {
      setTerminalGroupList(groupData);
    });
  }, [formTreeValue]);

  /**
   * @todo 进入页面的时候获取应用类型列表
   */
  useEffect(() => {
    getAppTypeList({}, (typeList: any[]) => {
      setAppTypeList(typeList);
    });
  }, []);

  const [form] = Form.useForm();

  const { tableProps, search }: any = useAntdTable(
    (paginatedParams: any, tableProps: any) =>
      appInfoList({ pageSize: paginatedParams.pageSize, pageNum: paginatedParams.current, ...tableProps }),
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
   * @todo 跳转上传页面
   */
  const onUpload = () => {
    history.push(`/application/manage-upload`);
  }

  /**
   * @todo 跳转详情页面
   * @param item 
   */
  const onDetail = (item: any) => {
    history.push(`/application/manage-detail?id=${item.id}`);
  }

  /**
   * @todo 跳转应用修改页面
   * @param item 
   */
  const onEdit = (item: any) => {
    history.push(`/application/manage-upload?id=${item.id}`);
  }

  /**
   * @todo 跳转回收站列表页面
   */
  const onDelete = () => {
    history.push(`/application/manage-delete`);
  }

  /**
   * @todo 监听选中机构id的改变
   * @param deptId 
   */
  const onChangeDept = (deptId: number) => {
    setFormTreeValue(deptId);
  };

  /**
   * @todo 删除应用（将应用移入回收站）
   * @param item 
   */
  const onRemoveItem = async (item: any) => {
    Modal.confirm({
      title: '提示',
      content: `确认要将当前应用删除吗?`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          setLoading(true);
          const result = await appInfoRemove({ ids: item.id });
          setLoading(false);
          invariant(result && result.code === RESPONSE_CODE.success, result && result.msg || '删除应用失败，请重试');
          notification.success({ message: '删除应用成功!' });
          customSubmit();
        } catch (error) {
          notification.warn({ message: error.message });
        }
      },
    });
  }

  /**
   * @todo 提交审核
   */
  const onAuditSubmit = async () => {
    try {
      invariant(selectedRowKeys.length > 0, '请选择记录');
      Modal.confirm({
        title: '提示',
        content: `确认要将选中的记录提交审核吗`,
        okText: '确定',
        cancelText: '取消',
        onOk: async () => {
          const params: any = {
            id: selectedRowKeys[0],
          };
          setLoading(true);
          const result = await appAuditSubmit(params);
          setLoading(false);
          if (result && result.code === RESPONSE_CODE.success) {
            notification.success({
              message: '提交审核成功',
            });
            customSubmit();
          } else {
            notification.warn({ message: result.msg || '提交审核失败' });
          }
        },
      });
    } catch (error) {
      notification.warn({ message: error.message });
    }
  }

  /**
   * @todo 创建table的列
   */
  const columns = createTableColumns([
    {
      title: '操作',
      render: (key, item) => (
        <div >
          <a onClick={() => onDetail(item)}>详情</a>
          {
            item.status !== 4 && (
              <>
                <Divider type="vertical" />
                <a onClick={() => onEdit(item)}>修改</a>
              </>
            )
          }
          {
            item.status !== 4 && (
              <>
                <Divider type="vertical" />
                <a onClick={() => onRemoveItem(item)}>删除</a>
              </>
            )
          }
        </div>
      ),
      fixed: 'left',
      align: 'center',
      width: 150,
    },
    {
      title: '应用名称',
      align: 'center',
      // dataIndex: 'apkName',
      render: (key, item: any) => {
        return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img src={item.iconPath} style={{ width: 50, height: 50 }} />
            <div style={{ paddingTop: 5, wordBreak: 'break-all' }}>{item.apkName}</div>
          </div>
        )
      }
    },
    {
      title: '应用状态',
      dataIndex: 'status',
      dictType: 'app_status',
      render: (item: any) => {
        return <Tag color={getAppStatusColor(item)}>{item}</Tag>
      }
    },
    {
      title: '应用分类',
      dataIndex: 'typeName',
    },
    {
      title: '应用包名',
      dataIndex: 'apkCode',
      width: 200
    },
    {
      title: '应用版本',
      dataIndex: 'versionName',
    },
    {
      title: '内部版本',
      dataIndex: 'versionCode',
    },
    {
      title: '所属机构',
      dataIndex: 'deptName',
    },
    {
      title: '所属组别',
      dataIndex: 'groupName',
      placeHolder: '无',
    },
    {
      title: '终端厂商',
      dataIndex: 'firmName',
    },
    {
      title: '终端型号',
      dataIndex: 'terminalTypes',
    },
    {
      title: '上传时间',
      dataIndex: 'createTime',
      width: 200
    },
  ]);

  /**
   * @todo table查询表单
   */
  const forms: FormItem[] = [
    {
      formName: 'deptId',
      formType: FormItmeType.TreeSelectCommon,
      onChange: onChangeDept,
    },
    {
      placeholder: '所属组别',
      formName: 'groupId',
      formType: FormItmeType.Select,
      selectData:
        (terminalGroupList &&
          terminalGroupList.map((item) => {
            return {
              value: `${item.id}`,
              title: `${item.remark}`,
            };
          })) ||
        [],
      value: terminalGroupValue,
      onChange: (id: string) => {
        setTerminalGroupValue(`${id}`);
      },
    },
    {
      formName: 'apkName',
      placeholder: '应用名称',
      formType: FormItmeType.Normal,
    },
    {
      formName: 'apkCode',
      placeholder: '应用包名',
      formType: FormItmeType.Normal,
    },
    {
      placeholder: '应用类别',
      formName: 'typeId',
      formType: FormItmeType.Select,
      selectData:
        (Array.isArray(appTypeList) &&
          appTypeList.map((item) => {
            return {
              value: `${item.id}`,
              title: `${item.typeName}`,
            };
          })) ||
        [],
      value: appTypeValue,
      onChange: (id: string) => {
        setAppTypeValue(`${id}`);
      },
    },
    {
      formName: ['status',],
      formType: FormItmeType.SelectCommon,
      dictList: ['app_status'],
    },
  ];

  const extraButtons = [
    { title: '上传', onClick: onUpload, icon: <UploadOutlined /> },
    { title: '提交审核', onClick: onAuditSubmit, type: "primary" as any },
    { title: '回收站', onClick: onDelete, icon: <DeleteOutlined /> }
  ]

  const rowSelection = {
    type: 'radio',
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
        rowKey="id"
        rowSelection={rowSelection}
        columns={columns}
        {...tableProps}
        scroll={{ x: 1600 }}
        pagination={getStandardPagination(tableProps.pagination)}
      />
    </Spin>
  );


}
export default Page;


