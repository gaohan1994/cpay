import React from 'react';
import { connect } from 'react-redux';
import { Button, Col, Form, Input, Row, Table, Select, TreeSelect } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useAntdTable, useMount } from 'ahooks';
import { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { advertInfoList } from '../constants/api';
import { formatListResult } from '@/common/request-util';
import { advertisementType, advertisementFileType } from '../types';
import { deptTreeData } from '@/pages/common/constants';
import { connectCommonReducer } from '@/pages/common/reducer';
import { CommonReducerInterface } from '@/pages/common/type';

const { Item } = Form;
const { Option } = Select;

type Props = CommonReducerInterface.IConnectReducerState;

function Page(props: Props) {
  // 请求dept数据
  useMount(() => {
    deptTreeData();
  });

  const [form] = Form.useForm();

  const { tableProps, search }: any = useAntdTable(
    (paginatedParams: PaginatedParams, tableProps: any) =>
      advertInfoList({ ...paginatedParams, ...tableProps }),
    {
      form,
      formatResult: formatListResult,
    }
  );

  const { submit, reset } = search;
  const columns = [
    {
      title: '操作',
      render: () => <a>审核</a>,
      fixed: 'left',
    },
    {
      title: '广告名称',
      dataIndex: 'adName',
    },
    {
      title: '所属机构',
      dataIndex: 'deptName',
    },
    {
      title: '组别名称',
      dataIndex: 'groupId',
    },
    {
      title: '广告类型',
      dataIndex: 'adFileType',
    },
    {
      title: '广告文件类型',
      dataIndex: 'adFileType',
    },
    {
      title: '有效起始时间',
      dataIndex: 'createTime',
    },
    {
      title: '审核状态',
      dataIndex: 'status',
    },
  ].map((item) => {
    return {
      ...item,
      key: item.title,
    };
  });

  const { common } = props;
  const { deptData } = common;
  const advanceSearchForm = (
    <div>
      <Form form={form}>
        <Row gutter={24}>
          <Col span={4}>
            <Item name="name">
              <Input placeholder="广告名称" />
            </Item>
          </Col>
          <Col span={4}>
            <Item name="type">
              <Select placeholder="广告类型">
                {advertisementType.map((item) => {
                  return <Option value={item.value}>{item.title}</Option>;
                })}
              </Select>
            </Item>
          </Col>
          <Col>
            <Item name="adFileType">
              <Select placeholder="广告文件类型">
                {advertisementFileType.map((item) => {
                  return <Option value={item.value}>{item.title}</Option>;
                })}
              </Select>
            </Item>
          </Col>
        </Row>
        <Row>
          <Form.Item style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={reset} style={{ marginRight: 12 }}>
              重置
            </Button>
            <Button type="primary" onClick={submit} icon={<SearchOutlined />}>
              查询
            </Button>
          </Form.Item>
        </Row>
      </Form>
    </div>
  );

  return (
    <div>
      {advanceSearchForm}
      <Table columns={columns} {...tableProps} />
    </div>
  );
}
export default connect(connectCommonReducer)(Page);
