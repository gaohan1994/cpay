import React, { useState } from 'react';
import { Button, Col, Form, Input, Row, Table, Select, TreeSelect } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useAntdTable } from 'ahooks';
import { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { terminalInfoList } from './constants/api';
import { formatListResult } from '@/common/request-util';

const { Item } = Form;
const { Option } = Select;

export default () => {
  const [form] = Form.useForm();

  const { tableProps, search }: any = useAntdTable(
    (paginatedParams: PaginatedParams, tableProps: any) => {
      console.log('paginatedParams', paginatedParams);
      console.log('tableProps', tableProps);
      // terminalInfoList(paginatedParams, tableProps)
      return terminalInfoList(paginatedParams, tableProps);
    },
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
      width: 100,
    },
    {
      title: '终端序列号',
      dataIndex: 'tusn',
    },
    {
      title: '商户编号',
      width: 80,
      dataIndex: 'merchantId',
    },
    {
      title: '终端厂商',
      width: 120,
      dataIndex: 'merchantName',
    },
    {
      title: '终端型号',
      width: 80,
      dataIndex: 'terminalTypeName',
    },
    {
      title: '终端类型',
      width: 80,
      dataIndex: 'terminalTypeName',
    },
    {
      title: '所属机构',
      width: 80,
      dataIndex: 'deptName',
    },
    {
      title: '所属组',
      dataIndex: 'tusn',
    },
    {
      title: '商户名称',
      dataIndex: 'tusn',
    },
    {
      title: '是否支持DCC',
      dataIndex: 'tusn',
    },
    {
      title: '银联间直连',
      dataIndex: 'tusn',
    },
    {
      title: '业务类型',
      dataIndex: 'tusn',
    },
    {
      title: '终端状态',
      dataIndex: 'tusn',
    },
  ];

  const treeData = [
    {
      title: 'Node1',
      value: '0-0',
      children: [
        {
          title: 'Child Node1',
          value: '0-0-1',
        },
        {
          title: 'Child Node2',
          value: '0-0-2',
        },
      ],
    },
    {
      title: 'Node2',
      value: '0-1',
    },
  ];

  let tableWidth: number = 0;
  columns.map((item) => {
    if (!!item.width) {
      tableWidth += item.width;
    }
  });

  const treeProps = {
    style: { width: '100%' },
    name: 'treeSelect',
    dropdownStyle: { maxHeight: 400, overflow: 'auto' },
    treeData: treeData,
    placeholder: '所属机构',
    treeDefaultExpandAll: true,
  };

  const advanceSearchForm = (
    <div>
      <Form form={form}>
        <Row gutter={24}>
          <Col span={4}>
            <Item name="tusn">
              <Input placeholder="终端序列号" />
            </Item>
          </Col>
          <Col span={4}>
            <Item name="merchantId">
              <Input placeholder="终端编号" />
            </Item>
          </Col>
          <Col span={4}>
            <Item name="merchantCode">
              <Input placeholder="商户编号" />
            </Item>
          </Col>
          <Col span={4}>
            <Form.Item name="treeData">
              <TreeSelect {...(treeProps as any)} />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="select">
              <Select placeholder="所属组">
                <Option value="china">China</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="select">
              <Select placeholder="终端厂商">
                <Option value="china">China</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="select">
              <Select placeholder="终端型号">
                <Option value="china">China</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="select">
              <Select placeholder="终端类型">
                <Option value="china">China</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="select">
              <Select placeholder="是否支持DCC">
                <Option value="china">China</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="select">
              <Select placeholder="银联间直联">
                <Option value="china">China</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="select">
              <Select placeholder="业务类型">
                <Option value="china">China</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="select">
              <Select placeholder="终端状态">
                <Option value="china">China</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Form.Item style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={reset} style={{ marginRight: 12 }}>
              重制
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
      <Table
        style={{ overflowX: 'auto' }}
        columns={columns}
        rowKey="email"
        {...tableProps}
        scroll={{ x: 2200 }}
      />
    </div>
  );
};
