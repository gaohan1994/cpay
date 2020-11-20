import React, { useState, useEffect } from 'react';
import { Modal, notification, Radio } from 'antd';
import Form from 'antd/lib/form/Form';
import { FormInstance } from 'antd/lib/form';
import { CustomFormItems } from '@/component/custom-form';
import invariant from 'invariant';
import { systemDeptAdd, checkDeptNameUnique, checkDeptCodeUnique, systemDeptEdit } from '../constants/api';
import { RESPONSE_CODE } from '@/common/config';
import { renderCommonTreeSelectForm } from '@/component/form/render';
import { FormItmeType } from '@/component/form/type';
import { useSelectorHook } from '@/common/redux-util';

const fieldLabels = {
  parentId: '上级机构',
  code: '机构号',
  deptName: '机构名称',
  // orderNum: '显示排序',
  leader: '负责人',
  phone: '联系电话',
  email: '邮箱',
  // status: '机构状态',
}

const customFormLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 14
  }
}

const customButtonLayout = {
  wrapperCol: {
    offset: 6,
    span: 16,
  }
}

type Props = {
  modalVisible: boolean;
  setModalVisible: any;
  form: FormInstance;
  editItem: any;
  setLoading: any;
  submit: any;
}

export default function AddModal(props: Props) {
  const { modalVisible, setModalVisible, form, editItem, setLoading, submit } = props;

  const dictList = useSelectorHook(state => state.common.dictList);

  const [parentId, setParentId] = useState(-1);

  useEffect(() => {

  }, [modalVisible]);

  /**
   * @todo 隐藏弹窗
   */
  const hideModal = () => {
    setModalVisible(false);
    form.resetFields();
  }

  /**
   * @todo 弹窗点击确定新增机构
   */
  const handleOk = async () => {
    try {
      await form.validateFields();
      const fields = form.getFieldsValue();
      let param: any = {
        ...fields,
        // status: fields.status !== undefined ? fields.status : 0
      }
      setLoading(true);
      if (editItem.deptId) {
        param = {
          ...param,
          deptId: editItem.deptId,
        }
        const result = await systemDeptEdit(param);
        setLoading(false);
        invariant(result.code === RESPONSE_CODE.success, result.msg || '机构修改失败！');
        notification.success({ message: '机构修改成功！' });
      } else {
        const result = await systemDeptAdd(param);
        setLoading(false);
        invariant(result.code === RESPONSE_CODE.success, result.msg || '机构新增失败！');
        notification.success({ message: '机构新增成功！' });
      }
      submit();
      hideModal();
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
      if (errorInfo.message) {
        notification.error({ message: errorInfo.message });
      }
    }
  }

  /**
   * @todo 判断输入的机构名称是否符合要求
   * @param rule 
   * @param value 
   * @param callback 
   */
  const checkDeptName = (rule: any, value: any, callback: any) => {
    let flag = false;
    const param = {
      deptName: value,
      parentId
    }
    checkDeptNameUnique(param)
      .then(function (res) {
        if (res && res.code === RESPONSE_CODE.success) {
          flag = res.data === '1';
        }
        if (!flag || value === editItem.deptName) {
          callback();
        } else {
          callback('该机构名称已经存在');
        }
      }, function (error) {
        callback('机构名称校验失败')
      });
  }

  /**
  * @todo 判断输入的机构名称是否符合要求
  * @param rule 
  * @param value 
  * @param callback 
  */
  const checkDeptCode = (rule: any, value: any, callback: any) => {
    let flag = false;
    const param = {
      code: value,
    }
    checkDeptCodeUnique(param)
      .then(function (res) {
        if (res && res.code === RESPONSE_CODE.success) {
          flag = res.data === true;
        }

        if (!flag || value === editItem.code) {
          callback();
        } else {
          callback('该机构号已经存在');
        }
      }, function (error) {
        callback('机构号校验失败')
      });
  }


  const addForms = [
    {
      label: fieldLabels.parentId,
      key: 'parentId',
      requiredType: 'select' as any,
      render: () => renderCommonTreeSelectForm({
        formName: 'deptId',
        formType: FormItmeType.TreeSelectCommon,
        span: 24,
        onChange: (id: number) => setParentId(id)
      }, false),
    },
    {
      label: fieldLabels.code,
      key: 'code',
      requiredType: 'input' as any,
      rules: [
        // { validator: checkDeptCode },
        {
          required: true,
          message: '请输入机构号',
        },
      ]
    },
    {
      label: fieldLabels.deptName,
      key: 'deptName',
      requiredType: 'input' as any,
      rules: [
        // { validator: checkDeptName },
        {
          required: true,
          message: '请输入机构名称',
        },
      ]
    },
    // {
    //   label: fieldLabels.orderNum,
    //   key: 'orderNum',
    //   requiredType: 'input' as any,
    // },
    {
      label: fieldLabels.leader,
      key: 'leader',
    },
    {
      label: fieldLabels.phone,
      key: 'phone',
    },
    {
      label: fieldLabels.email,
      key: 'email',
    },
    // {
    //   label: fieldLabels.status,
    //   key: 'status',
    //   render: () => <Radio.Group defaultValue={'0'}>
    //     {
    //       dictList && dictList.sys_normal_disable && dictList.sys_normal_disable.data.map(item => {
    //         return (
    //           <Radio key={item.dictValue} value={item.dictValue}>{item.dictLabel}</Radio>
    //         )
    //       })
    //     }
    //   </Radio.Group>
    // },
  ];

  return (
    <Modal
      visible={modalVisible}
      title={editItem.deptId ? "修改机构" : "新增机构"}
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