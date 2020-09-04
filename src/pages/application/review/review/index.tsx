/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-08-12 09:32:53 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-08-12 11:18:59
 * 
 * @todo 审核页面 
 */
import React, { useState, useEffect } from 'react';
import { notification, Row, Form, Input, Button, Spin } from 'antd';
import { useHistory } from 'react-router-dom';
import { appInfoDetail, appAuditApk } from '../../constants/api';
import { RESPONSE_CODE } from '../../../../common/config';
import TextArea from 'antd/lib/input/TextArea';
import { useQueryParam } from '../../../../common/request-util';
import { useDetail } from '@/pages/common/costom-hooks/use-detail';
import { CustomFromItem } from '@/common/type';
import { CustomFormItems } from '@/component/custom-form';
import FixedFoot, { ErrorField } from '@/component/fixed-foot';

const fieldLabels = {
  apkName: '应用名称',
  apkCode: '应用包名',
  iconPath: '应用图标',
  versionName: '应用版本',
  versionCode: '内部版本',
  deptName: '所属机构',
  groupName: '所属组别',
  typeName: '应用分类',
  firmName: '终端厂商',
  terminalTypes: '终端型号',
  permissions: '权限',
  keyWord: '关键词',
  apkDescription: '应用简介',
  versionDescription: '版本更新说明',
  picPaths: '应用截图',
  reviewMsg: '历史审核意见',
  currentReviewMsg: '请填写审核意见',
}

function Page() {
  const history = useHistory();
  const id = useQueryParam('id');
  const [flag, setFlag] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorField[]>([]);
  const [form] = Form.useForm();

  const { detail } = useDetail(id, appInfoDetail, setLoading);

  useEffect(() => {
    let permissions: string[] = [];
    let permissionsStr: string = '';
    let images: string[] = [];
    if (typeof detail.permissions === 'string' && detail.permissions.length > 0) {
      permissions = detail.permissions.split(';');
      let str = '';
      for (let i = 0; i < permissions.length; i++) {
        str += permissions[i];
        str += '\r\n';
      }
      permissionsStr = str;
    }
    if (typeof detail.picPaths === 'string' && detail.picPaths.length > 0) {
      images = detail.picPaths.split(';')
    }
    form.setFieldsValue({
      ...detail,
      permissions: permissionsStr,
      picPaths: images
    });
    setFlag(!flag);
  }, [detail]);

  const forms: CustomFromItem[] = [
    {
      label: fieldLabels.apkName,
      key: 'apkName',
      render: () => <Input disabled />
    },
    {
      label: fieldLabels.apkCode,
      key: 'apkCode',
      render: () => <Input disabled />
    },
    {
      label: fieldLabels.iconPath,
      key: 'iconPath',
      render: () => renderIcon(form.getFieldValue('iconPath'))
    },
    {
      label: fieldLabels.versionName,
      key: 'versionName',
      render: () => <Input disabled />
    },
    {
      label: fieldLabels.versionCode,
      key: 'versionCode',
      render: () => <Input disabled />
    },
    {
      label: fieldLabels.deptName,
      key: 'deptName',
      render: () => <Input disabled />
    },
    {
      label: fieldLabels.groupName,
      key: 'groupName',
      render: () => <Input disabled />
    },
    {
      label: fieldLabels.typeName,
      key: 'typeName',
      render: () => <Input disabled />
    },
    {
      label: fieldLabels.firmName,
      key: 'firmName',
      render: () => <Input disabled />
    },
    {
      label: fieldLabels.terminalTypes,
      key: 'terminalTypes',
      render: () => <Input disabled />
    },
    {
      label: fieldLabels.permissions,
      key: 'permissions',
      render: () => renderColumns(form.getFieldValue('permissions'))
    },
    {
      label: fieldLabels.keyWord,
      key: 'keyWord',
      render: () => <Input disabled />
    },
    {
      label: fieldLabels.apkDescription,
      key: 'apkDescription',
      render: () => <Input disabled />
    },
    {
      label: fieldLabels.versionDescription,
      key: 'versionDescription',
      render: () => <Input disabled />
    },
    {
      label: fieldLabels.picPaths,
      key: 'picPaths',
      render: () => renderImages(form.getFieldValue('picPaths'))
    },
    {
      label: fieldLabels.reviewMsg,
      key: 'reviewMsg',
      render: () => <Input disabled />
    },
    {
      label: fieldLabels.currentReviewMsg,
      requiredType: 'input',
      key: 'currentReviewMsg',
      render: () => <TextArea />
    },
  ]

  /**
   * @todo 渲染应用图标
   * @param imagePath 
   */
  const renderIcon = (imagePath: string) => {
    if (typeof imagePath === 'string' && imagePath.length > 0) {
      return (
        <img
          src={imagePath}
          style={{ width: 80, height: 80, background: '#f2f2f2', borderRadius: 10 }}
        />
      )
    } else {
      return (
        <div style={{ width: 80, height: 80, background: '#f2f2f2', borderRadius: 10 }}></div>
      )
    }
  }

  /**
   * @todo 渲染应用截图
   * @param imagePaths 
   */
  const renderImages = (imagePaths: string[]) => {
    if (Array.isArray(imagePaths) && imagePaths.length > 0) {
      return (
        <Row>
          {
            imagePaths.length > 0 && imagePaths.map(item => {
              return (
                <img key={item} src={item} style={{ width: '80px', height: '80px', marginRight: '20px', marginBottom: '10px', marginTop: '10px' }} />
              )
            })
          }
        </Row>
      )
    } else {
      return <div />
    }
  }

  /**
   * @todo 渲染应用权限
   * @param columns 
   */
  const renderColumns = (columns: string[]) => {
    return (
      <TextArea disabled value={columns} style={{ display: 'flex' }} autoSize={true} />
    )
  }

  /**
   * @todo 执行审核操作
   * @param isPass 
   */
  const onSubmit = async (isPass: boolean) => {
    try {
      const values = await form.validateFields();
      console.log('Success:', values);
      const params = {
        id: id,
        reviewMsg: form.getFieldValue('currentReviewMsg'),
        isPass
      };
      setLoading(true);
      const res = await appAuditApk(params);
      setLoading(false);
      if (res && res.code === RESPONSE_CODE.success) {
        notification.success({ message: '审核成功' });
        history.goBack();
      } else {
        notification.error({ message: res.msg || '审核失败，请重试' });
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
      setError(errorInfo.errorFields);
    }
  }

  return (
    <Spin spinning={loading}>
      <div style={{ paddingTop: 10 }}>
        <Form
          form={form}
          className="ant-advanced-search-form"
          style={{ backgroundColor: 'white' }}
        >
          <CustomFormItems items={forms} singleCol={true} />
        </Form>
      </div>
      <FixedFoot errors={error} fieldLabels={fieldLabels}>
        <Button type="primary" loading={loading} onClick={() => onSubmit(true)}>
          通过
        </Button>
        <Button type="primary" loading={loading} onClick={() => onSubmit(false)}>
          不通过
        </Button>
        <Button onClick={() => history.goBack()}>返回</Button>
      </FixedFoot>
    </Spin>
  )
}

export default Page;
