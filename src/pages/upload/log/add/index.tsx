/*
 * @Author: centerm.gaozhiying
 * @Date: 2020-09-01 13:37:29
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-09-11 17:05:27
 *
 * @todo 提取日志新增页面
 */
import React, { useState, useEffect } from 'react';
import {
  Spin,
  Form,
  Button,
  DatePicker,
  message,
  notification,
  Row,
  Col,
  Input,
  Modal,
  Table,
} from 'antd';
import { useStore } from '@/pages/common/costom-hooks';
import { useFormSelectData } from './costom-hooks';
import { useForm } from 'antd/lib/form/Form';
import {
  CustomFormItems,
  getCustomSelectFromItemData,
} from '@/component/custom-form';
import { CustomFromItem } from '@/common/type';
import moment from 'moment';
import { FormTusns } from '../../component/form-tusns';
import { useQueryParam, formatListResult } from '@/common/request-util';
import { useDetail } from '@/pages/common/costom-hooks/use-detail';
import {
  taskUploadJobDetail,
  taskUploadJobEdit,
  taskUploadJobAdd,
  taskLogSetList,
} from '../../constants/api';
import { merge } from 'lodash';
import { RESPONSE_CODE } from '@/common/config';
import { useHistory } from 'react-router-dom';
import { createTableColumns, getStandardPagination } from '@/component/table';
import { useAntdTable } from 'ahooks';
import FixedFoot, { ErrorField } from '@/component/fixed-foot/index';
import { FormTusnsFailed } from '../../component/form-tusns-failed';

const customFormLayout = {
  labelCol: {
    span: 3,
  },
  wrapperCol: {
    span: 16,
  },
};

const fieldLabels = {
  jobName: '任务名称',
  type: '日志提取方式',
  appCode: '应用包名',
  logFile: '文件路径',
  firmId: '终端厂商',
  terminalType: '终端型号',
  validStartTime: '有效起始日期',
  validEndTime: '有效截止日期',
  logBeginTime: '日志起始日期',
  logEndTime: '日志结束日期',
  tusns: '终端集合',
  fialedTusns: '导入失败集合',
};

