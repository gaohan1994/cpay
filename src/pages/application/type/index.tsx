/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-08-10 14:45:02 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-08-12 11:30:01
 * 
 * @todo 应用类型页面
 */
import React, { useState } from 'react';
import { Form, Table, Row, Popconfirm, Modal, notification, Divider, Input, Upload, Col, Spin } from 'antd';
import { useAntdTable } from 'ahooks';
import { getAppTypeList, appTypeRemove, appTypeAdd, appTypeEdit } from '../constants/api';
import { formatListResult } from '@/common/request-util';
import { useStore } from '@/pages/common/costom-hooks';
import Forms from '@/component/form';
import { FormItem, FormItmeType } from '@/component/form/type';
import { createTableColumns } from '@/component/table';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import { RESPONSE_CODE, BASIC_CONFIG } from '@/common/config';
import { IAppType } from '../types';


const { Item } = Form;

type Props = {};

function Page(props: Props) {
  // 请求dept数据
  useStore(['app_status']);

  // table的form
  const [form] = Form.useForm();
  // 新增编辑弹窗的form
  const [modalForm] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  // 弹窗确定的loading
  const [confirmLoading, setConfirmLoading] = useState(false);
  // 上传图片的loading
  const [uploadLoading, setUploadLoading] = useState(false);
  // 上传图片的地址（无前缀）
  const [imageUrl, setImageUrl] = useState('');
  // 当前修改的类型item（若是新增为空，一次判断是新增还是编辑）
  const [editItem, setEditItem] = useState({} as IAppType);
  const [loading, setLoading] = useState(false);

  const { tableProps, search }: any = useAntdTable(
    (paginatedParams: any, tableProps: any) =>
      getAppTypeList({ pageSize: paginatedParams.pageSize, pageNum: paginatedParams.current, ...tableProps }),
    {
      form,
      formatResult: formatListResult,
    }
  );
  const { submit, reset } = search;

  /**
   *  @todo 新增按钮调用
   */
  const onAdd = () => {
    showModal();
  }

  /**
   * @todo 删除应用类型
   * @param item 要删除的item
   */
  const onRemove = async (item: any) => {
    const param = {
      ids: item.id
    }
    const res = await appTypeRemove(param);
    if (res && res.code === RESPONSE_CODE.success) {
      notification.success({ message: '删除成功' });
      submit();
    } else {
      notification.error({ message: res.msg || '删除失败，请重试' });
    }
  }

  /**
   * @todo 创建table的列
   */
  const columns = createTableColumns([
    {
      title: '操作',
      render: (key, item) => (
        <Row style={{ alignItems: 'center' }}>
          <a onClick={() => showModal(item)}>修改</a>
          <Divider type="vertical" />
          <Popconfirm
            title="是否确认删除？"
            onConfirm={() => onRemove(item)}
            okText="是"
            cancelText="否"
          >
            <a href="#">删除</a>
          </Popconfirm>
        </Row>
      ),
      fixed: 'left',
      width: 150,
    },
    {
      title: '类别名称',
      dataIndex: 'typeName',
    },
    {
      title: '类别编码',
      dataIndex: 'typeCode',
    },
    {
      title: '类别图标',
      dataIndex: 'iconPath',
      render: icon => {
        return (
          <img src={icon} style={{ width: 50, height: 50 }} />
        )
      }
    },
  ]);

  /**
   * @todo table的查询表单
   */
  const forms: FormItem[] = [
    {
      formName: 'typeName',
      placeholder: '类型名称',
      formType: FormItmeType.Normal,
    },
  ];

  const extraButtons = [
    { title: '新增', onClick: onAdd, type: "primary" as any, icon: <PlusOutlined /> },
  ]

  /**
   * @todo 显示新增/编辑的modal
   * @param item 要修改的类型item，不传为新增
   */
  const showModal = (item?: any) => {
    if (item) {
      setEditItem(item);
      modalForm.setFieldsValue({
        typeCode: item.typeCode,
        typeName: item.typeName,
        typeIcon: item.iconPath.replace(`${BASIC_CONFIG.SOURCE_URL}/`, ''),
      });
      setImageUrl(item.iconPath.replace(`${BASIC_CONFIG.SOURCE_URL}/`, ''));
    }
    setModalVisible(true);
  };

  /**
   * @todo 点击modal的确定按钮调用，执行相应新增/编辑的操作
   */
  const handleOk = async () => {
    const values = await modalForm.validateFields();
    setConfirmLoading(true);
    const fields = modalForm.getFieldsValue();
    let param: any = {
      typeCode: fields.typeCode,
      typeName: fields.typeName,
      iconPath: imageUrl
    }
    if (editItem.id) {
      param = {
        ...param,
        id: editItem.id
      }
      setLoading(true);
      const res = await appTypeEdit(param);
      setLoading(false);
      setConfirmLoading(false);
      if (res && res.code === RESPONSE_CODE.success) {
        notification.success({ message: "修改应用类型成功" });
        handleCancel();
        submit();
      } else {
        notification.error({ message: res && res.msg || "修改应用类型失败" });
      }
    } else {
      setLoading(true);
      const res = await appTypeAdd(param);
      setLoading(false);
      setConfirmLoading(false);
      if (res && res.code === RESPONSE_CODE.success) {
        notification.success({ message: "新增应用类型成功" });
        handleCancel();
        submit();
      } else {
        notification.error({ message: res.msg || "新增应用类型失败" });
      }
    }
  };

  /**
   * @todo 关闭弹窗的时候调用，清空当前修改项、清空modal里的表单、关闭弹窗
   */
  const handleCancel = () => {
    setModalVisible(false);
    setEditItem({} as IAppType);
    modalForm.resetFields();
    setImageUrl('');
  };

  /**
   * @todo 判断图片的长宽是否符合要求
   * @param file 图片文件
   * @param width 限制宽度
   * @param height 限制高度
   * @param msg 超过限制要展示的文字
   */
  const isSize = (file: any, width: number, height: number, msg: string) => {
    return new Promise((resolve, reject) => {
      let _URL = window.URL || window.webkitURL;
      let img = new Image();
      img.onload = function () {
        let valid = img.width <= width && img.height <= height;
        valid ? resolve() : reject();
      };
      img.src = _URL.createObjectURL(file);
    }).then(
      () => {
        return file;
      },
      () => {
        notification.error({ message: msg });
        return Promise.reject();
      }
    );
  };

  /**
   * @todo 上传应用图标前调用
   * @param file 文件
   */
  const beforeUpload = (file: any) => {
    // 判断是否是图片
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      notification.error({ message: '只能上传jpg或png文件' });
    }
    // 判断是否小于等于5M
    const isLt5M = file.size / 1024 / 1024 <= 5;
    if (!isLt5M) {
      notification.error({ message: '超过限制5M' });
    }
    // 判断图片长宽是否不大于128px*128px
    const isLtSize = isSize(file, 128, 128, '图片尺寸大于128px*128px，请重新选择图片');
    return isJpgOrPng && isLt5M && isLtSize;
  }

  /**
   * @todo 监听图片上传
   * @param info 上传图片文件时的信息
   */
  const handleChange = (info: any) => {
    if (info.file.status === 'uploading') {
      setUploadLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      if (info.file.response && info.file.response.code === RESPONSE_CODE.success) {
        setImageUrl(info.file.response.data);
      } else {
        notification.error({ message: info.file.response.msg || '上传图标失败' });
      }
      setUploadLoading(false);
    }
  };

  const uploadButton = (
    <div>
      {uploadLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div className="ant-upload-text">上传</div>
    </div>
  );

  return (
    <Spin spinning={loading}>
      <Forms
        form={form}
        forms={forms}
        formButtonProps={{
          submit,
          reset,
          extraButtons
        }}
      />
      <Table rowKey="id" columns={columns}  {...tableProps} />
      <Modal
        title={editItem.id ? "编辑" : "新增"}
        cancelText="取消"
        okText="确定"
        visible={modalVisible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Form
          form={modalForm}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
        >
          <Item label="类型编号" name='typeCode' rules={[
            {
              required: true,
              message: '请输入类型编号',
            }]}
          >
            <Input />
          </Item>
          <Item label="类型名称" name='typeName' rules={[
            {
              required: true,
              message: '请输入类型名称',
            }]}
          >
            <Input />
          </Item>
          <Item label="应用图标" name='typeIcon' rules={[
            {
              required: true,
              message: '请上传应用图标',
            }]}
          >
            <Col>
              <Upload
                action={`${BASIC_CONFIG.BASE_URL}/cpay-admin/file/upload/tmp`}
                listType="picture-card"
                withCredentials={true}
                showUploadList={false}
                beforeUpload={beforeUpload}
                onChange={handleChange}
              >
                {
                  imageUrl ?
                    <img src={`${BASIC_CONFIG.SOURCE_URL}/${imageUrl}`} alt="avatar" style={{ width: '100%' }} /> :
                    uploadButton
                }
              </Upload>
              <div>(不超过5M,尺寸不超过128px × 128px)</div>
            </Col>
          </Item>
        </Form>
      </Modal>
    </Spin>
  );
}
export default Page;
