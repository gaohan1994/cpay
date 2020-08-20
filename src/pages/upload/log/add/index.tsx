/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-08-20 14:03:06 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-08-20 15:06:12
 * 
 * @todo 日志提取新增
 */
import React, { useState, useEffect } from 'react';
import { Form, Spin, Input, Col, Button, notification, Checkbox, DatePicker, Row, Space, Table, message, Modal } from 'antd';
import { taskUploadJobAdd, taskUploadJobDetail, taskUploadJobEdit } from '../../constants/api';
import { RESPONSE_CODE } from '@/common/config';
import { useHistory } from 'react-router-dom';
import { renderSelectForm } from '@/component/form/render';
import { FormItmeType, FormItem } from '@/component/form/type';
import { useStore } from '@/pages/common/costom-hooks';
import { useSelectorHook } from '@/common/redux-util';
import { DictDetailItem } from '@/pages/common/type';
import { ITerminalFirmItem, ITerminalType } from '@/pages/terminal/types';
import {
  terminalFirmList as getTerminalFirmList,
  terminalTypeListByFirm,
} from '@/pages/terminal/constants';
import { range } from 'lodash';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { PlusOutlined, CloseOutlined, UploadOutlined, ClearOutlined } from '@ant-design/icons';
import { useAntdTable } from 'ahooks';
import { formatListResult, formatSearch } from '@/common/request-util';
import { terminalInfoList } from '@/pages/terminal/message/constants/api';
import { createTableColumns } from '@/component/table';
import Forms from '@/component/form';
import { TaskUploadJobDetail } from '../../types';
import numeral from 'numeral';

const { Item } = Form;
const CheckboxGroup = Checkbox.Group;

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
  typeList: [] as DictDetailItem[],             // 日志提取方式列表
  typeValue: '',                                // 日志提取方式取值
  terminalFirmList: [] as ITerminalFirmItem[],  // 终端厂商列表
  terminalFirmValue: '',                        // 终端厂商选中的值
  terminalTypeList: [] as ITerminalType[],      // 终端类型列表（与终端厂商有关）
  terminalTypeValue: '',                        // 终端类型选中值
  terminalsModalVisible: false,                 // 终端选择的modal是否展示
  selectedTerminals: [] as string[],            // 选中的终端集合
  seletedDeleteTerminals: [] as string[],       // 选中要删除的终端
}

