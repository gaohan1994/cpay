/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-08-13 09:36:52 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-09-10 15:49:11
 * 
 * @todo 软件更新任务列表
 */
import React, { useState } from 'react';
import { Form, Table, Tag, Divider, notification, Radio, Modal, Input, DatePicker, Spin, message } from 'antd';
import { useAntdTable } from 'ahooks';
import { formatListResult } from '@/common/request-util';
import { useStore } from '@/pages/common/costom-hooks';
import Forms from '@/component/form';
import { FormItem, FormItmeType } from '@/component/form/type';
import { createTableColumns, getStandardPagination } from '@/component/table';
import history from '@/common/history-util';
import { PlusOutlined, CopyOutlined, BarsOutlined, CaretRightOutlined, PauseOutlined, ScheduleOutlined, SyncOutlined } from '@ant-design/icons';
import { RESPONSE_CODE } from '@/common/config';
import { taskDownloadJobList, taskDownloadJobRemove, taskDownloadJobPublish, taskDownloadJobPause, taskDownloadJobDelay } from './constants/api';
import invariant from 'invariant';
import { getTaskJobStatusColor } from '../common/util';
import moment from 'moment';

type Props = {};

function Page(props: Props) {
  // 请求dept数据
  useStore(['download_job_status']);

  const [selectedRowKeys, setSelectedRowKeys] = useState([] as any[]);  // 选中的列的key值列表
  const [selectedRows, setSelectedRows] = useState([] as any[]);
  const [timeType, setTimeType] = useState(0);
  // 新增编辑弹窗的form
  const [modalForm] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  // 弹窗确定的loading
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();

  const { tableProps, search }: any = useAntdTable(
    (paginatedParams: any, tableProps: any) =>
      taskDownloadJobList({ timeType, jobCopsSign: 0, pageSize: paginatedParams.pageSize, pageNum: paginatedParams.current, ...tableProps }),
    {
      form,
      formatResult: formatListResult,
    }
  );
  const { submit, reset } = search;

  /**
   * @todo 自定义查询，把选中列表置空
   */
  const customSubmit = () => {
    setSelectedRowKeys([]);
    setSelectedRows([]);
    submit();
  }

  /**
   * @todo 自定义重置，把选中列表置空
   */
  const customReset = () => {
    setSelectedRowKeys([]);
    setSelectedRows([]);
    reset();
  }

  /**
   * @todo 跳转到应用审核页面
   * @param item 
   */
  const onDetail = (item: any) => {
    history.push(`/upload/update/detail?id=${item.id}`);
  }

  /**
   * @todo 跳转到编辑页面
   * @param item 
   */
  const onEdit = (item: any) => {
    if (item.status === 7) {
      notification.error({ message: "任务已经结束，不允许修改！" });
      return;
    }
    if (item.status === 2 || item.status === 5 || item.status === 6) {
      notification.error({ message: "任务正在进行中，不允许修改！" });
      return;
    }
    history.push(`/upload/update/edit?id=${item.id}&type=1`);
  }

  /**
   * @todo 删除软件更新任务
   * @param item 
   */
  const onRemove = async (item: any) => {
    Modal.confirm({
      title: '提示',
      content: `确认要删除当前软件更新任务吗?`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          const param = {
            ids: item.id
          }
          setLoading(true);
          const result = await taskDownloadJobRemove(param);
          setLoading(false);
          invariant(result && result.code === RESPONSE_CODE.success, result && result.msg || '删除软件更新任务失败，请重试');
          notification.success({ message: '删除软件更新任务成功!' });
          customSubmit();
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
      align: 'center',
      render: (key, item) => (
        <div>
          <a onClick={() => onDetail(item)}>详情</a>
          <Divider type="vertical" />
          <a onClick={() => onEdit(item)}>修改</a>
          <Divider type="vertical" />
          <a onClick={() => onRemove(item)}>删除</a>
        </div>
      ),
      fixed: 'left',
      width: 150,
    },
    {
      title: '成功',
      dataIndex: 'successCount',
      width: 70,
      render: (item: any) => (<div style={{ color: '#468847' }}>{item}</div>)
    },
    {
      title: '失败',
      dataIndex: 'failureCount',
      width: 70,
      render: (item: any) => (<div style={{ color: '#ce3739' }}>{item}</div>)
    },
    {
      title: '待执行',
      dataIndex: 'executeCount',
      width: 70,
      render: (item: any) => (<div style={{ color: '#8FBC8F' }}>{item}</div>)
    },
    {
      title: '执行中',
      dataIndex: 'executingCount',
      width: 70,
      render: (item: any) => (<div style={{ color: '#32CD32' }}>{item}</div>)
    },
    {
      title: '任务状态',
      dataIndex: 'status',
      dictType: 'download_job_status',
      render: (item: any) => {
        return <Tag color={getTaskJobStatusColor(item)}>{item}</Tag>
      }
    },
    {
      title: '任务名称',
      dataIndex: 'jobName',
    },
    {
      title: '有效起始日期',
      width: 200,
      dataIndex: 'validStartTime',
    },
    {
      title: '有效截止日期',
      width: 200,
      dataIndex: 'validEndTime',
    },
    {
      title: '创建日期',
      width: 200,
      dataIndex: 'createTime',
    },
    {
      title: '创建机构',
      dataIndex: 'deptName',
    }
  ]);

  /**
   * @todo table查询表单
   */
  const forms: FormItem[] = [
    {
      formName: 'jobName',
      placeholder: '任务名称',
      formType: FormItmeType.Normal,
    },
    {
      formName: ['status'],
      formType: FormItmeType.SelectCommon,
      dictList: ['download_job_status'],
    },
  ];

  /**
   * @todo 新增
   */
  const onAdd = () => {
    history.push('/upload/update/add');
  }

  /**
   * @todo 复制
   */
  const onCopy = () => {
    if (selectedRowKeys.length === 0) {
      notification.error({ message: "请选择任务" });
      return;
    }
    if (selectedRowKeys.length > 1) {
      notification.error({ message: "请选择一条任务" });
      return;
    }
    history.push(`/upload/update/copy?id=${selectedRowKeys[0]}&type=0`);
  }

  /**
   * @todo 执行软件更新任务
   */
  const onOperationDetail = () => {
    if (selectedRowKeys.length === 0) {
      notification.error({ message: "请选择任务" });
      return;
    }
    if (selectedRowKeys.length > 1) {
      notification.error({ message: "请选择一条任务" });
      return;
    }
    history.push(`/upload/update/operation?id=${selectedRowKeys[0]}&jobName=${selectedRows[0].jobName}`);
  }

  /**
   * @todo 启动任务
   */
  const onStart = async () => {
    if (selectedRowKeys.length === 0) {
      notification.error({ message: "请选择任务" });
      return;
    }
    if (selectedRowKeys.length > 1) {
      notification.error({ message: "请选择一条任务" });
      return;
    }
    setLoading(true);
    const res = await taskDownloadJobPublish(selectedRowKeys[0]);
    setLoading(false);
    if (res && res.code === RESPONSE_CODE.success) {
      notification.success({ message: '启动任务成功' });
      setSelectedRowKeys([]);
      customSubmit();
    } else {
      notification.error({ message: res && res.msg || '启动任务失败，请重试' });
    }
  }

  /**
   * @todo 暂停任务
   */
  const onPause = async () => {
    if (selectedRowKeys.length === 0) {
      notification.error({ message: "请选择任务" });
      return;
    }
    if (selectedRowKeys.length > 1) {
      notification.error({ message: "请选择一条任务" });
      return;
    }
    setLoading(true);
    const res = await taskDownloadJobPause(selectedRowKeys[0]);
    setLoading(false);
    if (res && res.code === RESPONSE_CODE.success) {
      notification.success({ message: '暂停任务成功' });
      setSelectedRowKeys([]);
      customSubmit();
    } else {
      notification.error({ message: res && res.msg || '暂停任务失败，请重试' });
    }
  }

  /**
   * @todo 任务延时
   */
  const onDelay = () => {
    if (selectedRowKeys.length === 0) {
      notification.error({ message: "请选择任务" });
      return;
    }
    if (selectedRowKeys.length > 1) {
      notification.error({ message: "请选择一条任务" });
      return;
    }
    setModalVisible(true);
    modalForm.setFieldsValue({
      validEndTime: moment(selectedRows[0].validEndTime || ''),
    })
  }

  const extraButtons = [
    { title: '新增', onClick: onAdd, icon: <PlusOutlined />, type: "primary" as any, },
    { title: '复制', onClick: onCopy, icon: <CopyOutlined /> },
    { title: '执行情况', onClick: onOperationDetail, icon: <BarsOutlined /> },
    { title: '启动', onClick: onStart, icon: <CaretRightOutlined />, type: "primary" as any, },
    { title: '暂停', onClick: onPause, icon: <PauseOutlined />, type: "primary" as any, },
    { title: '延时', onClick: onDelay, icon: <ScheduleOutlined /> },
    // { title: '增量同步', onClick: () => { }, icon: <SyncOutlined /> },
  ]

  const onChangeSelectedRows = (selectedRowKeys: any[], selectedRows: any[]) => {
    setSelectedRowKeys(selectedRowKeys);
    setSelectedRows(selectedRows);
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onChangeSelectedRows,
    type: 'radio'
  };

  const renderExtra = () => {
    return (
      <Radio.Group buttonStyle="solid" style={{ float: 'right' }} value={timeType} onChange={e => { setTimeType(e.target.value); customSubmit(); }}>
        <Radio.Button value="1" >当日</Radio.Button>
        <Radio.Button value="7" >近7天</Radio.Button>
        <Radio.Button value="30" >近30天</Radio.Button>
      </Radio.Group>
    )
  }

  const resetExtraParam = () => {
    setTimeType(0);
  }

  /**
   * @todo 控制任务延时的日期选择组件，不能选择比当前截止日期之前的时间
   * @param current 
   */
  function disabledDate(current: any) {
    return current && current < moment(selectedRows[0].validEndTime || 0);
  }

  /**
   * @todo 点击modal的确定按钮调用，任务延时
   */
  const handleOk = async () => {
    const values = await modalForm.validateFields();
    setConfirmLoading(true);
    const fields = modalForm.getFieldsValue();
    let param: any = {
      validEndTime: fields.validEndTime.format('YYYY-MM-DD HH:mm:ss'),
      id: selectedRowKeys[0]
    }
    setLoading(true);
    const res = await taskDownloadJobDelay(param);
    setLoading(false);
    setConfirmLoading(false);
    if (res && res.code === RESPONSE_CODE.success) {
      notification.success({ message: "任务延时成功" });
      handleCancel();
      customSubmit();
    } else {
      notification.error({ message: res && res.msg || "任务延时失败" });
      handleCancel();
    }
  };

  /**
   * @todo 关闭弹窗的时候调用，清空当前修改项、清空modal里的表单、关闭弹窗
   */
  const handleCancel = () => {
    setModalVisible(false);
    customSubmit();
    setSelectedRowKeys([]);
    setSelectedRows([]);
    modalForm.resetFields();
  };

  return (
    <Spin spinning={loading}>
      <Forms
        form={form}
        forms={forms}
        formButtonProps={{
          submit: customSubmit,
          reset: customReset,
          extraButtons,
          renderExtra,
          resetExtra: resetExtraParam
        }}
      />
      <Table
        rowKey="id"
        rowSelection={rowSelection}
        columns={columns}
        {...tableProps}
        scroll={{ x: 1500 }}
        pagination={getStandardPagination(tableProps.pagination)}
      />
      <Modal
        title={'任务延时'}
        cancelText="取消"
        okText="确定"
        visible={modalVisible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Form
          form={modalForm}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
        >
          <Form.Item label="有效截止日期" name='validEndTime' rules={[
            {
              required: true,
              message: '请输入有效截止日期',
            }]}
          >
            <DatePicker
              format="YYYY-MM-DD HH:mm:ss"
              style={{ width: '100%' }}
              showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
              placeholder={'请输入有效截止日期'}
              disabledDate={disabledDate}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Spin>
  );
}
export default Page;

