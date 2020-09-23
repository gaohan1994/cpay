/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-09-22 16:44:21 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-09-22 17:41:20
 * 
 * @todo 通知公告新增页面
 */
import React, { useState, useEffect } from 'react';
import { Spin, Form, Button, Radio, notification } from 'antd';
import { CustomFormItems, getCustomSelectFromItemData } from '@/component/custom-form';
import FixedFoot, { ErrorField } from '@/component/fixed-foot';
import history from '@/common/history-util';
import { useForm } from 'antd/lib/form/Form';
import { useStore } from '@/pages/common/costom-hooks';
import { useSelectorHook } from '@/common/redux-util';
import 'braft-editor/dist/index.css';
import BraftEditor from 'braft-editor';
import { useQueryParam } from '@/common/request-util';
import { systemNoticeEdit, systemNoticeAdd, systemNoticeEdits } from '../constants/api';
import invariant from 'invariant';
import { RESPONSE_CODE } from '@/common/config';
import { useDetail } from '@/pages/common/costom-hooks/use-detail';
import { merge } from 'lodash';

const customFormLayout = {
  labelCol: {
    span: 3
  },
  wrapperCol: {
    span: 14
  }
}


const fieldLabels = {
  noticeTitle: '公告标题',
  noticeType: '公告类型',
  noticeContent: '公告内容',
  status: '公告状态',
}

export default function Page() {
  useStore(['sys_notice_type', 'sys_normal_disable']);
  const dictList = useSelectorHook(state => state.common.dictList);
  const id = useQueryParam('id');

  const [loading, setLoading] = useState(false);
  const [form] = useForm();
  const [error, setError] = useState<ErrorField[]>([]);
  const [noticeContent, setNoticeContent] = useState('');
  const [editorState, setEditorState] = useState();

  const { detail } = useDetail(id, systemNoticeEdits, setLoading);

  const initialValues = merge(
    {},
    (detail && detail) || {}
  );

  useEffect(() => {
    form.setFieldsValue(initialValues);
    setEditorState(BraftEditor.createEditorState(initialValues.noticeContent));
    setNoticeContent(initialValues.noticeContent);
  }, [detail]);

  const handleChange = (editorStateP: any) => {
    setNoticeContent(editorStateP.toHTML());
    setEditorState(editorStateP)
  }

  const forms = [
    {
      label: fieldLabels.noticeTitle,
      key: 'noticeTitle',
      requiredType: 'input' as any,
    },
    {
      ...getCustomSelectFromItemData({
        label: fieldLabels.noticeType,
        key: 'noticeType',
        list: dictList.sys_notice_type && dictList.sys_notice_type.data || [],
        valueKey: 'dictValue',
        nameKey: 'dictLabel',
        required: true,
      })
    },
    {
      label: fieldLabels.noticeContent,
      key: 'noticeContent',
      // requiredType: 'input' as any,
      render: () => <div className="editor-wrapper" style={{ border: '1px solid #d9d9d9' }}>
        <BraftEditor
          value={editorState}
          onChange={handleChange}
        />
      </div>
    },
    {
      label: fieldLabels.status,
      key: 'status',
      render: () => <Radio.Group defaultValue={'0'}>
        {
          dictList && dictList.sys_normal_disable && dictList.sys_normal_disable.data.map(item => {
            return (
              <Radio value={item.dictValue} key={item.dictLabel}>{item.dictLabel}</Radio>
            )
          })
        }
      </Radio.Group>
    },
  ]

  const onSubmit = async () => {
    try {
      await form.validateFields();
      const fields = form.getFieldsValue();
      let param: any = {
        ...fields,
        noticeContent,
        status: typeof fields.status !== 'undefined' ? fields.status : '0'
      }
      setLoading(true);
      if (id) {
        param = {
          ...param,
          noticeId: id,
        }
        const result = await systemNoticeEdit(param);
        setLoading(false);
        invariant(result.code === RESPONSE_CODE.success, result.msg || '修改失败！');
        notification.success({ message: '修改成功！' });
        history.goBack();
      } else {
        const result = await systemNoticeAdd(param);
        setLoading(false);
        invariant(result.code === RESPONSE_CODE.success, result.msg || '新增失败！');
        notification.success({ message: '新增成功！' });
        history.goBack();
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
      if (errorInfo.errorFields) {
        setError(errorInfo.errorFields);
      }
      if (errorInfo.message) {
        notification.error({ message: errorInfo.message });
      }
    }
  }

  return (
    <Spin spinning={loading}>
      <div style={{ paddingTop: 10 }}>
        <Form
          form={form}
          className="ant-advanced-search-form"
          style={{ backgroundColor: 'white' }}
        >
          <CustomFormItems items={forms} singleCol={true} customFormLayout={customFormLayout} />
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