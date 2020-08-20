/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-08-18 15:14:30 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-08-20 14:18:17
 * 
 * @todo 远程运维新增
 */
import React, { useState, useEffect } from 'react';
import { Form, Spin, Input, Col, Button, notification, Checkbox, Space, message, Modal, Table, Radio } from 'antd';
import { taskUploadJobAdd, taskUploadJobEdit, taskOperationJobDetail, taskOperationJobAdd } from '../../constants/api';
import { RESPONSE_CODE } from '@/common/config';
import { useHistory } from 'react-router-dom';
import { useStore } from '@/pages/common/costom-hooks';
import { useSelectorHook } from '@/common/redux-util';
import { formatSearch, formatListResult } from '@/common/request-util';
import { renderSelectForm, renderTreeSelect } from '@/component/form/render';
import { FormItmeType, FormItem } from '@/component/form/type';
import { ITerminalFirmItem, ITerminalType } from '@/pages/terminal/types';
import {
  terminalFirmList as getTerminalFirmList,
  terminalTypeListByFirm,
} from '@/pages/terminal/constants';
import { PlusOutlined, CloseOutlined, UploadOutlined, ClearOutlined } from '@ant-design/icons';
import { useAntdTable } from 'ahooks';
import { terminalInfoList, terminalGroupListByDept } from '@/pages/terminal/message/constants/api';
import { createTableColumns } from '@/component/table';
import Forms from '@/component/form';
import { ITerminalGroupByDeptId } from '@/pages/terminal/message/types';
import { ITaskOperationJobDetail } from '../../types';
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
  operatorCommandList: [] as any[],
  operatorCommandValue: '',
  terminalFirmList: [] as ITerminalFirmItem[],        // 终端厂商列表
  terminalFirmValue: '',                              // 终端厂商选中的值
  terminalTypeList: [] as ITerminalType[],            // 终端类型列表（与终端厂商有关）
  terminalTypeValue: '',                              // 终端类型选中值
  releseTypeList: [] as any[],                        // 发布类型列表
  releaseTypeValue: '',                                // 发布类型选中值
  terminalsModalVisible: false,                       // 终端选择的modal是否展示
  selectedTerminalOptions: [] as string[],            // 选中的终端集合
  seletedDeleteTerminals: [] as string[],             // 选中要删除的终端
  deptList: [] as any[],                              // 所属机构列表
  deptValue: -1,                                      // 所属机构选中值
  groupFilterType: 0,                                 // 组别过滤类型 0-无 1-指定 2-排除
  terminalGroupList: [] as ITerminalGroupByDeptId[],  // 终端组别列表
  indeterminate: false,                               // 复选框的全选按钮是否不定
  checkAll: false,                                    // 复选框是否全选
  checkedList: [] as number[],                        // 复选框列表
}

