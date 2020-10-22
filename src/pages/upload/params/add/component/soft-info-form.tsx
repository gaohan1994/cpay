/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-09-01 14:35:11 
 * @Last Modified by: centerm.gaohan
 * @Last Modified time: 2020-10-19 16:16:38
 * 
 * @todo 软件信息表单
 */
import React, { useEffect, useState } from 'react';
import { Form, message, Input, Switch } from 'antd';
import { CustomFormItems, getCustomSelectFromItemData } from '@/component/custom-form';
import { FormInstance } from 'antd/lib/form';
import { useStore } from '@/pages/common/costom-hooks';
import { getDictText } from '@/pages/common/util';
import { useFormSelectedList, useSoftVersionList } from '@/pages/common/costom-hooks/form-select';
import { terminalTemplateList } from '@/pages/terminal/template/constants/index'

interface Props {
  form: FormInstance;
}
export function SoftInfoItem(props: Props) {
  const { deptList, loading } = useStore(['acquiring_param_belong_app', 'acquiring_param_template_type']);
  const [templateIdValue, setTemplateIdValue] = useState<string>('')
  const {list: templateInfoList} = useFormSelectedList(terminalTemplateList, [], {})
  const { form } = props;
  const initValue = form.getFieldsValue();

  useEffect(() => {
    if(loading) {
      return
    }
    if (!initValue.paramTemplateId) {
      form.resetFields()
      return
    }    
    setTemplateIdValue(`${initValue.paramTemplateId}`)
  }, [initValue, loading]);

  useEffect(() => {
    const info = templateInfoList.find(item => `${item.id}` === templateIdValue)
    if(!info) {
      return
    }
    form.setFieldsValue({
      id: info.id,
      deptName: deptList.find(item => item.id === info.deptId)?.name || '',
      templateType: getDictText(info.templateType, 'acquiring_param_template_type'),
      applicableAppName: getDictText(info.applicableAppType, 'acquiring_param_belong_app')
    })
    
  }, [templateIdValue, loading ])

  const softInfoForms = [
    {
      ...getCustomSelectFromItemData({
        label: '参数模板名称',
        key: 'paramTemplateId',
        list: templateInfoList,
        value: templateIdValue,
        valueKey: 'id',
        nameKey: 'templateName',
        onChange: (id: string) => {
          if(!id) {
            form.resetFields();
            return
          }
          setTemplateIdValue(`${id}`)
        },
        required: true
      })
    },
    {
      label: '参数模板编号',
      key: 'id',
      render: () => <Input disabled />
    },
    {
      label: '适用机构',
      key: 'deptName',
      render: () => <Input disabled />
    },
    {
      label: "模板类型",
      key: "templateType",
      render: () => <Input disabled />
    },
    {
      label: '适用应用名称',
      key: 'applicableAppName',
      render: () => <Input disabled />
    },
  ];



  return (
    <Form form={form}>
      <CustomFormItems items={softInfoForms} />
    </Form>
  )
}