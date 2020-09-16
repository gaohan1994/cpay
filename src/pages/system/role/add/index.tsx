/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-09-14 13:54:26 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-09-14 18:01:31
 * 
 * @todo 角色管理新增
 */
import React, { useState, useEffect } from 'react';
import { Spin, Form, Button, notification, Switch, Tree } from 'antd';
import { useStore } from '@/pages/common/costom-hooks';
import { CustomFormItems, getCustomSelectFromItemData } from '@/component/custom-form';
import { useForm } from 'antd/lib/form/Form';
import { useFormSelectData } from './costom-hooks';
import { CustomFromItem } from '@/common/type';
import { useQueryParam } from '@/common/request-util';
import { useHistory } from 'react-router-dom';
import { useDetail } from '@/pages/common/costom-hooks/use-detail';
import { merge } from 'lodash';
import FixedFoot, { ErrorField } from '@/component/fixed-foot';
import { systemRoleEdits, systemRoleEdit, systemRoleAdd } from '../constants/api';
import TextArea from 'antd/lib/input/TextArea';
import { RESPONSE_CODE } from '@/common/config';
import { systemMenuList } from '../../menu/constants/api';
import { useRedux } from '@/common/redux-util';
import { useSelectorHook } from '../../../../common/redux-util';
import numeral from 'numeral';

const fieldLabels = {
  roleName: '角色名称',
  roleKey: '权限字符',
  roleSort: '显示顺序',
  status: '角色状态',
  remark: '备注',
  menuIds: '菜单权限',
}

export default function Page() {
  const id = useQueryParam('id');
  const [form] = useForm();
  const [useSelector, dispatch] = useRedux();
  const system = useSelectorHook(state => state.system);
  const history = useHistory();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorField[]>([]);
  const [checkedKeys, setCheckedKeys] = useState([] as any[]);
  const [checkedIds, setCheckedIds] = useState([] as any[]);
  const [menuLoading, setMenuLoading] = useState(false);
  const [status, setStatus] = useState(true);

  const {
    roleList,
  } = useFormSelectData({}, form);

  /**
   * @todo 获取详情数据
   */
  const { detail } = useDetail(id, systemRoleEdits, setLoading);

  const initialValues = merge({}, (detail && detail) || {});

  useEffect(() => {
    systemMenuList(dispatch, setMenuLoading);
  }, []);

  useEffect(() => {
    if (initialValues.sysRole) {
      form.setFieldsValue({ ...initialValues.sysRole, status: initialValues.sysRole.status === '0' });
      setStatus(initialValues.sysRole.status === '0');
    }
    if (Array.isArray(initialValues.tree) && initialValues.tree.length > 0) {
      let ids: number[] = [];
      initialValues.tree.forEach((element: any) => {
        if (element.checked) {
          ids.push(element.id);
        }
      });
      setCheckedIds(ids);
    }
  }, [detail]);

  useEffect(() => {
    if (system.menuTreeData.length > 0) {
      let keys: string[] = [];
      system.menuTreeData.forEach(element => {
        getChildKeys(element, keys);
      });
      setCheckedKeys(keys);
    }
  }, [system.menuTreeData, detail]);

  const getChildKeys = (item: any, keys: string[]) => {
    checkedIds.forEach(element => {
      if (numeral(element).value() === item.menuId) {
        keys.push(item.key);
      }
      if (item.children && item.children.length > 0) {
        item.children.forEach((ele: any) => {
          getChildKeys(ele, keys);
        });
      }
    });
  }

  const checkRoleName = (rule: any, value: any, callback: any) => {
    let flag = false;
    for (let i = 0; i < roleList.length; i++) {
      if (roleList[i].roleName === value && roleList[i].roleName !== (initialValues.sysRole && initialValues.sysRole.roleName)) {
        flag = true;
        break;
      }
    }
    if (!flag) {
      callback();
    } else {
      callback('角色名称已经存在');
    }
  }

  const checkRoleKey = (rule: any, value: any, callback: any) => {
    let flag = false;
    for (let i = 0; i < roleList.length; i++) {
      if (roleList[i].roleKey === value && roleList[i].roleKey !== (initialValues.sysRole && initialValues.sysRole.roleKey)) {
        flag = true;
        break;
      }
    }
    if (!flag) {
      callback();
    } else {
      callback('角色权限已经存在');
    }
  }


  const onCheck = (checkedKeys: any, info: any) => {
    console.log('onCheck', checkedKeys, info);
    setCheckedKeys(checkedKeys);
    if (info && Array.isArray(info.checkedNodes)) {
      let ids: number[] = [];
      info.checkedNodes.forEach((element: any) => {
        ids.push(element.menuId);
      });
      setCheckedIds(ids);
    }
  };

  const renderMenuTree = () => {
    return (
      <Tree
        checkable
        onCheck={onCheck}
        treeData={system.menuTreeData}
        checkedKeys={checkedKeys}
      />
    )
  }

  const forms: CustomFromItem[] = [
    {
      label: fieldLabels.roleName,
      key: 'roleName',
      rules: [
        { validator: checkRoleName },
        {
          required: true,
          message: '请输入角色名称',
        },
      ]
    },
    {
      label: fieldLabels.roleKey,
      key: 'roleKey',
      rules: [
        { validator: checkRoleKey },
        {
          required: true,
          message: '请输入权限字符',
        },
      ]
    },
    {
      label: fieldLabels.roleSort,
      key: 'roleSort',
      required: 'select' as any
    },
    {
      label: fieldLabels.status,
      key: 'status',
      render: () => <Switch checked={status} onChange={(checked) => setStatus(checked)} />
    },
    {
      label: fieldLabels.remark,
      key: 'remark',
      render: () => <TextArea />
    },
    {
      label: fieldLabels.menuIds,
      key: 'menuIds',
      render: renderMenuTree,
      itemSingleCol: true,
    },
  ]

  const onSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log('Success:', values);
      const fields = form.getFieldsValue();
      let param: any = {
        ...fields,
        menuIds: checkedIds.join(','),
        status: status ? 0 : 1
      }
      setLoading(true);
      if (id) {
        param = {
          ...param,
          roleId: id
        }
        const res = await systemRoleEdit(param);
        setLoading(false);
        if (res && res.code === RESPONSE_CODE.success) {
          notification.success({ message: '修改角色成功！' });
          history.goBack();
        } else {
          notification.error({ message: res.msg || '修改角色失败，请重试！' });
        }
      } else {
        const res = await systemRoleAdd(param);
        setLoading(false);
        if (res && res.code === RESPONSE_CODE.success) {
          notification.success({ message: '添加角色成功！' });
          history.goBack();
        } else {
          notification.error({ message: res.msg || '添加角色失败，请重试！' });
        }
      }
      setLoading(false);
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
      setError(errorInfo.errorFields);
    }
  }

  return (
    <Spin spinning={loading || menuLoading}>
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
        <Button type="primary" loading={loading} onClick={onSubmit} htmlType='submit'>
          提交
        </Button>
        <Button onClick={() => history.goBack()}>返回</Button>
      </FixedFoot>
    </Spin>
  )
}