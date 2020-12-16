/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-08-12 09:27:59 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-09-10 17:32:39
 * 
 * @todo 应用发布列表页面
 */
import React, { useState, useEffect } from 'react';
import { Form, Table, Row, Popconfirm, notification, Divider, Tag, Spin, Modal } from 'antd';
import { useAntdTable } from 'ahooks';
import { getAppTypeList, appPublishList, appShelve } from '../constants/api';
import { formatListResult } from '@/common/request-util';
import { useStore } from '@/pages/common/costom-hooks';
import Forms from '@/component/form';
import { FormItem, FormItmeType } from '@/component/form/type';
import { createTableColumns, getStandardPagination } from '@/component/table';
import history from '@/common/history-util';
import { ITerminalGroupByDeptId } from '@/pages/terminal/message/types';
import { terminalGroupListByDept } from '@/pages/terminal/message/constants/api';
import { IAppType } from '../types';
import { RESPONSE_CODE } from '@/common/config';
import { getAppStatusColor } from '../common/util';
import invariant from 'invariant';

type Props = {};

function Page(props: Props) {
  // 请求dept数据
  useStore(['app_status']);
  const initState = {
    terminalGroup: [] as ITerminalGroupByDeptId[],  // 终端组别
    groupValue: '',                                 // 终端组别选中值
    formTreeValue: -1,                              // 机构树选中值
    appTypeList: [] as IAppType[],                  // 应用类型列表
    appTypeValue: ''                                // 应用类型选中值
  };
  const [terminalGroup, setTerminalGroup] = useState(initState.terminalGroup);
  const [groupValue, setGroupValue] = useState(initState.groupValue);
  const [formTreeValue, setFormTreeValue] = useState(initState.formTreeValue);
  const [appTypeList, setAppTypeList] = useState(initState.appTypeList);
  const [appTypeValue, setAppTypeValue] = useState(initState.appTypeValue);
  const [loading, setLoading] = useState(false);

  /**
   * @todo 根据机构id获取终端组别
   */
  useEffect(() => {
    terminalGroupListByDept(formTreeValue, (groupData) => {
      setTerminalGroup(groupData);
      if (groupData.length > 0) {
        setGroupValue(`${groupData[0].id}`);
      }
    });
  }, [formTreeValue]);

  /**
   * @todo 获取应用类型列表
   */
  useEffect(() => {
    getAppTypeList({}, (typeList: any[]) => {
      setAppTypeList(typeList);
    });
  }, []);

  const [form] = Form.useForm();

  const { tableProps, search }: any = useAntdTable(
    (paginatedParams: any, tableProps: any) =>
      appPublishList({ pageSize: paginatedParams.pageSize, pageNum: paginatedParams.current, ...tableProps }),
    {
      form,
      formatResult: formatListResult,
    }
  );
  const { submit, reset } = search;

  /**
   * @todo 跳转到应用详情页
   * @param item 
   */
  const onDetail = (item: any) => {
    history.push(`/application/publish/detail?id=${item.id}&status=${item.status}`);
  }

  /**
   * @todo 监听机构表单的改变
   */
  const onChange = (deptId: number) => {
    setFormTreeValue(deptId);
  };

  /**
   * @todo 下架应用
   * @param item 
   */
  const onUnshelveItem = async (item: any) => {
    Modal.confirm({
      title: '提示',
      content: `确认要下架当前应用吗?`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          setLoading(true);
          const result = await appShelve({ appId: item.id, isOnShelves: false });
          setLoading(false);
          invariant(result && result.code === RESPONSE_CODE.success, result && result.msg || '下架应用失败，请重试');
          notification.success({ message: '下架应用成功!' });
          submit();
        } catch (error) {
          notification.warn({ message: error.message });
        }
      },
    });
  }

  /**
   * @todo 跳转到发布应用的页面
   * @param item 
   */
  const onPublish = (item: any) => {
    history.push(`/application/publish/publish?id=${item.id}`);
  }

  /**
   * @todo 创建table列
   */
  const columns = createTableColumns([
    {
      title: '操作',
      render: (key, item) => (
        <div>
          <a onClick={() => onDetail(item)}>详情</a>
          {
            (item.status === 2 ) && (
              <>
                <Divider type="vertical" />
                <a onClick={() => onPublish(item)}>发布</a>
              </>
            )
          }
          {
            (item.status === 4 ) && (
              <>
                <Divider type="vertical" />
                <a onClick={() => onPublish(item)}>上架</a>
              </>
            )
          }
          {
            item.status === 3 && (
              <>
                <Divider type="vertical" />
                <a onClick={() => onUnshelveItem(item)}>下架</a>
              </>
            )
          }
        </div>
      ),
      fixed: 'left',
      align: 'center',
      width: 140,
    },
    {
      title: '应用名称',
      align: 'center',
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
      width: 200,
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
      title: '发布时间',
      dataIndex: 'updateTime',
      width: 200,
    },
  ]);

  /**
   * @todo 查询表单
   */
  const forms: FormItem[] = [
    {
      formName: 'deptId',
      formType: FormItmeType.TreeSelectCommon,
      onChange: onChange,
    },
    {
      placeholder: '所属组别',
      formName: 'groupId',
      formType: FormItmeType.Select,
      selectData:
        (terminalGroup &&
          terminalGroup.map((item) => {
            return {
              value: `${item.id}`,
              title: `${item.name}`,
            };
          })) ||
        [],
      value: groupValue,
      onChange: (id: string) => {
        setGroupValue(`${id}`);
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
  ];


  return (
    <Spin spinning={loading}>
      <Forms
        form={form}
        forms={forms}
        formButtonProps={{
          submit,
          reset,
        }}
      />
      <Table
        rowKey="id"
        columns={columns}
        {...tableProps}
        scroll={{ x: 1400 }}
        pagination={getStandardPagination(tableProps.pagination)}
      />
    </Spin>
  );
}
export default Page;

