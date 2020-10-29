import React, { useState, useRef, useEffect, Fragment } from 'react';
import { Button, Modal, Form, Col, Row, Input, notification, message, Upload } from 'antd';
import {
  CloseOutlined,
  DownloadOutlined,
  UploadOutlined,
  CheckCircleFilled,
  CheckOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { useForm } from 'antd/lib/form/Form';
import { RESPONSE_CODE, getDownloadPath } from '@/common/config';
import { terminalInfoImport, terminalInfoImportTemplate } from '../constants/api';

interface Props {
  visible: boolean;
  onCancel: () => void;
  children?: any;
}

export default function ImportPage(props: Props) {
  const { visible, onCancel } = props;
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
    const formData = new FormData();
    formData.append('file', file);
    const res = await terminalInfoImport(formData);
    if (res && res.code === RESPONSE_CODE.success) {
      notification.success({ message: '导入成功' });
      setFile({});
      setResultModalVisible(true);
      setImportResult(res.data);
      onCancel();
    } else {
      notification.error({ message: (res && res.msg) || '导入终端信息失败' });
    }
  };

  const beforeUpload = (file: File) => {
    const type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    if (file.type !== type) {
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
