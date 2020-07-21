import React from 'react';
import { Button, Col, Form, Input, Row, Table, Select } from 'antd';
import { useAntdTable } from 'ahooks';
import { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { getTableData } from '../constants/api';

const { Item } = Form;
const { Option } = Select;

export default () => {
  const [form] = Form.useForm();

  const { tableProps, search } = useAntdTable(getTableData, {
    form
  });

  const { type, changeType, submit, reset } = search;

  const columns = [
    {
      title: '终端序列号',
      dataIndex: 'name.last'
    },
    {
      title: '终端编号',
      dataIndex: 'email'
    },
    {
      title: '商户编号',
      dataIndex: 'phone'
    },
    {
      title: '终端厂商',
      dataIndex: 'gender'
    },
    {
      title: '终端型号',
      dataIndex: 'gender'
    },
    {
      title: '终端类型',
      dataIndex: 'gender'
    }
  ];

  const advanceSearchForm = (
    <div>
      <Form form={form}>
        <Row gutter={24}>
          <Col span={8}>
            <Item name='name'>
              <Input placeholder='name' />
            </Item>
          </Col>
          <Col span={8}>
            <Item name='email'>
              <Input placeholder='email' />
            </Item>
          </Col>
          <Col span={8}>
            <Item name='phone'>
              <Input placeholder='phone' />
            </Item>
          </Col>
        </Row>
        <Row>
          <Form.Item style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type='primary' onClick={submit}>
              Search
            </Button>
            <Button onClick={reset} style={{ marginLeft: 16 }}>
              Reset
            </Button>
            <Button type='link' onClick={changeType}>
              Simple Search
            </Button>
          </Form.Item>
        </Row>
      </Form>
    </div>
  );

  return (
    <div>
      {advanceSearchForm}
      <Table columns={columns} rowKey='email' {...tableProps} />
    </div>
  );
};
