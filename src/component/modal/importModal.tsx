/**
 * @todo 导入Modal组件
 */
import React, { useState, useRef, useEffect, Fragment } from 'react';
import { Button, Modal, Form, Col, Row, Input, notification, message, Upload } from 'antd';
import {
  CloseOutlined,
  UploadOutlined,
  CheckCircleFilled,
  CheckOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { useForm } from 'antd/lib/form/Form';
import { RESPONSE_CODE, getDownloadPath } from '@/common/config';
import invariant from 'invariant'

interface Props {
  visible: boolean;
  onCancel: () => void;
  importFunc: (params: any) => Promise<any>;
  children?: any;
}

export default function ImportPage(props: Props) {
  const { visible, onCancel, importFunc } = props;
  const [form] = useForm();
  const [file, setFile] = useState({} as any);
  const [resultModalVisible, setResultModalVisible] = useState(false);
  const [importResult, setImportResult] = useState({} as any);

  const hideResultModal = () => {
    setResultModalVisible(false);
  };
  /**
   * @todo 点击弹窗的上传组件调用
   */
  const handleImportModalOk = async () => {
    try{
      invariant(Object.keys(file).length, '请选择文件')
      const formData = new FormData();
      formData.append('file', file);
      const res = await importFunc(formData);
      invariant(res?.code === RESPONSE_CODE.success, res.msg || '导入失败')
      notification.success({ message: '导入成功' });
      setFile({});
      setResultModalVisible(true);
      setImportResult(res.data);
      onCancel();
      
    }
    catch(err) {
      setFile({});
      notification.error({ message: (err && err.message) || '导入失败' });
    }

  };

  const beforeUpload = (file: File) => {
    const type = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']
    if (!file || type.indexOf(file.type) === -1) {
      notification.error({ message: '请上传excel文件' });
      return false;
    }
    setFile(file);    
    return false;
  };

  return (
    <Fragment>
      <Modal
        visible={visible}
        onCancel={onCancel}
        onOk={handleImportModalOk}
        title='导入'
        footer={
          <Button type='primary' onClick={handleImportModalOk}>
            上传
          </Button>
        }
      >
        <Form form={form}>
          <Form.Item
            label='文件上传'
            name='file'
            rules={[
              {
                required: true,
                message: '请上传文件',
              },
            ]}
          >
            <Row>
              <Col span={12}>
                <Input disabled={true} value={file.name || ''} />
              </Col>
              <Col span={12}>
                <Upload
                  beforeUpload={beforeUpload}
                  multiple={false}
                  withCredentials={true} // 上传是否带cookie，必要
                  showUploadList={false}
                >
                  <Button>
                    <UploadOutlined /> 选择
                  </Button>
                </Upload>
              </Col>
            </Row>
          </Form.Item>
        </Form>

        {props.children}
      </Modal>
      <Modal
        visible={resultModalVisible}
        onCancel={hideResultModal}
        title='信息'
        footer={
          <Button type='primary' onClick={hideResultModal}>
            确定
          </Button>
        }
        width={320}
      >
        <div style={{ marginLeft: 30 }}>
          <div>
            <CheckCircleFilled style={{ marginRight: 10, color: 'green' }} />
            导入成功
          </div>
          <div style={{ marginLeft: 20 }}>
            <div>
              <CheckOutlined style={{ marginRight: 10, color: 'green' }} />
              成功个数：{importResult.successCount}
            </div>
            <div>
              <ExclamationCircleOutlined style={{ marginRight: 10, color: 'orange' }} />
              重复个数：{importResult.repeatCount}
            </div>
            <div>
              <CloseOutlined style={{ marginRight: 10, color: 'red' }} />
              失败个数：{importResult.failCount}
            </div>
          </div>
        </div>
      </Modal>
    </Fragment>
  );
}
