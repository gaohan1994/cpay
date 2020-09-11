/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-08-12 09:35:39 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-09-10 17:32:47
 * 
 * @todo 应用审核列表
 */
import React, { useState, useEffect } from 'react';
import { Form, Table, Tag } from 'antd';
import { useAntdTable } from 'ahooks';
import { getAppTypeList, appAuditList } from '../constants/api';
import { formatListResult } from '@/common/request-util';
import { useStore } from '@/pages/common/costom-hooks';
import Forms from '@/component/form';
import { FormItem, FormItmeType } from '@/component/form/type';
import { createTableColumns, getStandardPagination } from '@/component/table';
import { IAppType } from '../types';
import history from '@/common/history-util';
import { getAppStatusColor } from '../common/util';

type Props = {};

function Page(props: Props) {
  // 请求dept数据
  useStore(['app_status']);
  const initState = {
    formTreeValue: -1,              // 机构树选中的值
    appTypeList: [] as IAppType[],  // 应用类型列表
    appTypeValue: '',               // 应用类型选中的值
  };
  const [appTypeList, setAppTypeList] = useState(initState.appTypeList);
  const [appTypeValue, setAppTypeValue] = useState(initState.appTypeValue);

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
      appAuditList({ pageSize: paginatedParams.pageSize, pageNum: paginatedParams.current, ...tableProps }),
    {
      form,
      formatResult: formatListResult,
    }
  );
  const { submit, reset } = search;

  /**
   * @todo 跳转到应用审核页面
   * @param item 
   */
  const onAudit = (item: any) => {
    history.push(`/application/review-review?id=${item.id}`);
  }

  /**
   * @todo 创建table的列
   */
  const columns = createTableColumns([
    {
      title: '操作',
      render: (key, item) => (
        <a onClick={() => onAudit(item)}>审核</a>
      ),
      fixed: 'left',
      align: 'center',
      width: 70,
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
      title: '申请时间',
      dataIndex: 'updateTime',
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
    <div>
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
    </div>
  );
}
export default Page;

