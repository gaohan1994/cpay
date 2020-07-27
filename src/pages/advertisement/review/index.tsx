import React, { useState } from 'react';
import { Button, Col, Form, Input, Row, Table, Select, TreeSelect } from 'antd';
import { useAntdTable } from 'ahooks';
import { PaginatedParams } from 'ahooks/lib/useAntdTable';
import history from '@/common/history-util';

const { Item } = Form;
const { Option } = Select;

export default () => {
  const [form] = Form.useForm();

  const onItemClick = (parmas: any) => {
    console.log('parmas', parmas);
    history.push(`/advertisement/review-detail/${parmas.id}`);
  };

  const { tableProps, search }: any = useAntdTable(
    (paginatedParams: PaginatedParams, tableProps: any) => {
      return new Promise(resolve =>
        resolve({
          list: [{ email: '871418277@qq.com', id: 1 }],
          total: 5
        })
      );
    },
    {
      form
    }
  );
  const { submit, reset } = search;

  const columns = [
    {
      title: '操作',
      key: 'action',
      render: (params: any, item: any) => {
        return <a onClick={() => onItemClick(item)}>审核</a>;
      }
    },
    {
      title: '终端编号',
      dataIndex: 'email'
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

  const searchForm = (
    <div>
      <Form form={form}>
        <Row gutter={24}>
          <Col span={4}>
            <Form.Item name='treeData'>
              <TreeSelect {...(treeProps as any)} />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Item name='name'>
              <Input placeholder='名称' />
            </Item>
          </Col>
          <Col span={4}>
            <Form.Item name='select'>
              <Select placeholder='类型'>
                <Option value='china'>China</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name='selectfile'>
              <Select placeholder='广告文件类型'>
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
      {searchForm}
      <Table columns={columns} rowKey='email' {...tableProps} />
    </div>
  );
};
