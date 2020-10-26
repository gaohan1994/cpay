import React, { useState, useEffect } from 'react';
import { Modal, notification, Radio, Input, InputNumber } from 'antd';
import Form from 'antd/lib/form/Form';
import { FormInstance } from 'antd/lib/form';
import { CustomFormItems, CustomFormItemsProps } from '@/component/custom-form';
import invariant from 'invariant';
import { systemMenuAdd, systemMenuEdit } from '../constants/api';
import { RESPONSE_CODE } from '@/common/config';
import { renderCommonTreeSelectForm } from '@/component/form/render';
import { FormItmeType, FormItem } from '@/component/form/type';
import { useSelectorHook } from '@/common/redux-util';
import { useQueryParam } from '@/common/request-util';
import { CustomFromItem } from '@/common/type';

const fieldLabels = {
  parentId: '上级菜单',
  menuName: '菜单名称',
  menuType: '菜单类型',
  icon: '菜单图标',
  url: '请求地址',
  orderNum: '排序',
  perms: '权限标识',
  visible: '状态'
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
  editItem: any;
  setLoading: any;
  submit: any;
  setEditItem: (item:any) => void;
}

export default function AddModal(props: Props) {
  const { modalVisible, setModalVisible, form, editItem, setLoading, setEditItem, submit } = props;

  const menuList = useSelectorHook(state => state.system.menuTreeData);
  const dictList = useSelectorHook(state => state.common.dictList);
  
  const id = useQueryParam('id')

  const [parentId, setParentId] = useState(-1);
  const [menuType, setMenuType] = useState('')

  useEffect(() => {
    if(!modalVisible) {
      return
    }
    form.setFieldsValue({
      parentId: 0,
      visible: '0',
      menuType: 'M'
    })
    setParentId(0)
    setMenuType('M')
    if(editItem) {
      form.setFieldsValue({...editItem})
      setParentId(editItem.parentId || '0')
      setMenuType(editItem.menuType || 'M')
    }
    

  }, [modalVisible]);

  /**
   * @todo 隐藏弹窗
   */
  const hideModal = () => {
    setModalVisible(false);
    form.resetFields();
    setEditItem({})
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
      if (editItem.menuId) {
        param = {
          ...param,
          menuId: editItem.menuId,
        }
        const result = await systemMenuEdit(param);
        setLoading(false);
        invariant(result.code === RESPONSE_CODE.success, result.msg || '菜单修改失败！');
        notification.success({ message: '菜单修改成功！' });
      } else {
        const result = await systemMenuAdd(param);
        setLoading(false);
        invariant(result.code === RESPONSE_CODE.success, result.msg || '菜单新增失败！');
        notification.success({ message: '菜单新增成功！' });
      }
      submit();
      hideModal();
    } catch (errorInfo) {
      if (errorInfo.message) {
        notification.error({ message: errorInfo.message });
      }
    }
  }

  const changeMenuType = (value: string) => {
    setMenuType(value)
  }

  const addForms: CustomFromItem[] = [
    {
      label: fieldLabels.parentId,
      key: 'parentId',
      requiredType: 'select' as any,
      render: () => renderCommonTreeSelectForm({
        formName: 'menuId',
        formType: FormItmeType.TreeSelect,
        treeSelectData: [{ menuId: 0, menuName: '无' }, ...menuList],
        nodeKey: 'menuId',
        nodeTitle: 'menuName',
        span: 24,
        onChange: (id: number) => setParentId(id),
        placeholder: '请选择菜单'
      }, false)
    },
    {
      label: fieldLabels.menuName,
      key: 'menuName',
      requiredType: 'input',
    },
    {
      label: fieldLabels.menuType,
      key: 'menuType',
      requiredType: 'select',
      render: () => <Radio.Group onChange = {(e) => {changeMenuType(e.target.value)}}>
        {
          dictList && dictList.menu_type && dictList.menu_type.data.map(item => {
            return (
              <Radio key={item.dictValue} value={item.dictValue}>{item.dictLabel}</Radio>
            )
          })
        }
      </Radio.Group>
    },
    {
      show: form.getFieldValue('menuType') === 'M',
      label: fieldLabels.icon,
      key: 'icon',
      requiredType: 'input'
    },
    {
      show: form.getFieldValue('menuType') !== 'F',
      label: fieldLabels.url,
      key: 'url',
      requiredType: 'input' as any,
    },
    {
      label: fieldLabels.orderNum,
      key: 'orderNum',
      requiredType: 'input',
      render: () => <InputNumber />
    },
    {
      label: fieldLabels.perms,
      key: 'perms',
      requiredType: 'input',
    },
    {
      label: fieldLabels.visible,
      key: 'visible',
      requiredType: 'select',
      render: () => (<Radio.Group >
        {
          dictList && dictList.sys_show_hide && dictList.sys_show_hide.data.map(item => {
            return (
              <Radio key={item.dictValue} value={item.dictValue}>{item.dictLabel}</Radio>
            )
          })
        }
      </Radio.Group>)
    },
  ];

  return (
    <Modal
      visible={modalVisible}
      title={editItem.menuId ? "修改菜单" : "新增菜单"}
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