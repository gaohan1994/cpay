/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-09-01 11:44:53 
 * @Last Modified by: centerm.gaohan
 * @Last Modified time: 2020-10-14 15:17:24
 * 
 * @todo 封装的终端集合选择表单
 */
import React, { useState, useRef, useEffect } from "react";
import { Space, Button, Modal, Form, Col, Row, Input, notification, message } from 'antd';
import {
  PlusOutlined, CloseOutlined, UploadOutlined,
  ClearOutlined, DownloadOutlined, CheckCircleFilled,
  CheckOutlined, ExclamationCircleOutlined
} from '@ant-design/icons';
import { useForm } from "antd/lib/form/Form";
import SelectUpload from "./select-upload";
import { taskDownloadJobImportTemplate } from "../upload/constants/api";
import { RESPONSE_CODE, getDownloadPath } from '../../../common/config';
import { TableTusns } from "./table.tusns";
import { taskUploadJobImportData } from '../constants/api';

const getVaildParam = (param: any) => {
  let validParam = { ...param };
  for (const key in validParam) {
    if (Object.prototype.hasOwnProperty.call(validParam, key)) {
      const element = validParam[key];
      if ((Array.isArray(element) || typeof element === 'string') && element.length === 0) {
        delete validParam[key];
      }
    }
  }
  return validParam;
}

interface Props {
  options: any[];
  setOptions: any;
  fetchParam?: any;
  setFailedOptions?: any;
}

