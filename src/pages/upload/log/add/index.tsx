import React, { useState, useEffect } from 'react';
import { Form, Spin, Input, Col, Button, notification, Checkbox, DatePicker, ConfigProvider, Row, Space, Table, message } from 'antd';
import { taskUploadJobAdd } from '../../constants/api';
import { RESPONSE_CODE } from '@/common/config';
import { useHistory } from 'react-router-dom';
import { renderCommonSelectForm } from '@/component/form/render';
import { FormItmeType, FormItem } from '@/component/form/type';
import { useStore } from '@/pages/common/costom-hooks';
import { useSelectorHook } from '@/common/redux-util';
import { DictDetailItem } from '@/pages/common/type';
import { ITerminalFirmItem, ITerminalType } from '@/pages/terminal/types';
import {
  terminalFirmList as getTerminalFirmList,
  terminalTypeListByFirm,
} from '@/pages/terminal/constants';
import { range, curry } from 'lodash';
import moment from 'moment';
import 'moment/locale/zh-cn';
import locale from 'antd/es/locale/zh_CN';
import { PlusOutlined, CloseOutlined, BarsOutlined, CheckOutlined, UploadOutlined } from '@ant-design/icons';
import Modal from 'antd/lib/modal/Modal';
import { useAntdTable } from 'ahooks';
import { formatListResult } from '@/common/request-util';
import { terminalInfoList } from '@/pages/terminal/message/constants/api';
import { createTableColumns } from '@/component/table';
import Forms from '@/component/form';

const { Item } = Form;
const CheckboxGroup = Checkbox.Group;
const { TextArea } = Input;

const formLayout = {
  labelCol: {
    span: 3,
  },
  wrapperCol: {
    span: 8,
  },
}

const buttonLayout = {
  wrapperCol: {
    offset: 3,
    span: 16,
  }
}

const initState = {
  typeList: [] as DictDetailItem[],
  typeValue: '',
  terminalFirmList: [] as ITerminalFirmItem[],        // 终端厂商列表
  terminalFirmValue: '',                              // 终端厂商选中的值
  terminalTypeList: [] as ITerminalType[],            // 终端类型列表（与终端厂商有关）
  terminalTypeOptions: [] as string[],                // 终端类型列表选项
  indeterminate: false,                               // 复选框的全选按钮是否不定
  checkAll: false,                                    // 复选框是否全选
  checkedList: [] as string[],                        // 复选框列表,
  terminalsModalVisible: false,                       // 终端选择的modal是否展示
}

