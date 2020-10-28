/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-08-12 15:51:52 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-09-14 11:02:04
 * 
 * @todo 软件信息详情页
 */
import React, { useState, useEffect, useRef } from 'react';
import { Card, Descriptions, Table, Form, Divider, notification, Spin, Modal, Input } from 'antd';
import { ISoftInfo, ISoftVersionInfo } from '../../types/index';
import Forms from '@/component/form';
import { useAntdTable } from 'ahooks';
import { taskSoftVersionList, softVersionRemove, taskSoftDetail, softVersionEdit } from '../../constants/api';
import { formatListResult, formatSearch, useQueryParam } from '@/common/request-util';
import { createTableColumns, getStandardPagination } from '@/component/table';
import { FormItem, FormItmeType } from '@/component/form/type';
import { ITerminalFirmItem, ITerminalType } from '@/pages/terminal/types';
import {
  terminalFirmList as getTerminalFirmList, terminalTypeListByFirm,
} from '@/pages/terminal/constants';
import { useStore } from '@/pages/common/costom-hooks';
import numeral from 'numeral';
import { useHistory } from 'react-router-dom';
import { RESPONSE_CODE } from '@/common/config';
import { getDictText } from '@/pages/common/util';
import { getCustomSelectFromItemData, CustomFormItems } from '@/component/custom-form';
import { CustomCheckGroup } from '@/component/checkbox-group';
import invariant from 'invariant';

const { TextArea } = Input;

const styles = {
  descItem: {
    paddingBottom: 0
  }
}

const editFormLayout: any = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 16,
  },
}

const initState = {
  terminalFirmList: [] as ITerminalFirmItem[],  // 终端厂商列表
  terminalFirmValue: '',                        // 终端厂商选中的值
  softInfo: {} as ISoftInfo,                    // 软件信息详情
  editItem: {} as ISoftVersionInfo,             // 当前修改项
  terminalTypeList: [] as ITerminalType[],      // 终端类型列表（与终端厂商有关）
}