export function FormTusns(props: Props) {
  const { options, setOptions, fetchParam, setFailedOptions } = props;
  const [selectedOptions, setSelectOptions] = useState([] as any[]);
  const [modalVisible, setModalVisible] = useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [form] = useForm();
  const uploadRef: any = useRef();
  const [file, setFile] = useState({} as any);
  const [lastFetchParam, setLastFetchParam] = useState({} as any);
  const [resultModalVisible, setResultModalVisible] = useState(false);
  const [importResult, setImportResult] = useState({} as any);

  useEffect(() => {

  }, [file]);

  useEffect(() => {
    if (importResult.errorMsgList) {
      let arr: string[] = [];
      for (let i = 0; i < importResult.errorMsgList.length; i++) {
        if (importResult.errorMsgList[i]) {
          arr.push(importResult.errorMsgList[i]);
        }
      }
      setFailedOptions && setFailedOptions(arr);
    } else {
      setFailedOptions && setFailedOptions([]);
    }
  }, [importResult]);

  useEffect(() => {
    for (const key in fetchParam) {
      if (Object.prototype.hasOwnProperty.call(fetchParam, key)) {
        const element = fetchParam[key];
        if (element !== lastFetchParam[key]) {
          setLastFetchParam(fetchParam);
          setImportResult({});
          setOptions([]);
          break;
        }
      }
    }
    setLastFetchParam(fetchParam);
  }, [fetchParam]);

  const onAddTerminals = () => {
    const { firmId, terminalTypeId, terminalTypeCodes } = fetchParam;
    if (!firmId || firmId.length === 0) {
      message.error('请选择终端厂商');
      return;
    }
    if ((!terminalTypeId || terminalTypeId && terminalTypeId.length === 0) &&
      (!terminalTypeCodes || terminalTypeCodes && terminalTypeCodes.length === 0)) {
      message.error('请选择终端型号');
      return;
    }

    setModalVisible(true)
  }

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
    const { firmId, terminalTypeId, terminalTypeCodes } = fetchParam;
    if (!firmId || firmId.length === 0) {
      message.error('请选择终端厂商');
      return;
    }
    if ((!terminalTypeId || terminalTypeId && terminalTypeId.length === 0) &&
      (!terminalTypeCodes || terminalTypeCodes && terminalTypeCodes.length === 0)) {
      message.error('请选择终端型号');
      return;
    }
    setImportModalVisible(true);
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

  /**
   * @todo 关闭弹窗
   */
  const hideImportModal = () => {
    setImportModalVisible(false);
  }

  /**
   * @todo 点击弹窗的上传组件调用
   */
  const handleImportModalOk = async () => {
    const formData = new FormData();
    formData.append('file', file);
    const validFetchParam = getVaildParam(fetchParam);
    for (const key in validFetchParam) {
      if (Object.prototype.hasOwnProperty.call(validFetchParam, key)) {
        const element = validFetchParam[key];
        formData.append(key, element);
      }
    }
    const res = await taskUploadJobImportData(formData);
    if (res && res.code === RESPONSE_CODE.success) {
      notification.success({ message: '导入成功' });
      setFile({});
      setResultModalVisible(true);
      setImportResult(res.data);
      let arr: string[] = [];
      const successList = res.data.successList || [];
      for (let i = 0; i < successList.length; i++) {
        arr.push(successList[i].tusn);
      }
      if (options.length === 0) {
        setOptions(arr);
      } else {
        const optionArr = [...options];
        for (let i = 0; i < arr.length; i++) {
          let item = arr[i];
          let flag = false;
          for (let j = 0; j < options.length; j++) {
            if (item === options[j]) {
              flag = true;
              break;
            }
          }
          if (!flag) {
            optionArr.push(item);
          }
        }
        setOptions(optionArr);
      }
      hideImportModal();
    } else {
      notification.error({ message: res && res.msg || '导入终端信息失败' });
    }
  }

  /**
   * @todo 下载模版
   */
  const onDownloadImportTemplate = async () => {
    const res = await taskDownloadJobImportTemplate();
    if (res && res.code === RESPONSE_CODE.success) {
      const href = getDownloadPath(res.data);
      // window.open(href, '_blank');
    } else {
      notification.error({ message: res && res.msg || '下载模版失败' });
    }
  }

  const hideResultModal = () => {
    setResultModalVisible(false);
  }

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Space>
        <Button type="primary" icon={<PlusOutlined />} onClick={onAddTerminals}>
          添加终端
        </Button>
        <Button type="primary" icon={<UploadOutlined />} onClick={onImportTerminals}>
          Excel导入
        </Button>
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
      <TableTusns
        visible={modalVisible}
        hideModal={() => setModalVisible(false)}
        fetchParam={getVaildParam(fetchParam)}
        setOptions={setOptions}
        options={options}
      />
      <Modal
        visible={importModalVisible}
        onCancel={hideImportModal}
        onOk={handleImportModalOk}
        title="终端导入"
        footer={<Button type='primary' onClick={handleImportModalOk}>上传</Button>}
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
                <Input disabled={true} value={file.name || ''} />
              </Col>
              <Col span={12}>
                <SelectUpload
                  uploadRef={uploadRef}
                  maxSize='100M'
                  setFile={setFile}
                  fileType={{ type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", message: "请上传excel文件" }}
                />
              </Col>
            </Row>
          </Form.Item>
        </Form>
        <Button type='primary' onClick={onDownloadImportTemplate}><DownloadOutlined />下载模版</Button>
      </Modal>
      <Modal
        visible={resultModalVisible}
        onCancel={hideResultModal}
        title="信息"
        footer={<Button type='primary' onClick={hideResultModal}>确定</Button>}
        width={320}
      >
        <div style={{ marginLeft: 30 }}>
          <div>
            <CheckCircleFilled style={{ marginRight: 10, color: 'green' }} />导入成功
          </div>
          <div style={{ marginLeft: 20 }}>
            <div>
              <CheckOutlined style={{ marginRight: 10, color: 'green' }} />成功个数：{importResult.successCount}
            </div>
            <div>
              <ExclamationCircleOutlined style={{ marginRight: 10, color: 'orange' }} />重复个数：{importResult.repeatCount}
            </div>
            <div>
              <CloseOutlined style={{ marginRight: 10, color: 'red' }} />失败个数：{importResult.failCount}
            </div>
          </div>
        </div>

      </Modal>
    </Space >
  )
}