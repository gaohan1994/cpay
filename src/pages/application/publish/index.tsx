import React, { useState, useEffect } from 'react';
import { Form, Table, Row, Popconfirm, Modal, notification, Divider } from 'antd';
import { useAntdTable } from 'ahooks';
import { appInfoList, getAppTypeList, appInfoRemove, appAuditSubmit, appPublishList, appShelve } from '../constants/api';
import { formatListResult } from '@/common/request-util';
import { useStore } from '@/pages/common/costom-hooks';
import Forms from '@/component/form';
import { FormItem, FormItmeType } from '@/component/form/type';
import { createTableColumns } from '@/component/table';
import history from '@/common/history-util';
import { ITerminalGroupByDeptId } from '@/pages/terminal/message/types';
import { terminalGroupListByDept } from '@/pages/terminal/message/constants/api';
import { DeleteOutlined } from '@ant-design/icons';
import { IAppType } from '../types';
import '@/index.css';
import { RESPONSE_CODE } from '@/common/config';
import invariant from 'invariant';

type Props = {};

function Page(props: Props) {
  // 请求dept数据
  useStore(['app_status']);
  const initState = {
    terminalGroup: [] as ITerminalGroupByDeptId[],
    groupValue: '',
    formTreeValue: -1,
    appTypeList: [] as IAppType[],
    appTypeValue: ''
  };
  const [terminalGroup, setTerminalGroup] = useState(initState.terminalGroup);
  const [groupValue, setGroupValue] = useState(initState.groupValue);
  const [formTreeValue, setFormTreeValue] = useState(initState.formTreeValue);
  const [appTypeList, setAppTypeList] = useState(initState.appTypeList);
  const [appTypeValue, setAppTypeValue] = useState(initState.appTypeValue);

  useEffect(() => {
    terminalGroupListByDept(formTreeValue, (groupData) => {
      setTerminalGroup(groupData);
      setGroupValue(`${groupData[0].id}`);
    });
  }, [formTreeValue]);

  useEffect(() => {
    getAppTypeList((typeList: any[]) => {
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

  const onDetail = (item: any) => {
    history.push(`/application/manage-detail?id=${item.id}`);
  }

  const onChange = (deptId: number) => {
    setFormTreeValue(deptId);
  };

  const onUnshelveItem = async (item: any) => {
    const res = await appShelve({ ids: item.id });
    if (res.code === RESPONSE_CODE.success) {
      notification.success({ message: '应用已放入回收站' });
      submit();
    } else {
      notification.warn({ message: res.msg || '删除应用失败' });
    }
  }

  const onShelve = async (item: any) => {
    const res = await appInfoRemove({ ids: item.id });
    if (res.code === RESPONSE_CODE.success) {
      notification.success({ message: '应用已放入回收站' });
      submit();
    } else {
      notification.warn({ message: res.msg || '删除应用失败' });
    }
  }

  const columns = createTableColumns([
    {
      title: '操作',
      render: (key, item) => (
        <Row style={{ alignItems: 'center' }}>
          <a onClick={() => onDetail(item)}>详情</a>
          <Divider type="vertical" />
          <Popconfirm
            title="是否确认下架？"
            onConfirm={() => onUnshelveItem(item)}
            okText="是"
            cancelText="否"
          >
            <a href="#">下架</a>
          </Popconfirm>
        </Row>
      ),
      fixed: 'left',
      width: 100,
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
      formName: 'appType',
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
      <Table rowKey="id" columns={columns}  {...tableProps} scroll={{ x: 1600 }} />
    </div>
  );
}
export default Page;