function Page() {
  useStore(['terminal_operator_command', 'release_type']);
  const history = useHistory();
  const { search: histortSearch } = history.location;
  const field = formatSearch(histortSearch);

  const common = useSelectorHook(state => state.common);

  const [loading, setLoading] = useState(false);
  const [operatorCommandList, setOperatorCommandList] = useState(initState.operatorCommandList);
  const [operatorCommandValue, setOperatorCommandValue] = useState(initState.operatorCommandValue);
  const [terminalFirmList, setTerminalFirmList] = useState(initState.terminalFirmList);
  const [terminalFirmValue, setTerminalFirmValue] = useState(initState.terminalFirmValue);
  const [terminalTypeList, setTerminalTypeList] = useState(initState.terminalTypeList);
  const [terminalTypeValue, setTerminalTypeValue] = useState(initState.terminalTypeValue);
  const [releseTypeList, setReleseTypeList] = useState(initState.releseTypeList);
  const [releaseTypeValue, setReleaseTypeValue] = useState(initState.releaseTypeValue);
  const [terminalsModalVisible, setTerminalsModalVisible] = useState(initState.terminalsModalVisible);
  const [selectedRowKeys, setSelectedRowKeys] = useState([] as any[]);  // 选中的列的key值列表
  const [selectedTerminalOptions, setSelectedTerminalOptions] = useState(initState.selectedTerminalOptions);
  const [seletedDeleteTerminals, setSeletedDeleteTerminals] = useState(initState.seletedDeleteTerminals);
  const [deptList, setDeptList] = useState(initState.deptList);
  const [deptValue, setDeptValue] = useState(initState.deptValue);
  const [groupFilterType, setGroupFilterType] = useState(initState.groupFilterType);
  const [terminalGroupList, setTerminalGroupList] = useState(initState.terminalGroupList);
  const [indeterminate, setIndeterminate] = useState(initState.indeterminate);
  const [checkAll, setCheckAll] = useState(initState.checkAll);
  const [checkedList, setCheckedList] = useState(initState.checkedList);

  const [addForm] = Form.useForm(); // 新增的表单
  const [form] = Form.useForm();    // 查询终端的表单
  const { tableProps, search }: any = useAntdTable(
    (paginatedParams: any, tableProps: any) =>
      terminalInfoList({ firmId: terminalFirmValue, terminalTypeId: terminalTypeValue, pageSize: paginatedParams.pageSize, pageNum: paginatedParams.current, ...tableProps }),
    {
      form,
      formatResult: formatListResult,
    }
  );
  const { submit, reset } = search;

  /** 
 * @todo 根据field.id判断是否为编辑页面，编辑页面需要获取应用详情，并设置相应的值 
 */
  useEffect(() => {
    if (field.id) {
      taskOperationJobDetail(field.id, getDetailCallback);
    }
  }, [history.location.search]);

  /**
   * @todo 监听字典类型的变化，获取相应数据
   */
  useEffect(() => {
    setOperatorCommandList(common.dictList && common.dictList.terminal_operator_command && common.dictList.terminal_operator_command.data || []);
    setReleseTypeList(common.dictList && common.dictList.release_type && common.dictList.release_type.data || []);
  }, [common.dictList]);

  /**
   * @todo 获取机构树
   */
  useEffect(() => {
    setDeptList(common.deptTreeData);
  }, [common.deptTreeData]);

  /**
   *  @todo 获取终端厂商列表
   *  */
  useEffect(() => {
    getTerminalFirmList({}, (firmList: any[]) => {
      setTerminalFirmList(firmList);
    });
  }, []);

  /**
   * @todo 监听终端厂商的值，获取终端类型列表
   */
  useEffect(() => {
    if (terminalFirmValue.length > 0) {
      setTerminalTypeList([]);
      // setTerminalTypeValue('');
      // addForm.setFieldsValue({ terminalTypeId: undefined });
      terminalTypeListByFirm({ firmId: terminalFirmValue }, setTerminalTypeList);
    }
  }, [terminalFirmValue]);

  useEffect(() => {
    if (terminalTypeList.length > 0) {
      let flag = false;
      for (let i = 0; i < terminalTypeList.length; i++) {
        if (numeral(terminalTypeValue).value() === terminalTypeList[i].id) {
          flag = true;
        }
      }
      if (!flag) {
        setTerminalTypeValue('');
        addForm.setFieldsValue({ terminalTypeId: undefined });
      }
    }
  }, [terminalTypeList])

  /**
   * @todo 根据机构id获取终端组别列表
   */
  useEffect(() => {
    if (deptValue > 0) {
      terminalGroupListByDept(deptValue, (groupData) => {
        setTerminalGroupList(groupData);
      });
    }
  }, [deptValue]);

  /**
   * @todo 监听选中终端的改变，改变相应的选中终端选项
   */
  useEffect(() => {
    addForm.setFieldsValue({ tusns: selectedTerminalOptions });
  }, [selectedTerminalOptions]);

  /**
   * @todo 根据机构值的改变，设置相应组别复选框的值
   */
  useEffect(() => {
    setCheckAll(false);
    setIndeterminate(false);
    setCheckedList([]);
  }, [deptValue]);

  useEffect(() => {
    addForm.setFieldsValue({ groupIds: checkedList });
  }, [checkedList])

  /**
   * @todo 获取到应用型详情的回调，设置各个form的值
   * @param result 
   */
  const getDetailCallback = (result: any) => {
    if (result && result.code === RESPONSE_CODE.success) {
      const detail: ITaskOperationJobDetail = result.data;
      addForm.setFieldsValue({
        jobName: detail.jobName,
        operatorCommand: detail.operatorCommand
      });
      if (detail.operatorCommand) {
        addForm.setFieldsValue({ operatorCommand: detail.operatorCommand });
        setOperatorCommandValue(`${detail.operatorCommand}`);
      }
      if (typeof detail.firmId === 'number') {
        addForm.setFieldsValue({ firmId: `${detail.firmId}` });
        setTerminalFirmValue(`${detail.firmId}`);
      }
      if (typeof detail.terminalTypeId === 'number') {
        addForm.setFieldsValue({ terminalTypeId: `${detail.terminalTypeId}` });
        setTerminalTypeValue(`${detail.terminalTypeId}`);
      }
      if (typeof detail.releaseType === 'number') {
        addForm.setFieldsValue({ releaseType: `${detail.releaseType}` });
        setReleaseTypeValue(`${detail.releaseType}`);
      }
      if (typeof detail.deptId === 'number') {
        addForm.setFieldsValue({ deptId: detail.deptId });
        setDeptValue(detail.deptId);
      }
      if (typeof detail.isGroupUpdate === 'number') {
        addForm.setFieldsValue({ groupFilterType: detail.isGroupUpdate });
        setGroupFilterType(detail.isGroupUpdate);
      }
      if (typeof detail.groupIds) {
        const arr = detail.groupIds.split(',');
        const numArr: number[] = [];
        for (let i = 0; i < arr.length; i++) {
          numArr.push(numeral(arr[i]).value());
        }
        setCheckedList(numArr);
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

  const onAddJob = async () => {
    const fields = addForm.getFieldsValue();
    let param: any = {
      jobName: fields.jobName,
      copsSign: 0,
      operatorCommand: operatorCommandValue,
      firmId: terminalFirmValue,
      terminalTypeId: terminalTypeValue,
      releaseType: releaseTypeValue,
    }
    if (releaseTypeValue === '0') {
      param = {
        ...param,
        tusns: selectedTerminalOptions.join(';')
      }
    } else if (releaseTypeValue === '1') {
      param = {
        ...param,
        deptId: deptValue,
        isGroupUpdate: groupFilterType
      }
      if (groupFilterType !== 0) {
        param = {
          ...param,
          groupIds: checkedList.join(',')
        }
      }
    }
    if (field.id && field.type === '1') {
      param = {
        ...param,
        id: field.id
      }
      const res = await taskUploadJobEdit(param);
      if (res && res.code === RESPONSE_CODE.success) {
        notification.success({ message: '终端提取日志修改成功' });
        history.goBack();
      } else {
        notification.error({ message: res && res.msg || '终端提取日志修改失败，请重试' });
      }
    } else {
      const res = await taskOperationJobAdd(param);
      if (res && res.code === RESPONSE_CODE.success) {
        notification.success({ message: '终端提取日志新增成功' });
        history.goBack();
      } else {
        notification.error({ message: res && res.msg || '终端提取日志新增失败，请重试' });
      }
    }
  }

  const pushSelectedRows = () => {
    if (selectedTerminalOptions.length === 0) {
      setSelectedTerminalOptions(selectedRowKeys);
    } else {
      const arr = [...selectedTerminalOptions];
      for (let i = 0; i < selectedRowKeys.length; i++) {
        let item = selectedRowKeys[i];
        let flag = false;
        for (let j = 0; j < selectedTerminalOptions.length; j++) {
          if (item === selectedTerminalOptions[j]) {
            flag = true;
            break;
          }
        }
        if (!flag) {
          arr.push(item);
        }
      }
      setSelectedTerminalOptions(arr);
    }
  }

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
    // setSelectedRows([]);
    reset();
    setTerminalsModalVisible(true);
  }

  const handleOk = () => {
    if (selectedRowKeys.length === 0) {
      message.error('请选择终端');
      return;
    }
    pushSelectedRows();
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

  const onSelectedRowChange = (selectedRowKeys: any) => {
    setSelectedRowKeys(selectedRowKeys);
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectedRowChange,
  };

  /**
  * @todo 批量删除终端集合/清空
  * @param type 
  */
  const onDeleTerminals = (type?: string) => {
    if (type === 'ALL') {
      setSelectedTerminalOptions([]);
    } else if (seletedDeleteTerminals.length > 0) {
      const arr: string[] = [];
      for (let i = 0; i < selectedTerminalOptions.length; i++) {
        let flag = false;
        for (let j = 0; j < seletedDeleteTerminals.length; j++) {
          if (selectedTerminalOptions[i] === seletedDeleteTerminals[j]) {
            flag = true;
            break;
          }
        }
        if (!flag) {
          arr.push(selectedTerminalOptions[i]);
        }
      }
      setSelectedTerminalOptions(arr);
    }
    setSeletedDeleteTerminals([]);
  }

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

  /**
   * @todo 终端组别checkbox的全选按钮点击事件
   * @param e 
   */
  const onCheckAllChange = (e: any) => {
    if (e.target.checked) {
      let arr: number[] = [];
      for (let i = 0; i < terminalGroupList.length; i++) {
        arr.push(terminalGroupList[i].id);
      }
      setCheckedList(arr);
    } else {
      setCheckedList([]);
    }
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  }

  /**
   * @todo 终端组别checkboxgroup的点击事件
   * @param checkedList 
   */
  const onChange = (checkedList: any[]) => {
    setCheckedList(checkedList);
    setIndeterminate(!!checkedList.length && checkedList.length < terminalGroupList.length);
    setCheckAll(checkedList.length === terminalGroupList.length);
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
          <Item label="操作指令" name='operatorCommand' rules={[
            {
              required: true,
              message: '请选择操作指令',
            }]}
          >
            {renderSelectForm(
              {
                placeholder: '请选择操作指令',
                formName: 'id',
                formType: FormItmeType.Select,
                selectData:
                  (operatorCommandList &&
                    operatorCommandList.map((item) => {
                      return {
                        value: `${item.dictValue}`,
                        title: `${item.dictLabel}`,
                      };
                    })) ||
                  [],
                value: operatorCommandValue,
                onChange: (id: string) => {
                  setOperatorCommandValue(`${id}`);
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
            {renderSelectForm(
              {
                placeholder: '请选择终端厂商',
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
          <Item label="终端类型" name='terminalTypeId' rules={[
            {
              required: true,
              message: '请选择终端类型',
            }]}
          >
            {renderSelectForm(
              {
                placeholder: '请选择终端类型',
                formName: 'terminalTypeId',
                formType: FormItmeType.Select,
                selectData:
                  (Array.isArray(terminalTypeList) &&
                    terminalTypeList.map((item) => {
                      return {
                        value: `${item.id}`,
                        title: `${item.typeName}`,
                      };
                    })) ||
                  [],
                value: terminalTypeValue,
                onChange: (id: string) => {
                  setTerminalTypeValue(`${id}`);
                },
                span: 24
              } as any, false
            )}
          </Item>
          <Item label="发布类型" name='releaseType' rules={[
            {
              required: true,
              message: '请选择发布类型',
            }]}
          >
            {renderSelectForm(
              {
                placeholder: '请选择发布类型',
                formName: 'id',
                formType: FormItmeType.Select,
                selectData:
                  (releseTypeList &&
                    releseTypeList.map((item) => {
                      return {
                        value: `${item.dictValue}`,
                        title: `${item.dictLabel}`,
                      };
                    })) ||
                  [],
                value: releaseTypeValue,
                onChange: (id: string) => {
                  setReleaseTypeValue(`${id}`);
                },
                span: 24
              } as any, false
            )}
          </Item>
          {
            releaseTypeValue === '0' && (
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
                      selectedTerminalOptions.map(item => {
                        return (
                          <option value={item}>{item}</option>
                        )
                      })
                    }
                  </select>
                </Space>
              </Item>
            )
          }
          {
            releaseTypeValue === '1' && (
              <>
                <Item label="所属机构" name='deptId' rules={[
                  {
                    required: true,
                    message: '请选择所属机构',
                  }]}
                >
                  {renderTreeSelect(
                    {
                      placeholder: '请选择所属机构',
                      formName: 'deptId',
                      formType: FormItmeType.TreeSelect,
                      treeSelectData: deptList,
                      value: deptValue,
                      onChange: (id: number) => {
                        setDeptValue(id);
                      },
                      span: 24
                    } as any
                  )}
                </Item>
                <Item label="组别过滤方式" name='groupFilterType'>
                  <Radio.Group onChange={e => setGroupFilterType(e.target.value)} value={groupFilterType} defaultValue={0}>
                    <Radio value={0}>无</Radio>
                    <Radio value={1}>指定</Radio>
                    <Radio value={2}>排除</Radio>
                  </Radio.Group>
                </Item>
                {
                  groupFilterType !== 0 && (
                    <Item label="终端组别" name='groupIds'>
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
                          <Checkbox
                            indeterminate={indeterminate}
                            onChange={onCheckAllChange}
                            checked={checkAll}
                          >
                            全选
                          </Checkbox>
                        {
                          terminalGroupList.length > 0 && (
                            <CheckboxGroup onChange={onChange} value={checkedList}>
                              {
                                terminalGroupList.map(item => {
                                  return (
                                    <Checkbox value={item.id} style={{ marginLeft: 0, marginRight: 8 }}>{item.name}</Checkbox>
                                  )
                                })
                              }
                            </CheckboxGroup>
                          )
                        }
                      </Col>
                    </Item>
                  )
                }
              </>
            )
          }
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