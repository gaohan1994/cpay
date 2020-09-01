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
import { BASIC_CONFIG } from '@/common/config';
import { RESPONSE_CODE } from '@/common/config';
import { useRedux } from '@/common/redux-util';
import { IUploadAppInfo } from '../../types';
import { ACTION_TYPES_APP } from '../../reducers';

type Props = {
  uploadRef: any;
  maxSize?: string;
  renderRequire?: () => any;
  renderButton?: () => any;
  fileType?: { type: string, message: string }; // 不传默认为apk形式的文件
}

type State = {
  showProgress: boolean;
  progress: number;
  file: any;
}

function UploadApp(props: Props) {
  const initState: State = {
    showProgress: false,  // 是否展示进度条
    progress: 0,          // 上传进度
    file: {},             // 上传的文件
  }

  const [useSelector, dispatch] = useRedux();
  const [showProgress, setShowProgress] = useState(initState.showProgress);
  const [progress, setProgress] = useState(initState.progress);
  const [file, setFile] = useState(initState.file);

  useEffect(() => {
    dispatch({
      type: ACTION_TYPES_APP.RECEIVE_APP_INFO,
      payload: {},
    });
  }, []);

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
    } else {
      if (file.type !== 'application/vnd.android.package-archive') {
        notification.error({ message: '请上传apk类型文件' });
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
    setFile({});
    setShowProgress(true)
    return true;
  }

  /**
   * @todo 获取到从后端传来的appinfo后，放入全局文件中
   * @param appInfo 
   */
  const setAppInfo = (appInfo: IUploadAppInfo) => {
    dispatch({
      type: ACTION_TYPES_APP.RECEIVE_APP_INFO,
      payload: appInfo,
    });
  }

  /**
   * @todo 监听上传的变化，改变当前上传进度，成功和失败执行相应的操作
   * @param info 
   */
  const handleUploadChange = (info: any) => {
    if (info.file) {
      if (info.file.status === 'done') {
        setFile(info.file);
        const response = info.file.response;
        if (response && response.code === RESPONSE_CODE.success) {
          notification.success({ message: "上传成功" });
          setAppInfo(response.data);
        } else {
          notification.error({ message: response.msg || '获取软件信息失败' });
        }
      } else if (info.file.status === 'error') {
        setFile(info.file);
        notification.error({ message: "上传失败，请重试" });
        setShowProgress(false);
        setProgress(0);
      } else if (info.file.status === 'uploading') {
        if (info.file.percent) {
          const percent = numeral(info.file.percent).format('0.00');
          setProgress(numeral(percent).value());
        }
      }
    }
  }

  const uploadProps = {
    action: `${BASIC_CONFIG.BASE_URL}/cpay-admin/app/info/uploadApk`,
    onChange: handleUploadChange,
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
                <Button style={{ width: 120 }}>
                  <UploadOutlined /> 上传应用包
                </Button>
              )
          }
        </Upload>
        {
          props.renderRequire && props.renderRequire()
        }
      </div >
      {
        showProgress && (
          <Progress percent={progress} style={{ width: 150 }} />
        )
      }
    </div>
  )
}

export default UploadApp;