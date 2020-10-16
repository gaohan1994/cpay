/**
 * 参数模板详情
 * @Author: centerm.gaohan 
 * @Date: 2020-10-14 11:10:25 
 * @Last Modified by: centerm.gaohan
 * @Last Modified time: 2020-10-16 14:24:57
 */
import React, { useEffect, useState } from 'react';
import { Form, Table, Button, notification, Input, Divider, Card, Modal, Row, Col } from 'antd';
import { useHistory } from 'react-router-dom';
import { useStore } from '@/pages/common/costom-hooks';
import { useSelectorHook, useRedux } from '@/common/redux-util';
import { } from '@/component/form';
import { CustomFormItems } from '@/component/custom-form';
import {
  renderTreeSelect,
  renderSelect,
  renderCommonSelectForm,
  renderSelectForm,
} from '@/component/form/render';
import { } from '../constants';
import { FormItmeType, FormItem } from '@/component/form/type';
import { terminalGroupListByDept, terminalInfoList } from '@/pages/terminal/message/constants/api';
import { ITerminalGroupByDeptId } from '@/pages/terminal/message/types';
import { RESPONSE_CODE } from '@/common/config';
import moment from 'moment';
import invariant from 'invariant';
import FixedFoot from '@/component/fixed-foot';
import {
  terminalTemplateAdd,
  terminalTemplateEditDetail,
  terminalTemplateEdit,
  acquiringList
} from '../constants';
import { formatSearch, formatListResult } from '@/common/request-util';
import Forms from '@/component/form';
import { useAntdTable } from 'ahooks';
import { createTableColumns } from '@/component/table';
import { merge } from 'lodash';
import { UseDictRenderHelper } from '@/component/table/render';

const { TextArea } = Input;

const FormItemLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 14
  }
}