function Page() {
  const history = useHistory();
  const id = useQueryParam('id');
  const res = useStore(['driver_type', 'unionpay_connection', 'dcc_sup_flag']);
  const typesRef: any = useRef();

  const [terminalFirmList, setTerminalFirmList] = useState(
    initState.terminalFirmList
  );
  const [terminalFirmValue, setTerminalFirmValue] = useState(
    initState.terminalFirmValue
  );
  const [softInfo, setSoftInfo] = useState(initState.softInfo);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [editItem, setEditItem] = useState(initState.editItem);
  const [terminalTypeList, setTerminalTypeList] = useState(
    initState.terminalTypeList
  );

  const [form] = Form.useForm();
  const [editFrom] = Form.useForm();

  const { tableProps, search }: any = useAntdTable(
    (paginatedParams: any, tableProps: any) =>
      taskSoftVersionList({ appId: id, pageSize: paginatedParams.pageSize, pageNum: paginatedParams.current, ...tableProps }),
    {
      form,
      formatResult: formatListResult,
    }
  );
  const { submit, reset } = search;

  /**
   * @todo 获取完相应字典数据，设置详情值
   */
  useEffect(() => {
    setLoading(true);
    if (!res.loading) {
      if (id) {
        taskSoftDetail(id, getDetailCallback);
      } else {
        setLoading(false);
      }
    }
  }, [id, res.loading]);

  useEffect(() => {
    /** 获取终端厂商列表 */
    getTerminalFirmList({}, (firmList: any[]) => {
      setTerminalFirmList(firmList);
    });
  }, []);

  /**
  * @todo 监听终端厂商列表和终端厂商选中值的变化，当终端厂商选中值不在终端厂商列表中，需要清空终端厂商选中值
  */
  useEffect(() => {
    if (terminalFirmValue.length > 0 && terminalFirmList.length > 0) {
      let flag = false;
      for (let i = 0; i < terminalFirmList.length; i++) {
        console.log(terminalFirmList[i].id === numeral(terminalFirmValue).value());
        if (terminalFirmList[i].id === numeral(terminalFirmValue).value()) {
          flag = true;
          break;
        }
      }
      if (!flag) {
        setTerminalFirmValue('');
        form.setFieldsValue({ firmId: undefined });
      }
    }
  }, [terminalFirmList, terminalFirmValue]);

  /**
   * @todo 监听终端厂商的值，获取终端类型列表
   */
  useEffect(() => {
    if (terminalFirmValue.length > 0) {
      terminalTypeListByFirm({ firmId: terminalFirmValue }, setTerminalTypeList);
    }
  }, [terminalFirmValue]);

  /**
   * @todo 获取详情回调
   * @param result 
   */
  const getDetailCallback = (result: any) => {
    setLoading(false);
    if (result && result.code === RESPONSE_CODE.success) {
      setSoftInfo(result.data || {});
    } else {
      notification.warn(result.msg || '获取详情失败，请刷新页面重试');
    }
  }

  /**
   * @todo 获取厂商id对应的厂商名称
   * @param id 
   */
  const getFirmName = (id: number) => {
    for (let i = 0; i < terminalFirmList.length; i++) {
      if (id === terminalFirmList[i].id) {
        return terminalFirmList[i].firmName;
      }
    }
    return null;
  }

  /**
   * @todo 点击修改，展现修改modal
   * @param item 
   */
  const onEdit = (item: any) => {
    showModal(item);
  }

  /**
   * @todo 下载apk
   * @param item 
   */
  const onDownload = (item: any) => {
    Modal.confirm({
      title: '提示',
      content: `是否确认下载吗?`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        if (typeof item.appPath === 'string' && item.appPath.length > 0) {
          window.location.href = item.appPath;
        } else {
          notification.warn({ message: '找不到下载路径' });
        }
      },
    });
  }

  /**
   * @todo 删除软件版本信息
   * @param item 
   */
  const onRemove = async (item: any) => {
    Modal.confirm({
      title: '提示',
      content: `确认要删除当前软件版本吗?`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          const param = {
            ids: item.id
          }
          setLoading(true);
          const res = await softVersionRemove(param);
          setLoading(false);
          invariant(res && res.code === RESPONSE_CODE.success, res && res.msg || '删除软件版本失败，请重试');
          notification.success({ message: '删除软件版本成功!' });
          submit();
        } catch (error) {
          notification.warn({ message: error.message });
        }
      },
    });
  }

  /**
   * @todo 创建table的列
   */
  const columns = createTableColumns([
    {
      title: '操作',
      render: (key, item) => (
        <div>
          <a onClick={() => onDownload(item)}>下载</a>
          {
            history.location.pathname === '/upload/manage-edit' && (
              <>
                <Divider type="vertical" />
                <a onClick={() => onEdit(item)}>修改</a>
                <Divider type="vertical" />
                <a onClick={() => onRemove(item)}>删除</a>
              </>
            )
          }
        </div>
      ),
      fixed: 'left',
      width: history.location.pathname === '/upload/manage-edit' ? 150 : 60,
    },
    {
      title: '内部版本',
      dataIndex: 'versionCode',
    },
    {
      title: '应用版本',
      dataIndex: 'versionName',
    },
    {
      title: '终端厂商',
      dataIndex: 'firmId',
      render: (firmId) => {
        return (
          <span>{getFirmName(firmId) || '--'}</span>
        )
      }
    },
    {
      title: '终端型号',
      dataIndex: 'terminalTypes'
    },
    {
      title: '版本更新说明',
      dataIndex: 'remark',
    },
    {
      title: '上传文件名称',
      dataIndex: 'uploadFileName',
      width: 100
    },
  ]);

  /**
   * @todo table查询表单
   */
  const forms: FormItem[] = [
    {
      formName: 'versionCode',
      placeholder: '内部版本',
      formType: FormItmeType.Normal,
    },
    {
      formName: 'versionName',
      placeholder: '应用版本',
      formType: FormItmeType.Normal,
    },
    {
      placeholder: '终端厂商',
      formName: 'firmId',
      formType: FormItmeType.Select,
      selectData:
        (terminalFirmList &&
          terminalFirmList.map((item) => {
            return {
              value: `${item.id}`,
              title: `${item.firmName}`,
            };
          })) ||
        [],
      value: terminalFirmValue,
      onChange: (id: string) => {
        setTerminalFirmValue(`${id}`);
      },
    },
  ];

  /**
   * @todo 展示版本信息编辑弹窗
   * @param item 
   */
  const showModal = (item: ISoftVersionInfo) => {
    setEditItem(item);
    editFrom.setFieldsValue({
      ...item
    });
    setTerminalFirmValue(`${item.firmId}`);
    setTimeout(() => {
      if (item.terminalTypes) {
        let arr: string[] = item.terminalTypes.split(',');
        if (typesRef && typesRef.current && typesRef.current.setCheckedList) {
          typesRef.current.setCheckedList(arr);
        }
      }
    }, 0);
    setModalVisible(true);
  }

  /**
  * @todo 点击modal的确定按钮调用，执行相应新增/编辑的操作
  */
  const handleOk = async () => {
    const values = await editFrom.validateFields();
    setConfirmLoading(true);
    setConfirmLoading(true);
    const fields = editFrom.getFieldsValue();
    const param = {
      id: editItem.id,
      ...fields,
    }
    const res = await softVersionEdit(param);
    setConfirmLoading(false);
    if (res && res.code === RESPONSE_CODE.success) {
      notification.success({ message: "修改版本信息成功" });
      handleCancel();
      submit();
    } else {
      notification.error({ message: res && res.msg || "修改版本类型失败" });
    }
  };

  /**
   * @todo 关闭弹窗的时候调用，清空当前修改项、清空modal里的表单、关闭弹窗
   */
  const handleCancel = () => {
    setModalVisible(false);
    setEditItem({} as ISoftVersionInfo);
    editFrom.resetFields();
  };

  /**
   * @todo 修改表单数据
   */
  const editForms = [
    {
      label: '应用版本',
      key: 'versionName',
      requiredText: '应用版本不能为空',
      render: () => <Input disabled />,
    },
    {
      label: '内部版本',
      key: 'versionCode',
      requiredText: '内部版本不能为空',
      render: () => <Input disabled />,
    },
    {
      ...getCustomSelectFromItemData({
        label: '终端厂商',
        key: 'firmId',
        value: terminalFirmValue,
        onChange: (value: any) => {
          setTerminalFirmValue(value);
          if (typesRef && typesRef.current && typesRef.current.setCheckedList) {
            typesRef.current.setCheckedList([]);
          }
        },
        list: terminalFirmList,
        valueKey: 'id',
        nameKey: 'firmName',
        required: true
      })
    },
    {
      label: '终端型号',
      key: 'terminalTypes',
      requiredType: 'select',
      render: () =>
        <CustomCheckGroup
          list={terminalTypeList}
          valueKey={'typeCode'} nameKey={'typeName'}
          ref={typesRef}
          setForm={(checkedList: any[]) => {
            editFrom.setFieldsValue({ 'terminalTypes': checkedList });
          }}
        />,
    },
    {
      label: '版本更新说明',
      key: 'remark',
      requiredType: 'input' as any,
      render: () => <TextArea />
    },
  ]

  return (
    <Spin spinning={loading}>
      <Card title="软件信息">
        <Descriptions column={1}>
          <Descriptions.Item label="软件名称" style={styles.descItem}><div style={{padding: 12}}>{softInfo.appName}</div></Descriptions.Item>
          <Descriptions.Item label="软件包名" style={styles.descItem}><div style={{padding: 12}}>{softInfo.code}</div></Descriptions.Item>
          <Descriptions.Item label="软件类型" style={styles.descItem}><div style={{padding: 12}}>{getDictText(`${softInfo.type}`, 'driver_type')}</div></Descriptions.Item>
          <Descriptions.Item label="是否支持DCC" style={styles.descItem}><div style={{padding: 12}}>{getDictText(`${softInfo.dccSupFlag}`, 'dcc_sup_flag')}</div></Descriptions.Item>
          <Descriptions.Item label="银联间直联" style={styles.descItem}><div style={{padding: 12}}>{getDictText(`${softInfo.cupConnMode}`, 'unionpay_connection')}</div></Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="版本信息管理" style={{ marginTop: 20 }}>
        <Forms
          form={form}
          forms={forms}
          formButtonProps={{
            submit,
            reset,
          }}
        />
        <Table
          rowKey="id"
          columns={columns}
          {...tableProps}
          pagination={getStandardPagination(tableProps.pagination)}
        />
      </Card>
      <Modal
        title={"版本信息编辑"}
        cancelText="取消"
        okText="确定"
        visible={modalVisible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Form
          form={editFrom}
        >
          <CustomFormItems items={editForms} singleCol={true} customFormLayout={editFormLayout} />
        </Form>
      </Modal>
    </Spin>
  )
}

export default Page;