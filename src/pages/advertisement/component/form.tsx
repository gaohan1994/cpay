import React from 'react';
import { connect } from 'react-redux';
import { Button, Col, Form, Input, Row, Table, Select, TreeSelect } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { advertisementType, advertisementFileType } from '../types';
import { connectCommonReducer } from '@/pages/common/reducer';
import { CommonReducerInterface, DeptTreeData } from '@/pages/common/type';

const { Item } = Form;
const { Option } = Select;
const { TreeNode } = TreeSelect;

function renderTreeData(data: DeptTreeData) {
  // 有叶子节点
  if (!!data.children) {
    return (
      <TreeNode key={data.id} value={data.id} title={data.name}>
        {data.children.map((item) => {
          return renderTreeData(item);
        })}
      </TreeNode>
    );
  }
  // 无叶子结点
  return <TreeNode key={data.id} value={data.id} title={data.name} />;
}

type Props = {
  form: any;
  submit: any;
  reset: any;
} & CommonReducerInterface.IConnectReducerState;

function AdvertisementForm(props: Props) {
  const { form, submit, reset, common } = props;
  const { deptTreeData, dictList } = common;
  console.log('dictList: ', dictList);
  return (
    <div>
      <Form form={form}>
        <Row gutter={24}>
          {deptTreeData && deptTreeData.length > 0 && (
            <Col span={6}>
              <Item name="deptId">
                <TreeSelect
                  treeDefaultExpandAll
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  placeholder="机构号"
                >
                  {deptTreeData.map((item) => {
                    return renderTreeData(item);
                  })}
                </TreeSelect>
              </Item>
            </Col>
          )}
          <Col span={4}>
            <Item name="name">
              <Input placeholder="广告名称" />
            </Item>
          </Col>
          <Col span={4}>
            <Item name="type">
              <Select placeholder="广告类型">
                {advertisementType.map((item) => {
                  return (
                    <Option value={item.value} key={item.value}>
                      {item.title}
                    </Option>
                  );
                })}
              </Select>
            </Item>
          </Col>
          <Col span={4}>
            <Item name="adFileType">
              <Select placeholder="广告文件类型">
                {advertisementFileType.map((item) => {
                  return (
                    <Option value={item.value} key={item.value}>
                      {item.title}
                    </Option>
                  );
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
}

export default connect(connectCommonReducer)(AdvertisementForm);
