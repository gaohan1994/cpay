/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-08-12 09:24:53 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-08-12 11:18:48
 * 
 * @todo 应用发布页面
 */
import React, { useEffect, useState } from 'react';
import { notification, Row, Form, Input, Button, Radio, Rate, Spin } from 'antd';
import { useHistory } from 'react-router-dom';
import { useQueryParam } from '@/common/request-util';
import { appInfoDetail, appShelve } from '../../constants/api';
import { RESPONSE_CODE } from '../../../../common/config';
import TextArea from 'antd/lib/input/TextArea';
import { useDetail } from '@/pages/common/costom-hooks/use-detail';
import { CustomFormItems } from '@/component/custom-form';
import FixedFoot, { ErrorField } from '@/component/fixed-foot';
import { CustomFromItem } from '@/common/type';

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
  reviewMsg: '审核信息',
  currentReviewMsg: '请填写审核意见',
  isUninstall: '是否可卸载',
  reDegree: '应用推荐度'
}


function Page() {
  const history = useHistory();
  const id = useQueryParam('id');
  const [flag, setFlag] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorField[]>([]);
  const [form] = Form.useForm();

  let { detail } = useDetail(id, appInfoDetail, setLoading);
  detail = detail?.appInfo || {}

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
      label: fieldLabels.isUninstall,
      key: 'isUninstall',
      render: () => renderIsUninstall(),
      requiredType: 'select',
    },
    {
      label: fieldLabels.reDegree,
      key: 'reDegree',
      render: () => <Rate />,
      requiredType: 'select',
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
   * @todo 渲染是否可卸载的表单
   * @param item 
   */
  const renderIsUninstall = () => {
    return (
      <Radio.Group>
        <Radio value={1}>可卸载</Radio>
        <Radio value={0}>不可卸载</Radio>
      </Radio.Group>
    )
  }

  const onSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log('Success:', values);
      const params = {
        appId: id,
        isOnShelves: true,
        isUninstall: form.getFieldValue('isUninstall'),
        reDegree: form.getFieldValue('reDegree'),
      };
      setLoading(true);
      const res = await appShelve(params);
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
        <Button type="primary" loading={loading} onClick={onSubmit}>
          发布
        </Button>
        <Button onClick={() => history.goBack()}>返回</Button>
      </FixedFoot>
    </Spin>
  )
}

export default Page;
