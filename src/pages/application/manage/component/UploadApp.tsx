import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Upload, message, Button, Modal, Progress, Col, Row } from 'antd';
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
}

type State = {
  showProgress: boolean;
  progress: number;
  file: any;
  appInfo: any;
}

function UploadApp(props: Props) {
  const initState: State = {
    showProgress: false,
    progress: 0,
    file: {},
    appInfo: {},
  }

  const [useSelector, dispatch] = useRedux();
  const [showProgress, setShowProgress] = useState(initState.showProgress);
  const [progress, setProgress] = useState(initState.progress);
  const [file, setFile] = useState(initState.file);

  useImperativeHandle(props.uploadRef, () => (
    // 这个函数会返回一个对象
    // 该对象会作为父组件 current 属性的值
    // 通过这种方式，父组件可以使用操作子组件中的多个 ref
    {
      file
    }
  ), [file]);

  const beforeUpload = (file: File) => {
    const { maxSize } = props;
    if (file.type !== 'application/vnd.android.package-archive') {
      message.error('请上传apk类型文件');
      return false;
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
        message.error('大小超过要求');
        return false;
      }
    }

    setFile({});
    setShowProgress(true)
    return true;
  }

  const setAppInfo = (appInfo: IUploadAppInfo) => {
    dispatch({
      type: ACTION_TYPES_APP.RECEIVE_APP_INFO,
      payload: appInfo,
    });
  }

  const handleUploadChange = (info: any) => {
    if (info.file) {
      if (info.file.status === 'done') {
        setFile(info.file);
        // setShowProgress(false);
        // setProgress(0);
        const response = info.file.response;
        if (response.code === RESPONSE_CODE.success) {
          message.success("上传apk成功");
          setAppInfo(response.data);
        } else {
          message.error(response.msg || '获取apk信息失败');
        }
      } else if (info.file.status === 'error') {
        setFile(info.file);
        message.error("上传apk失败，请重试");
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
    withCredentials: true
  };

  return (
    <div style={{ display: 'flex', flex: 1, flexDirection: 'column', marginLeft: 10 }}>
      <div style={{ display: 'flex', flex: 1, flexDirection: 'row', alignItems: 'center' }}>
        <Upload {...uploadProps} showUploadList={false}>
          <Button>
            <UploadOutlined /> 上传应用包
          </Button>
        </Upload>
        <div style={{ marginLeft: 10, whiteSpace: 'nowrap' }}>
          (请上传不超过100M的APK)
        </div>
      </div >
      {
        showProgress && (
          // <Col span={8} >
            <Progress percent={progress} />
          // </Col>
        )
      }
    </div>

  )
}

export default forwardRef(UploadApp);