export default function Page() {
  const id = useQueryParam('id');
  useStore(['log_upload_type']);
  const [form] = useForm();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [tusnsOptions, setTusnsOptions] = useState([]);
  const [failedTusnsOptions, setFailedTusnsOptions] = useState([]);
  const [selectedRow, setSelectedRow] = useState([] as any[]);
  const [codeVisible, setCodeVisible] = useState(false);
  const [appCode, setAppCode] = useState('');
  const [error, setError] = useState<ErrorField[]>([]);

  const {
    terminalFirmList,
    terminalFirmValue,
    setTerminalFirmValue,
    terminalTypeList,
    terminalTypeValue,
    setTerminalTypeValue,
    logUploadTypeList,
    logUploadTypeValue,
    setLogUploadTypeValue,
  } = useFormSelectData({ ...form.getFieldsValue() }, form);

  const { tableProps, search }: any = useAntdTable(
    (paginatedParams: any, tableProps: any) =>
      taskLogSetList({
        pageSize: paginatedParams.pageSize,
        pageNum: paginatedParams.current,
        ...tableProps,
      }),
    {
      form,
      formatResult: formatListResult,
    }
  );

  /**
   * @todo 获取详情数据
   */
  const { detail } = useDetail(id, taskUploadJobDetail, setLoading);

  const initialValues = merge({}, (detail && detail) || {});

  /**
   * @todo 监听终端集合的改变，设置表单值
   */
  useEffect(() => {
    form.setFieldsValue({ tusns: tusnsOptions.join(';') });
  }, [tusnsOptions]);

  /**
   * @todo 监听详情，设置相应表单数据
   */
  useEffect(() => {
    form.setFieldsValue(initialValues);
    if (typeof detail.type === 'number') {
      form.setFieldsValue({ type: `${detail.type}` });
      setLogUploadTypeValue(`${detail.type}`);
    }
    setTerminalFirmValue(detail.firmId);
    setTerminalTypeValue(detail.terminalType);
    setAppCode(detail.appCode);
    if (detail.logBeginTime) {
      form.setFieldsValue({ logBeginTime: moment(detail.logBeginTime) });
    }
    if (detail.logEndTime) {
      form.setFieldsValue({ logEndTime: moment(detail.logEndTime) });
    }
    if (detail.validStartTime) {
      form.setFieldsValue({ validStartTime: moment(detail.validStartTime) });
    }
    if (detail.validEndTime) {
      form.setFieldsValue({ validEndTime: moment(detail.validEndTime) });
    }
    if (detail.tusns) {
      // 在修改操作时：使用setTimeout是为了保证终端集合是在所有表单设置完以后再执行，
      // 由于获取终端信息是要根据（厂商、终端型号等参数），在终端集合组件
      // 中监听了这些参数的变化，当参数发生改变时把终端集合置空，如果不在
      // 所有表单设置完成后置空终端集合，会导致终端集合设置以后又被置空
      setTimeout(() => {
        setTusnsOptions(detail.tusns.split(','));
      });
    }
  }, [detail]);

  /**
   * @todo 表单数据
   */
  const forms: CustomFromItem[] = [
    {
      label: fieldLabels.jobName,
      key: 'jobName',
      requiredType: 'input' as any,
    },
    {
      ...getCustomSelectFromItemData({
        label: fieldLabels.type,
        key: 'type',
        list: logUploadTypeList,
        valueKey: 'dictValue',
        nameKey: 'dictLabel',
        required: true,
        value: logUploadTypeValue,
        onChange: (id: any) => {
          setLogUploadTypeValue(id);
          form.setFieldsValue({ appCode: undefined });
        },
      }),
    },
    {
      show: logUploadTypeValue === '0',
      label: fieldLabels.appCode,
      key: 'appCode',
      requiredType: 'input' as any,
      render: renderCode,
      ...customFormLayout,
    },
    {
      show: logUploadTypeValue === '1',
      label: fieldLabels.appCode,
      key: 'logFile',
      requiredType: 'input' as any,
      render: renderCode,
      ...customFormLayout,
    },
    {
      ...getCustomSelectFromItemData({
        label: fieldLabels.firmId,
        key: 'firmId',
        value: terminalFirmValue,
        list: terminalFirmList,
        valueKey: 'id',
        nameKey: 'firmName',
        required: true,
        onChange: (id: any) => {
          setTerminalFirmValue(id);
          form.setFieldsValue({ terminalType: undefined });
        },
      }),
    },
    {
      ...getCustomSelectFromItemData({
        label: fieldLabels.terminalType,
        key: 'terminalType',
        list: terminalTypeList,
        valueKey: 'typeCode',
        nameKey: 'typeName',
        required: true,
        value: terminalTypeValue,
        setValue: setTerminalTypeValue,
      }),
    },
    {
      label: fieldLabels.validStartTime,
      key: 'validStartTime',
      render: () => renderDate('请选择有效起始日期', true),
      requiredType: 'select' as any,
    },
    {
      label: fieldLabels.validEndTime,
      key: 'validEndTime',
      render: () => renderDate('请选择有效截止日期', true),
      requiredType: 'select' as any,
    },
    {
      label: fieldLabels.logBeginTime,
      key: 'logBeginTime',
      render: () => renderDate('请选择日志起始日期', false),
      requiredType: 'select' as any,
    },
    {
      label: fieldLabels.logEndTime,
      key: 'logEndTime',
      render: () => renderDate('请选择日志结束日期', false),
      requiredType: 'select' as any,
    },
    {
      label: fieldLabels.tusns,
      key: 'tusns',
      requiredType: 'select',
      render: () => (
        <FormTusns
          options={tusnsOptions}
          setOptions={setTusnsOptions}
          fetchParam={{
            firmId: terminalFirmValue,
            terminalTypeCodes: terminalTypeValue,
          }}
          setFailedOptions={setFailedTusnsOptions}
        />
      ),
    },
    {
      label: fieldLabels.fialedTusns,
      key: 'fialedTusns',
      show: failedTusnsOptions.length > 0,
      render: () => <FormTusnsFailed options={failedTusnsOptions} />,
    },
  ];

  /**
   * @todo 渲染日期组件
   * @param text
   * @param time
   */
  function renderDate(text: string, time?: boolean) {
    if (time) {
      return (
        <DatePicker
          format="YYYY-MM-DD HH:mm:ss"
          style={{ width: '100%' }}
          showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
          placeholder={text}
        />
      );
    } else {
      return (
        <DatePicker
          format="YYYY-MM-DD"
          style={{ width: '100%' }}
          placeholder={text}
        />
      );
    }
  }

  function renderCode() {
    return (
      <Row>
        <Col span={12}>
          <Input value={appCode} />
        </Col>
        <Col span={12}>
          <Button style={{ marginLeft: 10 }} type="primary" onClick={showModal}>
            选择
          </Button>
        </Col>
      </Row>
    );
  }

  const showModal = () => {
    setCodeVisible(true);
  };

  const hideModal = () => {
    setCodeVisible(false);
  };

  const handleOk = () => {
    if (selectedRow.length === 0) {
      message.error('请选择记录');
      return;
    }
    hideModal();
    form.setFieldsValue({
      appCode:
        logUploadTypeValue === '0'
          ? selectedRow[0].appCode
          : selectedRow[0].logUrl,
    });
    setAppCode(
      logUploadTypeValue === '0'
        ? selectedRow[0].appCode
        : selectedRow[0].logUrl
    );
    setSelectedRow([]);
  };

  /**
   * @todo 提交
   */
  const onSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log('Success:', values);
      const fields = form.getFieldsValue();
      if (fields.logBeginTime.diff(fields.logEndTime) >= 0) {
        notification.error({ message: '日志结束日期必须大于日志开始日期' });
        return;
      }

      if (fields.validStartTime.diff(fields.validEndTime) >= 0) {
        notification.error({ message: '有效截止日期必须大于有效起始日期' });
        return;
      }
      let param: any = {
        ...fields,
        logBeginTime: fields.logBeginTime.format('YYYY-MM-DD'),
        logEndTime: fields.logEndTime.format('YYYY-MM-DD'),
        validStartTime: fields.validStartTime.format('YYYY-MM-DD HH:mm:ss'),
        validEndTime: fields.validEndTime.format('YYYY-MM-DD HH:mm:ss'),
      };

      if (logUploadTypeValue === '1') {
        param = {
          ...param,
          appCode: fields.logFile,
        };
        delete param.logFile;
      }
      setLoading(true);
      if (id) {
        param = {
          ...param,
          id,
        };
        const res = await taskUploadJobEdit(param);
        setLoading(false);
        if (res && res.code === RESPONSE_CODE.success) {
          notification.success({ message: '终端提取日志修改成功' });
          history.goBack();
        } else {
          notification.error({
            message: res.msg || '终端提取日志修改失败，请重试',
          });
        }
      } else {
        param = {
          ...param,
        };
        const res = await taskUploadJobAdd(param);
        setLoading(false);
        if (res && res.code === RESPONSE_CODE.success) {
          notification.success({ message: '终端提取日志新增成功' });
          history.goBack();
        } else {
          notification.error({
            message: res.msg || '终端提取日志新增失败，请重试',
          });
        }
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
      setError(errorInfo.errorFields);
    }
  };

  /**
   * @todo 创建table的列
   */
  const columns = createTableColumns([
    {
      title: '应用名称',
      dataIndex: 'appName',
    },
    {
      title: '应用包名',
      dataIndex: 'appCode',
    },
    {
      title: '日志存放路径',
      dataIndex: 'logUrl',
    },
  ]);

  const onChangeSelectedRows = (
    selectedRowKeys: any[],
    selectedRows: any[]
  ) => {
    setSelectedRow(selectedRows);
  };

  const rowSelection = {
    selectedRow,
    onChange: onChangeSelectedRows,
    type: 'radio',
  };

  return (
    <Spin spinning={loading}>
      <div style={{ paddingTop: 10 }}>
        <Form
          form={form}
          className="ant-advanced-search-form"
          style={{ backgroundColor: 'white' }}
        >
          <CustomFormItems items={forms} singleCol={true} />
        </Form>
      </div>
      <Modal
        title={'应用包名选择'}
        cancelText="取消"
        okText="确定"
        visible={codeVisible}
        onOk={handleOk}
        onCancel={hideModal}
        width={'60vw'}
        bodyStyle={{ padding: 0 }}
        getContainer={false}
      >
        <div
          style={{
            height: 400,
            overflow: 'auto',
            overflowX: 'hidden',
            padding: '24px 0px 24px 24px',
          }}
        >
          <Table
            rowKey="id"
            rowSelection={rowSelection}
            columns={columns}
            {...tableProps}
            style={{ overflowX: 'auto', paddingRight: '24px' }}
            scroll={{ x: 1000 }}
            pagination={getStandardPagination(tableProps.pagination)}
          />
        </div>
      </Modal>
      <FixedFoot errors={error} fieldLabels={fieldLabels}>
        <Button type="primary" loading={loading} onClick={onSubmit}>
          提交
        </Button>
        <Button onClick={() => history.goBack()}>返回</Button>
      </FixedFoot>
    </Spin>
  );
}
