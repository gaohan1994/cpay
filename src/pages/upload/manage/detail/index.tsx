/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-08-12 15:51:52 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-08-12 17:55:31
 * 
 * @todo 软件信息详情页
 */
import React, { useState, useEffect } from 'react';
import { useRedux, useSelectorHook } from '@/common/redux-util';
import { Card, Descriptions, Table, Form, Divider, Popconfirm, notification, Spin, Modal, Input, Col, Checkbox } from 'antd';
import { ISoftInfo, ISoftVersionInfo } from '../../types/index';
import Forms from '@/component/form';
import { useAntdTable } from 'ahooks';
import { taskSoftVersionList, softVersionRemove, taskSoftDetail, softVersionEdit } from '../../constants/api';
import { formatListResult, formatSearch } from '@/common/request-util';
import { createTableColumns } from '@/component/table';
import { FormItem, FormItmeType } from '@/component/form/type';
import { PlusOutlined } from '@ant-design/icons';
import { ITerminalFirmItem, ITerminalType } from '@/pages/terminal/types';
import {
  terminalFirmList as getTerminalFirmList, terminalTypeListByFirm,
} from '@/pages/terminal/constants';
import { useStore } from '@/pages/common/costom-hooks';
import numeral from 'numeral';
import { useHistory } from 'react-router-dom';
import { RESPONSE_CODE } from '@/common/config';
import { renderSelectForm } from '@/component/form/render';

const { Item } = Form;
const CheckboxGroup = Checkbox.Group;

