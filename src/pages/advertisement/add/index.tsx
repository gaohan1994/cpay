/**
 * 广告新增
 * @Author: centerm.gaohan 
 * @Date: 2020-10-13 09:44:55 
 * @Last Modified by: centerm.gaohan
 * @Last Modified time: 2020-10-14 11:45:35
 */
import React, { useEffect, useState } from 'react';
import { Form, DatePicker, Button, notification, Input } from 'antd';
import { useHistory } from 'react-router-dom';
import { useStore } from '@/pages/common/costom-hooks';
import { useSelectorHook } from '@/common/redux-util';
import { } from '@/component/form';
import { CustomFormItems } from '@/component/custom-form';
import {
  renderTreeSelect,
  renderSelect,
  renderCommonSelectForm,
  renderSelectForm,
} from '@/component/form/render';
import { advertAdd } from '../constants/api';
import { FormItmeType } from '@/component/form/type';
import { terminalGroupListByDept } from '@/pages/terminal/message/constants/api';
import { ITerminalGroupByDeptId } from '@/pages/terminal/message/types';
import { RESPONSE_CODE } from '@/common/config';
import { AdvertisementDetail } from '../types';
import moment from 'moment';
import invariant from 'invariant';
import {
  terminalFirmList as getTerminalFirmList,
  terminalTypeListByFirm as getTerminalTypeListByFirm,
} from '@/pages/terminal/constants';
import FixedFoot from '@/component/fixed-foot';

const { TextArea } = Input;

export default () => {
  const history = useHistory();
  const [form] = Form.useForm();
  useStore(['advert_file_type', 'advert_type', 'advert_device_screen_type']);
  const common = useSelectorHook((state) => state.common);

  const initState = {
    deptId: -1 as number,
    groupData: [] as ITerminalGroupByDeptId[], // 终端组别列表
    advertisement: {} as AdvertisementDetail,
  };
  const [error, setError] = useState<any[]>([]);
  const [deptId, setDeptId] = useState(initState.deptId);
  const [groupData, setTerminalGroupList] = useState(initState.groupData);
  const [terminalFirmList, setTerminalFirmList] = useState([] as any[]);
  const [firmValue, setFirmValue] = useState('');

  const [terminalFirmTypeList, setTerminalFirmTypeList] = useState([] as any[]);

  useEffect(() => {
    getTerminalFirmList({}, setTerminalFirmList)
  }, []);

  useEffect(() => {
    // 终端厂商变化导致终端型号要变
    if (firmValue !== '') {
      form.setFieldsValue({ terminalTypes: '' });
      onFirmLoadData(firmValue);
    }
  }, [firmValue]);

  const onFirmLoadData = (firmId: string) => {
    getTerminalTypeListByFirm({ firmId: firmId }, (data) => {
      setTerminalFirmTypeList(data);
    });
  };

  useEffect(() => {
    // 请求组别
    terminalGroupListByDept(deptId, (groupData) => {
      setTerminalGroupList(groupData);
    });
  }, [deptId]);

  const onFinish = async () => {
    try {
      const values = await form.validateFields();
      const payload: Partial<AdvertisementDetail> = {
        ...values,
        startTime: values.startTime.format('YYYY-MM-DD HH:mm:ss'),
        endTime: values.endTime.format('YYYY-MM-DD HH:mm:ss'),
      };
      console.log('values:', payload);
      const result = await advertAdd(payload);
      invariant(result.code === RESPONSE_CODE.success, result.msg || ' ');
      notification.success({ message: '新增广告成功！' });
      history.goBack();
    } catch (error) {
      error.message && notification.warn({ message: error.message });
    }
  };

  const onDeptChange = (deptId: number) => {
    console.log('deptId: ', deptId);
    form.setFieldsValue({ groupId: '' });
    setDeptId(deptId);
  };

  const forms: any[] = [
    {
      label: '名称',
      key: 'adName',
      requiredText: '请输入名称',
    },
    {
      label: '终端厂商',
      requiredText: '请选择终端厂商',
      placeholder: '终端厂商',
      render: () => {
        return renderSelectForm(
          {
            formName: 'firmId',
            formType: FormItmeType.Select,
            selectData: terminalFirmList &&
              terminalFirmList.map((item) => {
                return {
                  value: `${item.id}`,
                  title: `${item.firmName}`,
                };
              }),
            onChange: (firmId: any) => {
              setFirmValue(firmId);
            },
          },
          false
        )
      },
      key: 'firmId',
    },
    {
      label: '终端型号',
      requiredText: '请选择终端型号',
      placeholder: '终端型号',
      render: () => {
        return renderSelectForm(
          {
            formName: 'terminalTypes',
            formType: FormItmeType.Select,
            selectData:
              terminalFirmTypeList &&
              terminalFirmTypeList.map((item) => {
                return {
                  value: `${item.typeCode}`,
                  title: `${item.typeName}`,
                };
              }),
          },
          false
        )
      },
      key: 'terminalTypes',
    },
    {
      label: '有效起始时间',
      key: 'startTime',
      requiredText: '请选择起始时间',
      render: () => (
        <DatePicker
          format="YYYY-MM-DD HH:mm:ss"
          showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
          style={{ width: '100%' }}
          placeholder="请选择有效起始日期"
        />
      ),
    },
    {
      label: '有效结束时间',
      key: 'endTime',
      requiredText: '请选择结束时间',
      render: () => (
        <DatePicker
          format="YYYY-MM-DD HH:mm:ss"
          style={{ width: '100%' }}
          showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
          placeholder="请选择有效截止日期"
        />
      ),
    },
    {
      label: '机构名称',
      key: 'deptId',
      requiredType: 'select',
      render: () =>
        renderTreeSelect({
          placeholder: '请选择所属机构',
          formName: 'deptId',
          formType: FormItmeType.TreeSelect,
          treeSelectData: common?.deptTreeData,
          span: 24,
          onChange: onDeptChange,
        } as any),
    },
    {
      label: '组别名称',
      key: 'groupId',
      requiredType: 'select',
      requiredText: '请选择组别',
      render: () =>
        renderSelect({
          formName: 'groupId',
          span: 24,
          selectData:
            (groupData &&
              groupData.map((item) => {
                return {
                  title: item.name,
                  value: item.id,
                } as any;
              })) ||
            [],
          formType: FormItmeType.Select,
        }),
    },
    {
      label: '广告类型',
      key: 'type',
      requiredText: '请选择广告类型',
      render: () =>
        renderCommonSelectForm(
          {
            formName: 'type',
            formType: FormItmeType.SelectCommon,
            dictList: 'advert_type',
          },
          false
        ),
    },
    {
      label: '广告文件类型',
      key: 'adFileType',
      requiredText: '请选择广告类型',
      render: () =>
        renderCommonSelectForm(
          {
            formName: 'adFileType',
            formType: FormItmeType.SelectCommon,
            dictList: 'advert_file_type',
          },
          false
        ),
    },
    {
      label: '广告营销说明',
      key: 'description',
      requiredText: '请输入广告营销说明',
      render: () => {
        return (
          <TextArea />
        )
      }
    },
  ];

  let fieldLabels: any = {};
  forms.map((item) => {
    fieldLabels[item.key] = item.label
  });
  return (
    <div>
      <Form form={form}>
        <CustomFormItems items={forms} singleCol={true} />
      </Form>
      <FixedFoot errors={error} fieldLabels={fieldLabels}>
        <Button type="primary" onClick={onFinish}>
          提交
        </Button>
        <Button onClick={() => history.goBack()}>返回</Button>
      </FixedFoot>
    </div>
  );
};
