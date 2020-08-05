import React, { useState, useEffect } from 'react';
import { Form, Table } from 'antd';
import { useAntdTable } from 'ahooks';
import { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { appAuditList, appInfoList } from '../constants/api';
import { formatListResult } from '@/common/request-util';
import { useStore } from '@/pages/common/costom-hooks';
import Forms from '@/component/form';
import { FormItem, FormItmeType } from '@/component/form/type';
import { createTableColumns } from '@/component/table';
import history from '@/common/history-util';
import { ITerminalGroupByDeptId } from '@/pages/terminal/message/types';
import { terminalGroupListByDept } from '@/pages/terminal/message/constants/api';
import { DeleteOutlined } from '@ant-design/icons';

type Props = {};

function Page(props: Props) {
  // 请求dept数据
  useStore(['app_type', 'app_status']);
  const initState = {
    terminalGroup: [] as ITerminalGroupByDeptId[],
    groupValue: '',
    formTreeValue: -1,
  };
  const [terminalGroup, setTerminalGroup] = useState(initState.terminalGroup);
  const [groupValue, setGroupValue] = useState(initState.groupValue);
  const [formTreeValue, setFormTreeValue] = useState(initState.formTreeValue);

  useEffect(() => {
    terminalGroupListByDept(formTreeValue, (groupData) => {
      setTerminalGroup(groupData);
      setGroupValue(`${groupData[0].id}`);
    });
  }, [formTreeValue]);

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

  const onClick = (item: any) => {
    history.push(`/advertisement/review-detail?id=${item.id}`);
  };

  const onUpload = () => {
    history.push(`/application/manage-upload`);
  }

  const onChange = (deptId: number) => {
    setFormTreeValue(deptId);
  };

  const columns = createTableColumns([
    {
      title: '操作',
      render: (key, item) => <a onClick={() => onClick(item)}>审核</a>,
      fixed: 'left',
    },
    {
      title: '应用名称',
      dataIndex: 'apkName',
    },
    {
      title: '应用分类',
      dataIndex: 'typeName',
      // dictType: 'app_type',
    },
    {
      title: '应用包名',
      dataIndex: 'apkCode',
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
      title: '应用状态',
      dataIndex: 'status',
      dictType: 'app_status',
    },
    {
      title: '上传时间',
      dataIndex: 'createTime',
    },
  ]);

  const forms: FormItem[] = [
    {
      span: 4,
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
              title: `${item.remark}`,
            };
          })) ||
        [],
      value: groupValue,
      onChange: (id: string) => {
        setGroupValue(`${id}`);
      },
    },
    {
      formName: 'appName',
      placeholder: '应用名称',
      formType: FormItmeType.Normal,
    },
    {
      formName: 'appPackage',
      placeholder: '应用包名',
      formType: FormItmeType.Normal,
    },
    {
      formName: ['appType'],
      formType: FormItmeType.SelectCommon,
      dictList: ['app_type'],
    },
  ];

  const extraButtons = [
    { title: '上传', onClick: onUpload },
    { title: '提交审核', onClick: onClick, type: "primary" as any },
    { title: '回收站', onClick: onClick, icon: <DeleteOutlined /> }
  ]

  return (
    <div>
      <Forms
        form={form}
        forms={forms}
        formButtonProps={{
          submit,
          reset,
          extraButtons
        }}
      />
      <Table columns={columns}  {...tableProps} scroll={{x: 1600 }}/>
    </div>
  );
}
export default Page;

