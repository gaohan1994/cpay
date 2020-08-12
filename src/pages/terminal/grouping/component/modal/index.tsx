import React, { useState } from 'react';
import { Modal, Row, Col, Form, Button, Radio } from 'antd';

type Props = {
  visible: boolean;
  setFalse: () => void;
};

const { Item } = Form;

export default (props: Props) => {
  const { visible, setFalse } = props;

  const [value, setValue] = useState(1);
  const data: any[] = ['按终端序列号', '按终端编号', '按商户编号'].map(
    (item, index) => {
      return {
        title: item,
        type: 'primary',
        value: index,
      };
    }
  );

  const buttons: any[] = [
    {
      title: '选择',
      type: 'normal',
    },
    {
      title: '上传',
      type: 'primary',
    },
  ];
  const onChange = (e: any) => {
    setValue(e.target.value);
  };
  return (
    <Modal visible={visible} onCancel={setFalse} title="导入" footer={null}>
      <>
        <Row>
          <Item label="模板下载">
            {data.map((button) => {
              return (
                <Button {...button} style={{ marginRight: 12 }}>
                  {button.title}
                </Button>
              );
            })}
          </Item>
        </Row>
        <Row>
          <Item label="导入类型">
            <Radio.Group onChange={onChange} value={value}>
              {data.map((item) => {
                return <Radio value={item.value}>{item.title}</Radio>;
              })}
            </Radio.Group>
          </Item>
        </Row>
        <Row>
          <Item label="选择文件">
            <div>asd</div>
            {buttons.map((button) => {
              return (
                <Button {...button} style={{ marginRight: 12 }}>
                  {button.title}
                </Button>
              );
            })}
          </Item>
        </Row>
      </>
    </Modal>
  );
};
