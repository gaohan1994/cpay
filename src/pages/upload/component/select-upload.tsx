/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-08-11 17:48:19 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-08-21 10:03:36
 * 
 * @todo 上传apk用到的组件
 */
import React, { useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import { Upload, Button, Progress, notification, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import numeral from 'numeral';

type Props = {
  uploadRef: any;
  maxSize?: string;
  renderRequire?: () => any;
  renderButton?: () => any;
  fileType?: { type: string, message: string };
}

function SelectUpload(props: Props) {
  const [file, setFile] = useState({} as any);

  /**
   * @todo 将子组件的数据暴露给父组件
   */
  useImperativeHandle(props.uploadRef, () => (
    // 这个函数会返回一个对象
    // 该对象会作为父组件 current 属性的值
    // 通过这种方式，父组件可以使用操作子组件中的多个 ref
    {
      file
    }
  ), [file]);

  /**
   * @todo 上传之前先检查文件是否是apk，以及文件大小是否在限制以内
   * @param file 
   */
  const beforeUpload = (file: File) => {
    const { maxSize, fileType } = props;
    if (fileType && fileType.type) {
      if (file.type !== fileType.type) {
        notification.error({ message: fileType.message || '上传文件形式不对，请重新上传' });
        return false;
      }
    }
    if (maxSize) {
      let size;
      let isLtSize = true;
      if (Number(maxSize)) size = maxSize;
      const num = numeral(maxSize.substr(0, maxSize.length - 1)).value();
      const unit = maxSize.substr(maxSize.length - 2);
      if (Number(num)) {
        switch (unit.toLowerCase()) {
          case 'k':
            size = num * 1024;
            break;
          case 'm':
            size = num * 1024 * 1024;
            break;
          case 'G':
            size = num * 1024 * 1024 * 1024;
            break;
          case 'T':
            size = num * 1024 * 1024 * 1024 * 1024;
            break;
          default:
            break;
        }
      }
      if (size) isLtSize = file.size / 1024 / 1024 < size;
      if (!isLtSize) {
        notification.error({ message: '大小超过要求' });
        return false;
      }
    }
    setFile(file);
    return false;
  }

  const uploadProps = {
    beforeUpload: beforeUpload,
    multiple: false,
    withCredentials: true,  // 上传是否带cookie，必要
  };

  return (
    <div style={{ display: 'flex', flex: 1, flexDirection: 'column', marginLeft: 10 }}>
      <div style={{ display: 'flex', flex: 1, flexDirection: 'row', alignItems: 'center' }}>
        <Upload {...uploadProps} showUploadList={false}>
          {
            props.renderButton
              ? props.renderButton()
              : (
                <Button>
                  <UploadOutlined /> 选择
                </Button>
              )
          }
        </Upload>
        {
          props.renderRequire && props.renderRequire()
        }
      </div >
    </div>
  )
}

export default SelectUpload;