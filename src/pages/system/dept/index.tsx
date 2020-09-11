import React, { useState, useEffect, useCallback } from 'react';
import { Spin, Row, Col, Button, Tree, Form, notification, Modal } from 'antd';
import { useSelectorHook, useRedux } from '@/common/redux-util';
import { useStore } from '@/pages/common/costom-hooks';
import './index.less';
import { CustomFormItems } from '@/component/custom-form';
import { useForm } from 'antd/lib/form/Form';
import { renderCommonTreeSelectForm } from '@/component/form/render';
import { FormItmeType } from '@/component/form/type';
import { systemDeptEdits, systemDeptEdit, systemDeptaAdd } from './constants/api';
import invariant from 'invariant';
import { RESPONSE_CODE } from '@/common/config';
import { getDeptTreeData, GetDeptTreeDataCallback } from '@/pages/common/constants';
import { ACTION_TYPES_COMMON } from '@/pages/common/reducer';
import { PlusOutlined } from '@ant-design/icons';

const fieldLabels = {
  code: '机构编号',
  deptName: '机构名称',
  parentId: '上级机构',
  radius: '偏移半径'
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

export default function Page() {
  const fetchStoreRes = useStore([]);
  const [loading, setLoading] = useState(false);
  const [useSelector, dispatch] = useRedux();
  const common = useSelectorHook((state) => state.common);
  const [editForm] = useForm();
  const [addForm] = useForm();
  const [selectedKeys, setSelectedKeys] = useState([] as any);
  const [selectedItem, setSelectedItem] = useState({} as any);
  const [modalVisible, setModalVisible] = useState(false);

  /**
   * @todo 获取store数据的时候，设置相应的加载组件状态
   */
  useEffect(() => {
    setLoading(fetchStoreRes.loading);
  }, [fetchStoreRes.loading]);

  /**
   * @todo 机构树数据改变时，设置树组件选中第一项
   */
  useEffect(() => {
    if (Array.isArray(common.deptTreeData) && common.deptTreeData.length > 0) {
      setSelectedKeys([common.deptTreeData[0].key]);
      const seletedRow = common.deptTreeData[0];
      if (typeof seletedRow.id === 'number') {
        setSelectedItemInfo(seletedRow.id);
      }
    }
  }, [common.deptTreeData]);

  /**
   * @todo 改变选中机构信息时，设置相应的修改表单数据，判断该机构上级机构id是否为0，
   * 若是，则相应的上级机构不能更改
   */
  useEffect(() => {
    editForm.setFieldsValue(selectedItem);
    if (selectedItem && selectedItem.parentId === 0) {
      editForm.setFieldsValue({
        parentId: '不可修改'
      });
    }
  }, [selectedItem]);

  /**
   * @todo 设置选中项信息，用以显示修改信息表单
   * @param id 
   */
  const setSelectedItemInfo = async (id: number) => {
    try {
      if (typeof id === 'number') {
        setLoading(true);
        const result = await systemDeptEdits(id);
        setLoading(false);
        invariant(result.code === RESPONSE_CODE.success, result.msg || '获取机构数据失败！');
        setSelectedItem(result.data);
      }
    } catch (error) {
      notification.warn({ message: error.message });
    }
  }

  const editForms = [
    {
      label: fieldLabels.code,
      key: 'code',
      requiredType: 'input' as any,
    },
    {
      label: fieldLabels.deptName,
      key: 'deptName',
      requiredType: 'input' as any,
    },
    {
      label: fieldLabels.parentId,
      key: 'parentId',
      requiredType: 'select' as any,
      render: () => renderCommonTreeSelectForm({
        formName: 'deptId',
        formType: FormItmeType.TreeSelectCommon,
        span: 24,
        disabled: selectedItem && selectedItem.parentId === 0 ? true : false
      }, false),
    },
    {
      label: fieldLabels.radius,
      key: 'radius',
      // requiredType: 'input' as any,
    },
  ];

  const addForms = [
    {
      label: fieldLabels.code,
      key: 'code',
      requiredType: 'input' as any,
    },
    {
      label: fieldLabels.deptName,
      key: 'deptName',
      requiredType: 'input' as any,
    },
    {
      label: fieldLabels.parentId,
      key: 'parentId',
      requiredType: 'select' as any,
      render: () => renderCommonTreeSelectForm({
        formName: 'deptId',
        formType: FormItmeType.TreeSelectCommon,
        span: 24,
      }, false),
    },
  ];

  /**
   * @todo 获取到机构数数据后的回调，设置redux中的数据
   */
  const getDeptCallback = useCallback((deptData: GetDeptTreeDataCallback) => {
    const [data, treeData] = deptData;
    dispatch({
      type: ACTION_TYPES_COMMON.RECEIVE_DEPT_DATA,
      payload: data,
    });
    dispatch({
      type: ACTION_TYPES_COMMON.RECEIVE_DEPT_TREE_DATA,
      payload: treeData,
    });
  }, []);

  /**
   * @todo 机构数选中调用：获取机构相应的数据
   * @param selectedKeys 
   * @param e 
   */
  const onSelect = async (selectedKeys: any, e: any) => {
    try {
      setSelectedKeys(selectedKeys);
      const selectedNodes = e.selectedNodes;
      if (Array.isArray(selectedNodes) && selectedNodes.length > 0) {
        const seletedRow = selectedNodes[0];
        if (typeof seletedRow.id === 'number') {
          setSelectedItemInfo(seletedRow.id);
        }
      }
    } catch (error) {
      notification.warn({ message: error.message });
    }
  }

  /**
   * @todo 修改用户信息
   */
  const onSave = async () => {
    try {
      await editForm.validateFields();
      const fields = editForm.getFieldsValue();
      let param: any = {
        ...fields,
        deptId: selectedItem.deptId,
      }
      if (selectedItem.parentId === 0) {
        param.parentId = 0
      }
      setLoading(true);
      const result = await systemDeptEdit(param);
      invariant(result.code === RESPONSE_CODE.success, result.msg || '修改机构信息失败！');
      notification.success({ message: '修改机构信息成功!' });
      // 重新获取机构数的数据
      await getDeptTreeData(getDeptCallback);
      setLoading(false);
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
      if (errorInfo.message) {
        notification.error({ message: errorInfo.message });
      }
    }
  }

  /**
   * @todo 新增弹窗
   */
  const renderAddModal = () => {
    return (
      <Modal
        visible={modalVisible}
        title="新增机构"
        onCancel={hideModal}
        onOk={handleOk}
      >
        <Form
          form={addForm}
          className="ant-advanced-search-form"
          style={{ backgroundColor: 'white' }}
        >
          <CustomFormItems items={addForms} singleCol={true} customFormLayout={customFormLayout} />
        </Form>
      </Modal>
    )
  }

  /**
   * @todo 显示弹窗
   */
  const showModal = () => {
    setModalVisible(true);
    addForm.resetFields();
  }

  /**
   * @todo 隐藏弹窗
   */
  const hideModal = () => {
    setModalVisible(false);
    addForm.resetFields();
  }

  /**
   * @todo 弹窗点击确定新增机构
   */
  const handleOk = async () => {
    try {
      await addForm.validateFields();
      const fields = addForm.getFieldsValue();
      let param: any = {
        ...fields,
      }
      setLoading(true);
      const result = await systemDeptaAdd(param);
      invariant(result.code === RESPONSE_CODE.success, result.msg || '新增机构失败！');
      notification.success({ message: '新增机构成功！' });
      await getDeptTreeData(getDeptCallback);
      setLoading(false);
      hideModal();
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
      if (errorInfo.message) {
        notification.error({ message: errorInfo.message });
      }
    }
  }

  return (
    <Spin spinning={loading}>
      <Button type='primary' style={{ marginLeft: 10 }} onClick={showModal} icon={<PlusOutlined />}>新增</Button>
      <Row className='container'>
        <Col span={8}>
          <div className='deptTree'>
            {
              common.deptTreeData && common.deptTreeData.length > 0 && (
                <Tree
                  treeData={common.deptTreeData as any}
                  defaultExpandAll={true}
                  defaultExpandedKeys={['0-0']}
                  onSelect={onSelect}
                  selectedKeys={selectedKeys}
                />
              )
            }
          </div>
        </Col>
        <Col span={16}>
          <div className='form'>
            <Form
              form={editForm}
              className="ant-advanced-search-form"
              style={{ backgroundColor: 'white' }}
            >
              <CustomFormItems items={editForms} singleCol={true} customFormLayout={customFormLayout} />
            </Form>
            <Form.Item {...customButtonLayout} >
              <Button type="primary" onClick={onSave}>
                保存
            </Button>
            </Form.Item>
          </div>
        </Col>
      </Row>
      {renderAddModal()}
    </Spin>
  );
}