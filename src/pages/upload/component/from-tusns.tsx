/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-09-01 11:44:53 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-09-01 11:47:25
 * 
 * @todo 封装的终端集合选择表单
 */
import React, { useState, useRef, useEffect } from "react";
import { Space, Button, Modal, Form, Col, Row, Input, notification } from 'antd';
import { PlusOutlined, CloseOutlined, UploadOutlined, ClearOutlined, DownloadOutlined } from '@ant-design/icons';
import { useForm } from "antd/lib/form/Form";
import SelectUpload from "./select-upload";
import { taskDownloadJobImportTemplate } from "../upload/constants/api";
import { RESPONSE_CODE, getDownloadPath } from '../../../common/config';

interface Props {
  onAddTerminals: () => void;
  options: any[];
  setOptions: any;
}

export function FormTusns(props: Props) {
  const { onAddTerminals, options, setOptions } = props;
  const [selectedOptions, setSelectOptions] = useState([] as any[]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = useForm();
  const uploadRef: any = useRef();
  const [file, setFile] = useState({} as any);

  useEffect(() => {
    if (uploadRef && uploadRef.current && uploadRef.current.file) {
      setFile(uploadRef.current.file);
    }
  }, [uploadRef]);

  /**
   * @todo 删除选中的终端
   * @param type 'ALL'表示清空
   */
  const onDeleTerminals = (type?: string) => {
    if (type === 'ALL') {
      setOptions([]);
    } else if (selectedOptions.length > 0) {
      const arr: string[] = [];
      for (let i = 0; i < options.length; i++) {
        let flag = false;
        for (let j = 0; j < selectedOptions.length; j++) {
          if (options[i] === selectedOptions[j]) {
            flag = true;
            break;
          }
        }
        if (!flag) {
          arr.push(options[i]);
        }
      }
      setOptions(arr);
    }
    setSelectOptions([]);
  }

  /**
   * @todo excel导入终端
   */
  const onImportTerminals = () => {
    setModalVisible(true);
  }

  /**
   * @todo 改变选中值
   * @param e 
   */
  const handleSelectChange = (e: any) => {
    const options = e.target.options;
    let arr: string[] = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        arr.push(options[i].value);
      }
    }
    setSelectOptions(arr);
  }

  const hideModal = () => {
    setModalVisible(false);
  }

  const handleOk = () => {

  }

  const onDownloadImportTemplate = async () => {
    const res = await taskDownloadJobImportTemplate();
    if (res && res.code === RESPONSE_CODE.success) {
      const href = getDownloadPath(res.data);
      window.open(href, '_blank');
    } else {
      notification.error({ message: res && res.msg || '下载模版失败' });
    }
  }

  console.log('test bbb', file);

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Space>
        <Button type="primary" icon={<PlusOutlined />} onClick={onAddTerminals}>
          添加终端
        </Button>
        {/* <Button type="primary" icon={<UploadOutlined />} onClick={onImportTerminals}>
          Excel导入
        </Button> */}
        <Button type="primary" icon={<CloseOutlined />} onClick={() => onDeleTerminals()}>
          删除
        </Button>
        <Button type="primary" icon={<ClearOutlined />} onClick={() => { onDeleTerminals('ALL') }}>
          清空
        </Button>
      </Space>

      <select
        style={{
          width: '100%',
          height: 200,
          border: '1px solid rgb(217, 217, 217)',
          padding: 11,
          overflow: 'auto'
        }}
        multiple={true}
        value={selectedOptions}
        onChange={handleSelectChange}
      >
        {
          options.map(item => {
            return (
              <option value={item} key={item}>{item}</option>
            )
          })
        }
      </select>
      <Modal
        visible={modalVisible}
        onCancel={hideModal}
        onOk={handleOk}
        title="终端导入"
        footer={<Button type='primary' onClick={handleOk}>上传</Button>}
      >
        <Form
          form={form}
        >
          <Form.Item label="文件上传" name='file' rules={[
            {
              required: true,
              message: '请上传文件',
            }]}
          >
            <Row>
              <Col span={12}>
                <Input disabled={true} value={''} />
              </Col>
              <Col span={12}>
                <SelectUpload
                  uploadRef={uploadRef}
                  maxSize='100M' />
              </Col>
            </Row>
          </Form.Item>
        </Form>
        <Button type='primary' onClick={onDownloadImportTemplate}><DownloadOutlined />下载模版</Button>
      </Modal>
    </Space>
  )
}