function Page() {
  const initState = {
    terminalFirmList: [] as ITerminalFirmItem[],        // 终端厂商列表
    terminalFirmValue: '',                              // 终端厂商选中的值
    softInfo: {} as ISoftInfo,                          // 软件信息详情
    editItem: {} as ISoftVersionInfo,
    terminalTypeList: [] as ITerminalType[],            // 终端类型列表（与终端厂商有关）
    terminalTypeOptions: [] as string[],                // 终端类型列表选项
    indeterminate: false,                               // 复选框的全选按钮是否不定
    checkAll: false,                                    // 复选框是否全选
    checkedList: [] as string[],                        // 复选框列表
  }

  const history = useHistory();
  useStore(['driver_type']);
  const { search: historySearch } = history.location;
  const field = formatSearch(historySearch);
  const common = useSelectorHook((state) => state.common);

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
  const [terminalTypeOptions, setTerminalTypeOptions] = useState(
    initState.terminalTypeOptions
  );
  const [indeterminate, setIndeterminate] = useState(initState.indeterminate);
  const [checkAll, setCheckAll] = useState(initState.checkAll);
  const [checkedList, setCheckedList] = useState(initState.checkedList);


  const [form] = Form.useForm();
  const [modalForm] = Form.useForm();

  const { tableProps, search }: any = useAntdTable(
    (paginatedParams: any, tableProps: any) =>
      taskSoftVersionList({ appId: field.id, pageSize: paginatedParams.pageSize, pageNum: paginatedParams.current, ...tableProps }),
    {
      form,
      formatResult: formatListResult,
    }
  );
  const { submit, reset } = search;

  useEffect(() => {

    setLoading(true);
    if (field.id) {
      taskSoftDetail(field.id, getDetailCallback);
    }
  }, [history.location.search])

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
        setIndeterminate(false);
        setCheckAll(false);
        setCheckedList([]);
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
   * @todo 监听终端类型列表的值，设置表单中的终端类型对应的checkgroup的options
   */
  useEffect(() => {
    let arr: string[] = [];
    for (let i = 0; i < terminalTypeList.length; i++) {
      arr.push(terminalTypeList[i].typeName);
    }
    setTerminalTypeOptions(arr);
  }, [terminalTypeList]);

  /** 
   * @todo 监听终端类型选中列表，设置相应表单的值，如果不这样写，表单获取不到相应的值
   */
  useEffect(() => {
    if (checkedList.length > 0) {
      modalForm.setFieldsValue({
        terminalTypes: checkedList
      });
    } else {
      modalForm.setFieldsValue({
        terminalTypes: ''
      });
    }
  }, [checkedList]);

  const getDetailCallback = (result: any) => {
    setLoading(false);
    if (result && result.code === RESPONSE_CODE.success) {
      setSoftInfo(result.data || {});
    } else {
      notification.warn(result.msg || '获取详情失败，请刷新页面重试');
    }
  }

  const getTypeName = (id: number) => {
    let driver_type = common.dictList && common.dictList.driver_type &&
      common.dictList.driver_type.data ? common.dictList.driver_type.data : [];
    for (let i = 0; i < driver_type.length; i++) {
      if (id === numeral(driver_type[i].dictValue).value()) {
        return driver_type[i].dictLabel;
      }
    }
    return null;
  }

  const getFirmName = (id: number) => {
    for (let i = 0; i < terminalFirmList.length; i++) {
      if (id === terminalFirmList[i].id) {
        return terminalFirmList[i].firmName;
      }
    }
    return null;
  }

  const onEdit = (item: any) => {
    showModal(item);
  }

  const onDownload = (item: any) => {
    window.location.href = item.appPath;
  }

  const onRemove = async (item: any) => {
    const param = {
      ids: item.id
    }
    const res = await softVersionRemove(param);
    if (res && res.code === RESPONSE_CODE.success) {
      notification.success({ message: '删除软件信息成功' });
      submit();
    } else {
      notification.error({ message: res && res.msg || '删除软件信息失败，请重试' });
    }
  }

  /**
   * @todo 创建table的列
   */
  const columns = createTableColumns([
    {
      title: '操作',
      render: (key, item) => (
        <div>
          <Popconfirm
            title="是否确认删除？"
            onConfirm={() => onDownload(item)}
            okText="是"
            cancelText="否"
          >
            <a>下载</a>
          </Popconfirm>
          {
            history.location.pathname === '/upload/manage-edit' && (
              <>
                <Divider type="vertical" />
                <a onClick={() => onEdit(item)}>修改</a>
                <Divider type="vertical" />
                <Popconfirm
                  title="是否确认删除？"
                  onConfirm={() => onRemove(item)}
                  okText="是"
                  cancelText="否"
                >
                  <a>删除</a>
                </Popconfirm>
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
      dataIndex: 'description',
    },
    {
      title: '上传文件名称',
      dataIndex: 'fileName',
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
    modalForm.setFieldsValue({
      versionCode: item.versionCode,
      versionName: item.versionName,
      firmId: `${item.firmId}`,
      terminalTypes: item.terminalTypes
    });
    setTerminalFirmValue(`${item.firmId}`);
    if (item.terminalTypes) {
      let arr: string[] = item.terminalTypes.split(',');
      setCheckedList(arr);
    }
    setModalVisible(true);
  }

  /**
  * @todo 点击modal的确定按钮调用，执行相应新增/编辑的操作
  */
  const handleOk = async () => {
    const values = await modalForm.validateFields();
    setConfirmLoading(true);
    setConfirmLoading(true);
    const fields = modalForm.getFieldsValue();
    const param = {
      id: editItem.id,
      versionCode: fields.versionCode,
      versionName: fields.versionName,
      firmId: fields.firmId,
      terminalTypes: fields.terminalTypes
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
    modalForm.resetFields();
  };

  /**
  * @todo 终端类型checkbox的全选按钮点击事件
  * @param e 
  */
  const onCheckAllChange = (e: any) => {
    setCheckedList(e.target.checked ? terminalTypeOptions : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  }

  /**
   * @todo 终端类型checkboxgroup的点击事件
   * @param checkedList 
   */
  const onChange = (checkedList: any[]) => {
    setCheckedList(checkedList);
    setIndeterminate(!!checkedList.length && checkedList.length < terminalTypeOptions.length);
    setCheckAll(checkedList.length === terminalTypeOptions.length);
  }

  return (
    <Spin spinning={loading}>
      <Card title="软件信息">
        <Descriptions column={1}>
          <Descriptions.Item label="软件名称">{softInfo.appName}</Descriptions.Item>
          <Descriptions.Item label="软件编号">{softInfo.code}</Descriptions.Item>
          <Descriptions.Item label="软件类型">{getTypeName(softInfo.type)}</Descriptions.Item>
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
        <Table rowKey="id" columns={columns}  {...tableProps} />
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
          form={modalForm}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
        >
          <Item label="内部版本号" name='versionCode'>
            <Input disabled />
          </Item>
          <Item label="外部版本" name='versionName'>
            <Input disabled />
          </Item>
          <Item label="终端厂商" name='firmId' rules={[
            {
              required: true,
              message: '请选择终端厂商',
            }]}
          >
            {renderSelectForm(
              {
                placeholder: '终端厂商',
                formName: 'id',
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
                span: 24
              } as any, false
            )}
          </Item>

          <Item label="终端型号" name='terminalTypes' rules={[
            {
              required: true,
              message: '请选择终端型号',
            }]}
          >
            <Col
              span={24}
              style={{
                borderRadius: 2,
                border: '1px solid #d9d9d9',
                padding: 10,
                display: 'flex',
                flexDirection: 'column',
                width: '100%'
              }}
            >
              <div>
                <Checkbox
                  indeterminate={indeterminate}
                  onChange={onCheckAllChange}
                  checked={checkAll}
                >
                  全选
                </Checkbox>
              </div>
              {
                terminalTypeOptions.length > 0 && (
                  <CheckboxGroup
                    options={terminalTypeOptions}
                    value={checkedList}
                    onChange={onChange}
                    style={{ marginTop: 10 }}
                  />
                )
              }
            </Col>
          </Item>
        </Form>
      </Modal>
    </Spin>
  )
}

export default Page;