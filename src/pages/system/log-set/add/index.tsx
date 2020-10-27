import React from 'react';
import { Modal, notification } from 'antd';
import Form from 'antd/lib/form/Form';
import { FormInstance } from 'antd/lib/form';
import { CustomFormItems } from '@/component/custom-form';
import invariant from 'invariant';
import { taskLogSetAdd, taskLogSetEdit } from '../constants/api';
import { RESPONSE_CODE } from '@/common/config';
import { CustomFromItem } from '@/common/type';

const fieldLabels = {
  appCode: '应用包名',
  appName: '应用名称',
  logUrl: '日志路径',
}

const customFormLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 14
  }
}

type Props = {
  modalVisible: boolean;
  setModalVisible: any;
  form: FormInstance;
  setLoading: any;
  submit: any;
  editId: number | undefined;
  setEditId: (id:number | undefined) => void;
}

export default function AddModal(props: Props) {
  const { modalVisible, setModalVisible, form, setLoading, submit, editId, setEditId } = props;

  /**
   * @todo 隐藏弹窗
   */
  const hideModal = () => {
    setModalVisible(false);
    form.resetFields();
    setEditId(undefined)
  }

  /**
   * @todo 弹窗点击确定新增菜单
   */
  const handleOk = async () => {
    try {
      const fields = await form.validateFields();
      let param: any = {
        ...fields,
      }      
      setLoading(true);
      if (editId) {
        param.id = editId
        const result = await taskLogSetEdit(param);
        setLoading(false);
        invariant(result.code === RESPONSE_CODE.success, result.msg || '修改失败！');
        notification.success({ message: '修改成功！' });
      } else {
        const result = await taskLogSetAdd(param);
        setLoading(false);
        invariant(result.code === RESPONSE_CODE.success, result.msg || '新增失败！');
        notification.success({ message: '新增成功！' });
      }
      submit();
      hideModal();
    } catch (errorInfo) {
      if (errorInfo.message) {
        notification.error({ message: errorInfo.message });
      }
    }
  }


  const addForms: CustomFromItem[] = [
    {
      label: fieldLabels.appCode,
      key: 'appCode',
      requiredType: 'input' as any
    },
    {
      label: fieldLabels.appName,
      key: 'appName',
      requiredType: 'input',
    },
    {
      label: fieldLabels.logUrl,
      key: 'logUrl',
      requiredType: 'input',
    }
  ];

  return (
    <Modal
      visible={modalVisible}
      title={editId ? "修改" : "新增"}
      onCancel={hideModal}
      onOk={handleOk}
    >
      <Form
        form={form}
        className="ant-advanced-search-form"
        style={{ backgroundColor: 'white' }}
      >
        <CustomFormItems items={addForms} singleCol={true} customFormLayout={customFormLayout} />
      </Form>
    </Modal>
  )
}