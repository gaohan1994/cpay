import React from 'react';
import { Col, Form, Input, Row, Select, TreeSelect } from 'antd';
import { DeptTreeData } from '@/pages/common/type';
import { useSelectorHook } from '@/common/redux-util';
import FormButton, { FormButtonProps } from '@/component/form-button';

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
} & FormButtonProps;

function AdvertisementForm(props: Props) {
  const { form, submit, reset, ...rest } = props;
  const common = useSelectorHook((state) => state.common);
  const { deptTreeData, dictList } = common;
  const { advert_file_type, advert_type } = dictList;

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
          {[advert_file_type, advert_type]
            .filter((i) => !!i)
            .map((item, index) => {
              return (
                <Col span={4} key={index}>
                  <Item name={item.dictType}>
                    <Select placeholder={item.dictName}>
                      {item.data.map((dictOption, index) => {
                        return (
                          <Option
                            value={dictOption.dictValue}
                            key={dictOption.dictValue}
                          >
                            {dictOption.dictLabel}
                          </Option>
                        );
                      })}
                    </Select>
                  </Item>
                </Col>
              );
            })}
        </Row>
        <Row>
          <FormButton reset={reset} submit={submit} {...rest} />
        </Row>
      </Form>
    </div>
  );
}

export default AdvertisementForm;