function Page() {
  useStore(['log_upload_type']);
  const history = useHistory();
  const common = useSelectorHook(state => state.common);
  const [form] = Form.useForm();
  const [addForm] = Form.useForm();
  const { tableProps, search }: any = useAntdTable(
    (paginatedParams: any, tableProps: any) =>
      terminalInfoList({ firmId: terminalFirmValue, terminalTypeCodes: checkedList.join(','), pageSize: paginatedParams.pageSize, pageNum: paginatedParams.current, ...tableProps }),
    {
      form,
      formatResult: formatListResult,
    }
  );
  const { submit, reset } = search;

  const [loading, setLoading] = useState(false);
  const [typeList, setTypeList] = useState(initState.typeList);
  const [typeValue, setTypeValue] = useState(initState.typeValue);
  const [terminalFirmList, setTerminalFirmList] = useState(
    initState.terminalFirmList
  );
  const [terminalFirmValue, setTerminalFirmValue] = useState(
    initState.terminalFirmValue
  );
  const [terminalTypeList, setTerminalTypeList] = useState(
    initState.terminalTypeList
  );
  const [terminalTypeOptions, setTerminalTypeOptions] = useState(
    initState.terminalTypeOptions
  );
  const [indeterminate, setIndeterminate] = useState(initState.indeterminate);
  const [checkAll, setCheckAll] = useState(initState.checkAll);
  const [checkedList, setCheckedList] = useState(initState.checkedList);
  const [terminalsModalVisible, setTerminalsModalVisible] = useState(initState.terminalsModalVisible);
  const [selectedRowKeys, setSelectedRowKeys] = useState([] as any[]);  // 选中的列的key值列表

  useEffect(() => {
    setTypeList(common.dictList && common.dictList.log_upload_type && common.dictList.log_upload_type.data || []);
  }, [common.dictList]);

  useEffect(() => {
    /** 获取终端厂商列表 */
    getTerminalFirmList({}, (firmList: any[]) => {
      setTerminalFirmList(firmList);
    });
  }, []);

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
      addForm.setFieldsValue({
        terminalTypes: checkedList
      });
    } else {
      addForm.setFieldsValue({
        terminalTypes: ''
      });
    }
  }, [checkedList]);

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

  const onSubmit = async () => {
    try {
      const values = await addForm.validateFields();
      console.log('Success:', values);
      onAddJob();
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }

  const onAddJob = async () => {
    const fields = addForm.getFieldsValue();
    const param = {
      jobName: fields.jobName
    }
    const res = await taskUploadJobAdd(param);
    if (res && res.code === RESPONSE_CODE.success) {
      notification.success({ message: '终端提取日志新增成功' });
      history.goBack();
    } else {
      notification.error({ message: res && res.msg || '终端提取日志新增失败，请重试' });
    }
  }

  function disabledDate(current: any, type?: string) {
    switch (type) {
      case 'VALID_END':
        const validStartTime = addForm.getFieldValue('validStartTime');
        return validStartTime && current.add(1, 'days') < validStartTime.endOf('day');
      default:
        return false;
    }
  }

  function disabledDateTime(current: any, type?: string) {
    switch (type) {
      case 'VALID_END':
        const validStartTime = addForm.getFieldValue('validStartTime');
        if (validStartTime) {
          return {
            disabledHours: () => range(0, validStartTime.get('hour')),
            disabledMinutes: () => range(0, validStartTime.get('minute')),
            disabledSeconds: () => range(0, validStartTime.get('second')),
          }
        }
      default: {
        return {
          disabledHours: () => range(0, 0),
          disabledMinutes: () => range(0, 0),
          disabledSeconds: () => range(0, 0),
        };
      }
    }
  }

  const showTerminalsModal = () => {
    if (terminalFirmValue.length === 0) {
      message.error('请选择终端厂商');
      return;
    }
    if (checkedList.length === 0) {
      message.error('请选择终端型号');
      return;
    }
    reset();
    setTerminalsModalVisible(true);
  }

  const handleOk = () => {
    setTerminalsModalVisible(false);
  }

  const handleCancel = () => {
    setTerminalsModalVisible(false);
  }

  /**
   * @todo 创建table的列
   */
  const columns = createTableColumns([
    {
      title: '终端序列号',
      dataIndex: 'tusn',
    },
    {
      title: '所属机构',
      dataIndex: 'deptName',
    },
    {
      title: '终端厂商',
      dataIndex: 'firmName',
    },
    {
      title: '终端型号',
      dataIndex: 'terminalTypeName'
    },
    {
      title: '商户名称',
      dataIndex: 'merchantName'
    }
  ]);

  /**
   * @todo table查询表单
   */
  const forms: FormItem[] = [
    {
      span: 6,
      formName: 'tusn',
      placeholder: '终端序列号',
      formType: FormItmeType.Normal,
    },
    {
      span: 6,
      formName: 'merchantName',
      placeholder: '商户名称',
      formType: FormItmeType.Normal,
    },
    {
      span: 8,
      formName: 'deptId',
      formType: FormItmeType.TreeSelectCommon,
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  return (
    <ConfigProvider locale={locale}>
      <Spin spinning={loading} style={{ backgroundColor: 'white' }}>
        <div style={{ paddingTop: '10px', }}>
          <Form
            form={addForm}
            name="advanced_search"
            className="ant-advanced-search-form"
            {...formLayout}
            style={{ backgroundColor: 'white' }}
          >
            <Item label="任务名称" name='jobName' rules={[
              {
                required: true,
                message: '请输入任务名称',
              }]}
            >
              <Input />
            </Item>
            <Item label="日志提取方式" name='type' rules={[
              {
                required: true,
                message: '请选择日志提取方式',
              }]}
            >
              {renderCommonSelectForm(
                {
                  placeholder: '日志提取方式',
                  formName: 'id',
                  formType: FormItmeType.Select,
                  selectData:
                    (typeList &&
                      typeList.map((item) => {
                        return {
                          value: `${item.dictValue}`,
                          title: `${item.dictLabel}`,
                        };
                      })) ||
                    [],
                  value: typeValue,
                  onChange: (id: string) => {
                    setTypeValue(`${id}`);
                  },
                  span: 24
                } as any, false
              )}
            </Item>
            <Item label="终端厂商" name='firmId' rules={[
              {
                required: true,
                message: '请选择终端厂商',
              }]}
            >
              {renderCommonSelectForm(
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
            <Item label="有效起始日期" name='validStartTime' rules={[
              {
                required: true,
                message: '请选择有效起始日期',
              }]}
            >
              <DatePicker
                format="YYYY-MM-DD HH:mm:ss"
                style={{ width: '100%' }}
                // disabledDate={current => disabledDate(current, 'VALID_START')}
                // disabledTime={current => disabledDateTime(current, 'VALID_START')}
                showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                placeholder="请选择有效起始日期"
              />
            </Item>
            <Item label="有效截止日期" name='validEndTime' rules={[
              {
                required: true,
                message: '请选择有效截止日期',
              }]}
            >
              <DatePicker
                format="YYYY-MM-DD HH:mm:ss"
                style={{ width: '100%' }}
                // disabledDate={current => disabledDate(current, 'VALID_END')}
                // disabledTime={current => disabledDateTime(current, 'VALID_END')}
                showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                placeholder="请选择有效截止日期"
              />
            </Item>
            <Item label="日志起始日期" name='logBeginTime' rules={[
              {
                required: true,
                message: '请选择日志起始日期',
              }]}
            >
              <DatePicker
                format="YYYY-MM-DD"
                style={{ width: '100%' }}
                // disabledDate={current => disabledDate(current, 'VALID_START')}
                // disabledTime={current => disabledDateTime(current, 'VALID_START')}
                placeholder="请选择日志起始日期"
              />
            </Item>
            <Item label="日志结束日期" name='logEndTime' rules={[
              {
                required: true,
                message: '请选择日志结束日期',
              }]}
            >
              <DatePicker
                format="YYYY-MM-DD"
                style={{ width: '100%' }}
                // disabledDate={current => disabledDate(current, 'VALID_START')}
                // disabledTime={current => disabledDateTime(current, 'VALID_START')}
                placeholder="请选择日志结束日期"
              />
            </Item>
            <Item label="终端集合" name=' tusns' rules={[
              {
                required: true,
                message: '请选择终端集合',
              }]}
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                <Space>
                  <Button type="primary" icon={<PlusOutlined />} onClick={showTerminalsModal}>
                    添加终端
                  </Button>
                  <Button type="primary" icon={<UploadOutlined />}>
                    Excel导入
                  </Button>
                  <Button type="primary" icon={<CloseOutlined />}>
                    删除
                </Button>
                </Space>
                <select
                  style={{
                    width: '100%',
                    height: 150,
                    border: '1px solid rgb(217, 217, 217)',
                    padding: '4px 11px 4px',
                  }}
                  multiple={true}
                >
                  {/* <option value='D1V0520000008'>D1V0520000008</option>
                  <option value='D1V0520000008'>D1V0520000008</option>
                  <option value='D1V0520000008'>D1V0520000008</option>
                  <option value='D1V0520000008'>D1V0520000008</option>
                  <option value='D1V0520000008'>D1V0520000008</option> */}
                </select>
              </Space>
            </Item>
            <Item {...buttonLayout} >
              <Col>
                <Button type="primary" onClick={onSubmit}>
                  保存
                </Button>
              </Col >
            </Item>
          </Form>
        </div>
        <Modal
          title={"终端选择"}
          cancelText="取消"
          okText="确定"
          visible={terminalsModalVisible}
          onOk={handleOk}
          // confirmLoading={confirmLoading}
          onCancel={handleCancel}
          width={'60vw'}
          bodyStyle={{ padding: 0 }}
        >
          <div style={{ height: 400, overflow: 'auto', overflowX: 'hidden', padding: '24px 0px 24px 24px' }}>
            <Forms
              form={form}
              forms={forms}
              formButtonProps={{
                submit,
                reset,
              }}
            />
            <Table rowKey="id" rowSelection={rowSelection} columns={columns}  {...tableProps} style={{ overflowX: 'auto', paddingRight: '24px' }} />
          </div>
        </Modal>
      </Spin>
    </ConfigProvider>

  )
}

export default Page;