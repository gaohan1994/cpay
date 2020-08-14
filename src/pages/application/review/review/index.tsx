/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-08-12 09:32:53 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-08-12 11:18:59
 * 
 * @todo 审核页面 
 */
import React, { useEffect, useState } from 'react';
import { notification, Row, Form, Input, Button, Spin } from 'antd';
import { useHistory } from 'react-router-dom';
import { formatSearch } from '@/common/request-util';
import { appInfoDetail, appAuditApk } from '../../constants/api';
import { RESPONSE_CODE } from '../../../../common/config';
import { IAppInfoDetail } from '../../types';
import TextArea from 'antd/lib/input/TextArea';

const { Item } = Form;

const formLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 14,
  },
}

const buttonLayout = {
  wrapperCol: {
    offset: 4,
    span: 16,
  }
}

function Page() {
  const history = useHistory();
  const { search } = history.location;
  const field = formatSearch(search);
  const [detailArr, setDetailArr] = useState([] as any[]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  /**
   * @todo 根据url的id获取应用详情
   */
  useEffect(() => {
    if (field.id) {
      appInfoDetail(field.id, getDetailCallback);
    }
  }, [history.location.search]);

  /**
   * @todo 从应用详情接口拿到数据的回调
   * @param result 
   */
  const getDetailCallback = (result: any) => {
    if (result && result.code === RESPONSE_CODE.success) {
      let detail: IAppInfoDetail = result.data;
      let arr: any[] = [];
      let permissions: string[] = [];
      let permissionsStr: string = '';
      let images: string[] = [];
      if (typeof detail.permissions && detail.permissions.length > 0) {
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
      arr.push({ label: "应用名称", name: 'apkName', value: detail.apkName });
      arr.push({ label: "应用包名", name: 'apkCode', value: detail.apkCode });
      arr.push({ label: "应用图标", name: 'iconPath', value: detail.iconPath, render: (path: string) => renderIcon(path) });
      arr.push({ label: "应用版本", name: 'versionName', value: detail.versionName });
      arr.push({ label: "内部版本", name: 'versionCode', value: detail.versionCode });
      arr.push({ label: "所属机构", name: 'deptName', value: detail.deptName || '--' });
      arr.push({ label: "所属组别", name: 'groupName', value: detail.groupName || '--' });
      arr.push({ label: "应用分类", name: 'typeName', value: detail.typeName || '--' });
      arr.push({ label: "终端厂商", name: 'firmName', value: detail.firmName || '--' });
      arr.push({ label: "终端型号", name: 'terminalTypes', value: detail.terminalTypes || '--' });
      arr.push({ label: "权限", name: 'permissions', value: permissionsStr, render: (columns: string[]) => renderColumns(columns) });
      arr.push({ label: "关键词", name: 'keyWord', value: detail.keyWord });
      arr.push({ label: "应用简介", name: 'apkDescription', value: detail.apkDescription });
      arr.push({ label: "版本更新说明", name: 'versionDescription', value: detail.versionDescription });
      arr.push({ label: "应用截图", name: 'picPaths', value: images, render: (paths: string[]) => renderImages(paths) });
      arr.push({ label: "历史审核意见", name: 'reviewMsg', value: detail.reviewMsg });
      arr.push({ label: "请填写审核意见", name: 'currentReviewMsg', value: detail.reviewMsg, renderItem: renderReviewMsgItem });

      form.setFieldsValue({
        apkName: detail.apkName,
        apkCode: detail.apkCode,
        iconPath: detail.apkCode,
        versionName: detail.versionName,
        versionCode: detail.versionCode,
        deptName: detail.deptName,
        groupName: detail.groupName,
        typeName: detail.typeName,
        firmName: detail.firmName,
        terminalTypes: detail.terminalTypes,
        permissions: permissionsStr,
        keyWord: detail.keyWord,
        apkDescription: detail.apkDescription,
        versionDescription: detail.versionDescription,
        picPaths: detail.picPaths,
        reviewMsg: detail.reviewMsg,
      })
      setDetailArr(arr);
    } else {
      notification.warn(result.msg || '获取详情失败，请刷新页面重试');
    }
  }

  /**
   * @todo 渲染应用图标
   * @param imagePath 
   */
  const renderIcon = (imagePath: string) => {
    return (
      <img src={imagePath} style={{ width: '50px', height: '50px' }} />
    )
  }

  /**
   * @todo 渲染应用截图
   * @param imagePaths 
   */
  const renderImages = (imagePaths: string[]) => {
    return (
      <Row>
        {
          imagePaths.length > 0 && imagePaths.map(item => {
            return (
              <img src={item} style={{ width: '80px', height: '80px', marginRight: '20px', marginBottom: '10px', marginTop: '10px' }} />
            )
          })
        }
      </Row>
    )
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
   * @todo 填写审核意见的表单
   * @param item 
   */
  const renderReviewMsgItem = (item: any) => {
    return (
      <Item label={item.label} name={item.name} rules={[{
        required: true,
        message: '请填写审核意见'
      }]}
      >
        <TextArea />
      </Item>
    )
  }

  /**
   * @todo 执行审核操作
   * @param isPass 
   */
  const onReview = async (isPass: boolean) => {
    try {
      const values = await form.validateFields();
      console.log('Success:', values);
      const params = {
        id: field.id,
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
      notification.error({ message: errorInfo || '审核失败，请重试' });
      console.log('Failed:', errorInfo);
    }
  }

  return (
    <Spin spinning={loading}>
      <div style={{ paddingLeft: '30px', paddingTop: '10px', width: '60vw' }}>
        <Form
          form={form}
          name="advanced_search"
          className="ant-advanced-search-form"
          {...formLayout}
          style={{ backgroundColor: 'white' }}
        >
          {
            detailArr.length > 0 && detailArr.map((item: any) => {
              if (item.renderItem) {
                return item.renderItem(item);
              } else {
                return (
                  <Item label={item.label} name={item.name}  >
                    {
                      item.render ? item.render(item.value) : (
                        <Input disabled />
                      )
                    }
                  </Item>
                )
              }
            })
          }
          <Item {...buttonLayout} >
            <Button type="primary" onClick={() => onReview(true)}>
              通过
            </Button>
            <Button type="primary" onClick={() => onReview(false)} style={{ marginLeft: 20 }}>
              不通过
          </Button>
          </Item>
        </Form>
      </div>
    </Spin>
  )
}

export default Page;