function Page() {
  useStore(['log_upload_type']);
  const history = useHistory();
  const { search: histortSearch } = history.location;
  const field = formatSearch(histortSearch);
  const common = useSelectorHook(state => state.common);
  const [addForm] = Form.useForm();

  const [form] = Form.useForm();
  const { tableProps, search }: any = useAntdTable(
    (paginatedParams: any, tableProps: any) =>
      terminalInfoList({ firmId: terminalFirmValue, terminalTypeCodes: terminalTypeValue, pageSize: paginatedParams.pageSize, pageNum: paginatedParams.current, ...tableProps }),
    {
      form,
      formatResult: formatListResult,
    }
  );
  const { submit, reset } = search;

  const [loading, setLoading] = useState(false);
  const [typeList, setTypeList] = useState(initState.typeList);
  const [typeValue, setTypeValue] = useState(initState.typeValue);
  const [terminalFirmList, setTerminalFirmList] = useState(initState.terminalFirmList);
  const [terminalFirmValue, setTerminalFirmValue] = useState(initState.terminalFirmValue);
  const [terminalTypeList, setTerminalTypeList] = useState(initState.terminalTypeList);
  const [terminalTypeValue, setTerminalTypeValue] = useState(initState.terminalTypeValue);
  const [terminalsModalVisible, setTerminalsModalVisible] = useState(initState.terminalsModalVisible);
  const [selectedRowKeys, setSelectedRowKeys] = useState([] as any[]);  // 选中的列的key值列表
  const [selectedTerminals, setSelectedTerminals] = useState(initState.selectedTerminals);
  const [seletedDeleteTerminals, setSeletedDeleteTerminals] = useState(initState.seletedDeleteTerminals);

  /**
   * @todo 获取终端厂商列表 
   */
  useEffect(() => {
    getTerminalFirmList({}, (firmList: any[]) => {
      setTerminalFirmList(firmList);
    });
  }, []);

  /**
   * @todo 从redux中拿取字典数据：log_upload_type（日志提取方式）
   */
  useEffect(() => {
    setTypeList(common.dictList && common.dictList.log_upload_type && common.dictList.log_upload_type.data || []);
  }, [common.dictList]);

  /**
   * @todo 监听终端厂商的值，获取终端类型列表
   */
  useEffect(() => {
    if (terminalFirmValue.length > 0) {
      terminalTypeListByFirm({ firmId: terminalFirmValue }, setTerminalTypeList);
    }
  }, [terminalFirmValue]);

  /**
   * @todo 监听终端厂商列表和终端厂商选中值的变化，当终端厂商选中值不在终端厂商列表中，需要清空终端厂商选中值和终端类型列表
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
        addForm.setFieldsValue({ firmId: undefined });
        setTerminalTypeValue('');
        addForm.setFieldsValue({ terminalType: undefined });
      }
    }
  }, [terminalFirmList, terminalFirmValue])

  /**
   * @todo 监听选中终端的改变，改变相应的选中终端选项
   */
  useEffect(() => {
    addForm.setFieldsValue({ tusns: selectedTerminals });
  }, [selectedTerminals]);

  /** 
   * @todo 根据field.id判断是否为编辑页面，编辑页面需要获取应用详情，并设置相应的值 
   */
  useEffect(() => {
    if (field.id) {
      taskUploadJobDetail(field.id, getDetailCallback);
    }
  }, [history.location.search]);

  /**
   * @todo 获取到应用型详情的回调，设置各个form的值
   * @param result 
   */
  const getDetailCallback = (result: any) => {
    if (result && result.code === RESPONSE_CODE.success) {
      let detail: TaskUploadJobDetail = result.data;
      addForm.setFieldsValue({
        jobName: detail.jobName,
        type: detail.type,
        appCode: detail.appCode
      });
      if (typeof detail.firmId === 'number') {
        addForm.setFieldsValue({ firmId: `${detail.firmId}` });
        setTerminalFirmValue(`${detail.firmId}`);
      }
      if (detail.terminalType) {
        addForm.setFieldsValue({ terminalType: detail.terminalType });
        setTerminalTypeValue(detail.terminalType);
      }
      if (detail.logBeginTime) {
        addForm.setFieldsValue({ logBeginTime: moment(detail.logBeginTime) });
      }
      if (detail.logEndTime) {
        addForm.setFieldsValue({ logEndTime: moment(detail.logEndTime) });
      }
      if (detail.validStartTime) {
        addForm.setFieldsValue({ validStartTime: moment(detail.validStartTime) });
      }
      if (detail.validEndTime) {
        addForm.setFieldsValue({ validEndTime: moment(detail.validEndTime) });
      }
      if (detail.tusns) {
        let arr = detail.tusns.split(',');
        setSelectedTerminals(arr);
      }
    } else {
      notification.warn(result && result.msg || '获取详情失败，请刷新页面重试');
    }
  }

  /**
   * @todo 点击保存调用
   */
  const onSubmit = async () => {
    try {
      const values = await addForm.validateFields();
      console.log('Success:', values);
      onAddJob();
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }

  /**
   * @todo 添加/修改任务
   */
  const onAddJob = async () => {
    const fields = addForm.getFieldsValue();
    if (fields.logBeginTime.diff(fields.logEndTime) >= 0) {
      notification.error({ message: '日志结束日期必须大于日志开始日期' });
      return;
    }

    if (fields.validStartTime.diff(fields.validEndTime) >= 0) {
      notification.error({ message: '有效截止日期必须大于有效起始日期' });
      return;
    }
    let param: any = {
      jobName: fields.jobName,
      type: fields.type,
      appCode: fields.appCode,
      logBeginTime: fields.logBeginTime.format('YYYY-MM-DD'),
      logEndTime: fields.logEndTime.format('YYYY-MM-DD'),
      validStartTime: fields.validStartTime.format('YYYY-MM-DD HH:mm:ss'),
      validEndTime: fields.validEndTime.format('YYYY-MM-DD HH:mm:ss'),
      firmId: fields.firmId,
      terminalType: terminalTypeValue,
      tusns: selectedTerminals.join(';')
    }
    if (field.id) {
      param = {
        ...param,
        id: field.id
      }
      setLoading(true);
      const res = await taskUploadJobEdit(param);
      setLoading(false);
      if (res && res.code === RESPONSE_CODE.success) {
        notification.success({ message: '终端提取日志修改成功' });
        history.goBack();
      } else {
        notification.error({ message: res && res.msg || '终端提取日志修改失败，请重试' });
      }
    } else {
      setLoading(true);
      const res = await taskUploadJobAdd(param);
      setLoading(false);
      if (res && res.code === RESPONSE_CODE.success) {
        notification.success({ message: '终端提取日志新增成功' });
        history.goBack();
      } else {
        notification.error({ message: res && res.msg || '终端提取日志新增失败，请重试' });
      }
    }
  }

  /**
   * @todo 选择终端集合modal点击确定，将选中终端集合放入终端集合列表中
   */
  const pushSelectedRows = () => {
    if (selectedTerminals.length === 0) {
      setSelectedTerminals(selectedRowKeys);
    } else {
      const arr = [...selectedTerminals];
      for (let i = 0; i < selectedRowKeys.length; i++) {
        let item = selectedRowKeys[i];
        let flag = false;
        for (let j = 0; j < selectedTerminals.length; j++) {
          if (item === selectedTerminals[j]) {
            flag = true;
            break;
          }
        }
        if (!flag) {
          arr.push(item);
        }
      }
      setSelectedTerminals(arr);
    }
  }

  /**
   * @todo 展示选择终端集合modal
   */
  const showTerminalsModal = () => {
    if (terminalFirmValue.length === 0) {
      message.error('请选择终端厂商');
      return;
    }
    if (terminalTypeValue.length === 0) {
      message.error('请选择终端型号');
      return;
    }
    setSelectedRowKeys([]);
    reset();
    setTerminalsModalVisible(true);
  }

  /**
   * @todo 选择终端集合modal点击确定调用
   */
  const handleOk = () => {
    if (selectedRowKeys.length === 0) {
      message.error('请选择终端');
      return;
    }
    pushSelectedRows();
    setTerminalsModalVisible(false);
  }

  /**
   * @todo 选择终端集合modal点击取消调用
   */
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

  /**
   * @todo 终端集合
   */
  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  /**
   * @todo 批量删除终端集合/清空
   * @param type 
   */
  const onDeleTerminals = (type?: string) => {
    if (type === 'ALL') {
      setSelectedTerminals([]);
    } else if (seletedDeleteTerminals.length > 0) {
      const arr: string[] = [];
      for (let i = 0; i < selectedTerminals.length; i++) {
        let flag = false;
        for (let j = 0; j < seletedDeleteTerminals.length; j++) {
          if (selectedTerminals[i] === seletedDeleteTerminals[j]) {
            flag = true;
            break;
          }
        }
        if (!flag) {
          arr.push(selectedTerminals[i]);
        }
      }
      setSelectedTerminals(arr);
    }
    setSeletedDeleteTerminals([]);
  }

  /**
   * 终端集合select改变调用（设置选中的终端用以批量删除）
   * @param e 
   */
  const handleSelectChange = (e: any) => {
    const options = e.target.options;
    let arr: string[] = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        arr.push(options[i].value);
      }
    }
    setSeletedDeleteTerminals(arr);
  }

  return (
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
            {renderSelectForm(
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
          <Item label="应用包名" name='appCode' rules={[
            {
              required: true,
              message: '请输入应用包名',
            }]}
          >
            <Input />
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

          <Item label="终端型号" name='terminalType' rules={[
            {
              required: true,
              message: '请选择终端型号',
            }]}
          >
            {renderSelectForm(
              {
                placeholder: '终端厂商',
                formName: 'id',
                formType: FormItmeType.Select,
                selectData:
                  (terminalTypeList &&
                    terminalTypeList.map((item) => {
                      return {
                        value: `${item.typeCode}`,
                        title: `${item.typeName}`,
                      };
                    })) ||
                  [],
                value: terminalFirmValue,
                onChange: (id: string) => {
                  setTerminalTypeValue(`${id}`);
                },
                span: 24
              } as any, false
            )}
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
          <Item label="终端集合" name='tusns' rules={[
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
                <Button type="primary" icon={<CloseOutlined />} onClick={() => onDeleTerminals()}>
                  删除
                  </Button>
                <Button type="primary" icon={<ClearOutlined />} onClick={() => { onDeleTerminals('ALL') }}>
                  清空
                  </Button>
              </Space>
              <select
                style={{
                  width: '100%',
                  height: 200,
                  border: '1px solid rgb(217, 217, 217)',
                  padding: 11,
                  overflow: 'auto'
                }}
                multiple={true}
                value={seletedDeleteTerminals}
                onChange={handleSelectChange}
              >
                {
                  selectedTerminals.map(item => {
                    return (
                      <option value={item}>{item}</option>
                    )
                  })
                }
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
          <Table rowKey="tusn" rowSelection={rowSelection} columns={columns}  {...tableProps} style={{ overflowX: 'auto', paddingRight: '24px' }} />
        </div>
      </Modal>
    </Spin>
  )
}

export default Page;