export default (props: any) => {
  const history = useHistory();
  const fields = formatSearch(props.location.search);
  const [form] = Form.useForm();
  const [modalForm] = Form.useForm();
  const { deptTreeList, loading, dictList } = useStore(['acquiring_param_belong_app', 'acquiring_param_type', 'acquiring_param_template_type']);
  const [error, setError] = useState<any[]>([]);
  const isEdit = !!fields.id;

  // 用户选择的app类型
  const [selectedApp, setSelectedApp] = useState('');
  // 选择参数的modal visible
  const [visible, setVisible] = useState(false);
  // 选择参数的keys
  const [selectedRowKeys, setSelectedRowKeys] = useState([] as any[]);
  // 用户展示在外层的参数要注意去重
  const [selectedParams, setSelectedParams] = useState([] as any[]);

  // 选择参数
  const { tableProps, search }: any = useAntdTable(
    (paginatedParams: any, tableProps: any) =>
      acquiringList({
        pageSize: paginatedParams.pageSize,
        pageNum: paginatedParams.current,
        ...tableProps,
      }),
    {
      form: modalForm,
      formatResult: formatListResult,
    }
  );
  const { submit, reset } = search;

  useEffect(() => {
    if (!!isEdit) {
      terminalTemplateEditDetail({ id: fields.id })
        .then(result => {
          if (result.code === RESPONSE_CODE.success) {
            form.setFieldsValue({ ...result.data });
            setSelectedParams(result.data.terminalAcquiringParamList);
          }
        })
        .catch(errorInfo => {
          errorInfo.message && notification.warn({ message: errorInfo.message });
        })
    }
  }, [isEdit]);

  const onFinish = async () => {
    try {
      const values = await form.validateFields();
      invariant(selectedParams.length > 0, '请添加模板参数');
      const fetchUrl = isEdit ? terminalTemplateEdit : terminalTemplateAdd;
      const payload = {
        ...values,
        ...isEdit ? { id: fields.id } : {},
        acquiringParamIds: selectedParams.map((item) => item.id).join(',')
      };

      const result = await fetchUrl(payload)
      invariant(result.code === RESPONSE_CODE.success, result.msg || ' ');
      notification.success({ message: isEdit ? '修改成功！' : '新增成功！' });
      history.goBack();
    } catch (errorInfo) {
      errorInfo.message && notification.warn({ message: errorInfo.message });
      errorInfo.errorFields && setError(errorInfo.errorFields);
    }
  }

  // 打开params modal
  const onAddParams = () => {
    setVisible(true);
  }

  // 选择好了参数
  const onAddParamsOk = () => {
    try {
      invariant(selectedRowKeys.length > 0, '请选择要添加的参数');
      // 这里要去重
      if (selectedParams.length === 0) {
        setSelectedParams(selectedRowKeys);
        setVisible(false);
        return;
      }
      let hash: any = {};
      const nextSelectedParams: any[] = merge([], selectedParams, selectedRowKeys);
      nextSelectedParams.reduce((prevList, currentItem) => {
        console.log('prevList', prevList);
        if (!hash[currentItem.id]) {
          hash[currentItem.id] = true;
          prevList.push(currentItem)
        }
        return prevList;
      }, []);
      console.log('nextSelectedParams', nextSelectedParams);
      setSelectedParams(nextSelectedParams);
      setVisible(false);
    } catch (error) {
      notification.warn({ message: error.message });
    }
  }

  const onDeleteParam = (index: number) => {
    const newList: any[] = merge([], selectedParams);
    newList.splice(index, 1)
    setSelectedParams(newList);
  }

  const forms: any[] = !loading ? [
    {
      label: '参数模板名称',
      key: 'templateName',
      placeholder: '请输入参数模板名称',
      requiredText: '请输入参数模板名称',
    },
    {
      label: '适用机构',
      key: 'deptId',
      requiredType: 'select',
      render: () =>
        renderTreeSelect({
          placeholder: '请选择所属机构',
          formName: 'deptId',
          formType: FormItmeType.TreeSelect,
          treeSelectData: deptTreeList,
          span: 24,
        } as any),
    },
    {
      label: '模板类型',
      key: 'templateType',
      requiredText: '请选择参数模板名称',
      render: () =>
        renderCommonSelectForm({
          formName: 'templateType',
          formType: FormItmeType.SelectCommon,
          dictList: 'acquiring_param_template_type'
        }, false)
    },
    {
      label: '适用应用名称',
      key: 'applicableAppType',
      requiredText: '请选择适用应用名称',
      render: () =>
        renderCommonSelectForm({
          formName: 'applicableAppType',
          formType: FormItmeType.SelectCommon,
          dictList: 'acquiring_param_belong_app',
          onChange: (value) => {
            setSelectedApp(value);
          }
        }, false)
    },
    {
      label: '备注',
      key: 'remark',
      placeholder: '请输入备注',
      requiredText: '请输入备注',
      render: () => {
        return <TextArea rows={5} />
      }
    },
  ] : [];

  let fieldLabels: any = {};
  forms.forEach((item) => {
    fieldLabels[item.key] = item.label
  });


  // 选择参数的form相关配置

  /**
   * @todo table查询表单
   */
  const paramsForms: FormItem[] = [
    {
      formName: 'paramCode',
      formType: FormItmeType.Normal,
      placeholder: '参数编号',
    },
    {
      formName: 'paramName',
      formType: FormItmeType.Normal,
      placeholder: '参数名称',
    },
  ];

  const columns = createTableColumns([
    {
      title: '应用类型',
      dataIndex: 'applicableAppType',
      dictType: 'acquiring_param_belong_app',
    },
    {
      title: '参数编号',
      dataIndex: 'paramCode',
    },
    {
      title: '参数名称',
      dataIndex: 'paramName',
    },
    {
      title: '参数类型',
      dataIndex: 'paramType',
      dictType: 'acquiring_param_type'
    },
    {
      title: '参数值',
      render: (item) => {
        return (
          <span>
            {item.paramValueText || item.paramValueInt || item.paramValueFloat || item.paramValueDate || item.paramValueEnum || '--'}
          </span>
        )
      }
    },
  ])

  const rowSelection = {
    selectedRowKeys: selectedRowKeys.map((item) => item.id),
    onChange: (keys: any, rows: any) => {
      setSelectedRowKeys(rows);
    },
  }

  const paramItemForm: any[] = [
    {
      label: '应用类型',
      key: 'applicableAppType',
      render: (item: any) => {
        const targetDict = dictList.acquiring_param_belong_app;
        const targetDictItem =
          targetDict &&
          targetDict.data &&
          targetDict.data.find((dictItem) => dictItem.dictValue === String(item.applicableAppType));
        return <Input value={targetDictItem?.dictLabel} />
      }
    },
    {
      label: '参数编号',
      key: 'paramCode',
    },
    {
      label: '参数名称',
      key: 'paramName',
    },
    {
      label: '参数类型',
      key: 'paramType',
      render: (item: any) => {
        const targetDict = dictList.acquiring_param_type;
        const targetDictItem =
          targetDict &&
          targetDict.data &&
          targetDict.data.find((dictItem) => dictItem.dictValue === String(item.paramType));
        return <Input value={targetDictItem?.dictLabel} />
      }
    },
    {
      label: '参数值',
      key: '',
      render: (item: any) => {
        return (
          <Input value={item.paramValueText || item.paramValueInt || item.paramValueFloat || item.paramValueDate || item.paramValueEnum || '--'} />
        )
      }
    },
  ];

  return (
    <div style={{ paddingBottom: 100 }}>
      <Form form={form}>
        <Divider orientation="left">【参数模板信息】</Divider>
        <CustomFormItems items={forms} />
        <Button
          type="primary"
          onClick={onAddParams}
        >
          新增参数
        </Button>
        {selectedParams.map((param, index) => {
          return (
            <Card
              key={`softInfo${index}`}
              title={`参数${index + 1}`}
              bordered={true}
              style={{ marginTop: 10 }}
              extra={
                <Button onClick={() => onDeleteParam(index)}>
                  删除
                </Button>
              }
            >
              <Row gutter={24}>
                {
                  paramItemForm.map(item => {
                    const { label, key, render } = item;
                    return (
                      <Col span={12} key={key} style={{ marginBottom: 5 }}>
                        <Row gutter={24}>
                          <Col span={6}>
                            <div style={{ textAlign: 'right' }}>{label}</div>
                          </Col>

                          <Col span={14}>
                            {render ? render(param) : <Input value={param[key]} />}
                          </Col>
                        </Row>
                      </Col>
                    )
                  })
                }
              </Row>
            </Card>
          )
        })}
      </Form>

      <Modal
        title='参数选择'
        cancelText="取消"
        okText="确定"
        visible={visible}
        onOk={onAddParamsOk}
        onCancel={() => setVisible(false)}
        width={'80vw'}
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
          <Forms
            form={modalForm}
            forms={paramsForms}
            formButtonProps={{
              submit,
              reset,
            }}
          />
          <Table
            rowKey="id"
            rowSelection={rowSelection}
            columns={columns}
            {...tableProps}
            style={{ overflowX: 'auto', paddingRight: '24px' }}
          />
        </div>
      </Modal>

      <FixedFoot errors={error} fieldLabels={fieldLabels}>
        <Button type="primary" onClick={onFinish}>
          提交
        </Button>
        <Button onClick={() => history.goBack()}>返回</Button>
      </FixedFoot>
    </div>
  )
}