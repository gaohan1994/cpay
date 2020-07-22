import React, { useState } from 'react';
import { Button, Col, Form, Input, Row, Table, Select, TreeSelect } from 'antd';
import { useAntdTable } from 'ahooks';
import { PaginatedParams } from 'ahooks/lib/useAntdTable';
import { getTableData, merchantQueryBocoms } from '../constants/api';

const { Item } = Form;
const { Option } = Select;

export default () => {
  const [form] = Form.useForm();

  const { tableProps, search }: any = useAntdTable(
    (paginatedParams: PaginatedParams, tableProps: any) =>
      merchantQueryBocoms({ paginatedParams, tableProps }, {}),
    {
      form
    }
  );

  const { submit, reset } = search;

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

  const treeData = [
    {
      title: 'Node1',
      value: '0-0',
      children: [
        {
          title: 'Child Node1',
          value: '0-0-1'
        },
        {
          title: 'Child Node2',
          value: '0-0-2'
        }
      ]
    },
    {
      title: 'Node2',
      value: '0-1'
    }
  ];

  const treeProps = {
    style: { width: '100%' },
    name: 'treeSelect',
    dropdownStyle: { maxHeight: 400, overflow: 'auto' },
    treeData: treeData,
    placeholder: '所属机构',
    treeDefaultExpandAll: true
  };

  const advanceSearchForm = (
    <div>
      <Form form={form}>
        <Row gutter={24}>
          <Col span={4}>
            <Item name='name'>
              <Input placeholder='终端序列号' />
            </Item>
          </Col>
          <Col span={4}>
            <Item name='email'>
              <Input placeholder='终端编号' />
            </Item>
          </Col>
          <Col span={4}>
            <Item name='phone'>
              <Input placeholder='商户编号' />
            </Item>
          </Col>
          <Col span={4}>
            <Form.Item name='treeData'>
              <TreeSelect
                // style={{ width: '100%' }}
                // value={this.state.value}
                // name='treeSelect'
                // dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                // treeData={treeData}
                // placeholder='Please select'
                // treeDefaultExpandAll
                // onChange={this.onChange}
                {...(treeProps as any)}
              />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name='select'>
              <Select placeholder='所属组'>
                <Option value='china'>China</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name='select'>
              <Select placeholder='终端厂商'>
                <Option value='china'>China</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name='select'>
              <Select placeholder='终端型号'>
                <Option value='china'>China</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name='select'>
              <Select placeholder='终端类型'>
                <Option value='china'>China</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name='select'>
              <Select placeholder='是否支持DCC'>
                <Option value='china'>China</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name='select'>
              <Select placeholder='银联间直联'>
                <Option value='china'>China</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name='select'>
              <Select placeholder='业务类型'>
                <Option value='china'>China</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name='select'>
              <Select placeholder='终端状态'>
                <Option value='china'>China</Option>
              </Select>
            </Form.Item>
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
