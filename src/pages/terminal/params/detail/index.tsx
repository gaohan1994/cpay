import React, { useState, useEffect, useRef } from 'react';
import {
  Divider,
  Form,
  Button,
  Skeleton,
  Col,
  notification,
  Row,
  Spin,
  Input,
  Switch,
} from 'antd';
import { merge } from 'lodash';
import { useHistory } from 'react-router-dom';
import { useQueryParam } from '@/common/request-util';
import { useDetail } from './costom-hooks';
import BaseParam from './component/base-param';
import DeptParam from './component/dept-param';
import { DetailType } from '../types';
import './component/index.scss';
import invariant from 'invariant';
import { useStore } from '@/pages/common/costom-hooks';
import { TerminalParamItem } from '@/pages/terminal/params/types';
import { ITerminalParams } from './types';
import { useSelectorHook } from '@/common/redux-util';
import { terminalParamUpdate } from './constants';
import { RESPONSE_CODE } from '@/common/config';
import {
  CustomFormItems,
  getCustomSelectFromItemData,
} from '@/component/custom-form';
import { CustomFromItem } from '@/common/type';
import FixedFoot, { ErrorField } from '@/component/fixed-foot';
import { renderTreeSelect, renderSelect } from '@/component/form/render';
import { FormItmeType } from '@/component/form/type';
import { getFormCommonRules } from '@/pages/common/util';
import { terminalGroupListByDept } from '../../message/constants/api';
import { ITerminalGroupByDeptId } from '../../message/types';

const { TextArea } = Input;

type InitialValues = {
  base: ITerminalParams;
  dept: TerminalParamItem;
};

const FormItemLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 12,
  },
};

const prefix = 'terminal-params-component-detail';

const fieldLabels = {
  deptId: '所属机构',
  groupId: '所属组别',
  htIntvl: '心跳时间',
  reHtIntvl: '心跳重连次数',
  fileTraTimeout: '文件传输超时时间(秒)',
  reDownNum: '文件下载重试次数',
  upFlowIntvl: '流量上送间隔时间(分)',
  upInfoIntvl: '信息上送间隔时间(分)',
  mapPswd: '运维口令',
  managePwd: '管理口令',
  fileDownloadHtval: '文件下载间隔时间(秒)',
  broadcastTime: '广播间隔时间(秒)',
  locationIntvl: '定位服务时间间隔(分)',
  isWifi: '仅在WIFI下通讯',
  systemUpdateRequiredPower: '系统更新电量阀值(%)',
  appUpdateRequiredPower: '应用更新电量阀值(%)',
  sysUpRequiresNoOperTime: '系统更新闲置时间(秒)',
  appUpRequiresNoOperTime: '应用更新闲置时间(秒)',
  tmsDomainName: '终端运维服务地址',
  tmsDomainNameBakFirst: '终端运维服务地址-备机1',
  tmsDomainNameBakSecond: '终端运维服务地址-备机2',
  amsDomainName: '应用商店服务地址',
};

/**
 * 终端参数设置
 */
export default () => {
  const id = useQueryParam('id');
  const type = useQueryParam('type');
  const buttonRef: any = useRef(null);
  const history = useHistory();
  const [form] = Form.useForm();
  const dictRes = useStore([]);

  const common = useSelectorHook((state) => state.common);
  const [error, setError] = useState<ErrorField[]>([]);
  const [buttonPostion, setButtonPostion] = useState(0);

  const [loading, setLoading] = useState(false);
  const { terminalParams } = useDetail(id, type, setLoading);
  const [dictLoading, setDictLoading] = useState(true);
  const [deptTreeData, setDeptTreeData] = useState([] as any[]);
  const [isWifi, setIsWifi] = useState('0');

  const [switchDept, setSwitchDept] = useState(type === 'EDIT' ? false : true);
  const [switchAddress, setSwitchAddress] = useState(
    type === 'ADD' ? true : false
  );
  const [infoList, setInfoList] = useState('');

  /**
   * 表单数据
   */
  const [deptId, setDeptId] = useState(-1);
  const [groupId, setGroupId] = useState(-1);
  const [terminalGroup, setTerminalGroup] = useState(
    [] as ITerminalGroupByDeptId[]
  );

  /**
   * 字段数据加载状态
   */
  useEffect(() => {
    setDictLoading(dictRes.loading);
  }, [dictRes.loading]);

  useEffect(() => {
    setDeptTreeData(common.deptTreeData);
  }, [common]);

  useEffect(() => {
    setButtonPostion(buttonRef.current?.clientWidth);
  }, [buttonRef.current]);

  /**
   * @todo 根据机构id获取终端组别
   */
  useEffect(() => {
    if (deptId === -1) {
      return;
    }
    terminalGroupListByDept(Number(deptId), (groupData) => {
      setTerminalGroup(groupData);
      const currentGroup = groupData.find((g) => `${g.id}` === `${groupId}`);
      if (!currentGroup) {
        setGroupId(-1);
        form.setFieldsValue({ groupId: '' });
      }
    });
  }, [deptId, groupId]);

  useEffect(() => {
    if (dictLoading) {
      return;
    }
    if (!terminalParams.terminalParam) {
      return;
    }
    /**
     * 除了所属机构和所属组别在 terminalParams.terminalParam
     * 其他数据均在 terminalParams.params
     */
    console.log('terminalParams', terminalParams);
    setGroupId(terminalParams.terminalParam.groupId);
    setDeptId(terminalParams.terminalParam.deptId);
    setInfoList(terminalParams.params.infoList);
    setIsWifi(terminalParams.params.isWifi);

    form.setFieldsValue({
      deptId: terminalParams.terminalParam.deptId,
      groupId: terminalParams.terminalParam.groupId,
      reHtIntvl: terminalParams.params.reHtIntvl,
      htIntvl: terminalParams.params.htIntvl,
      fileTraTimeout: terminalParams.params.fileTraTimeout,
      reDownNum: terminalParams.params.reDownNum,
      upFlowIntvl: terminalParams.params.upFlowIntvl,
      upInfoIntvl: terminalParams.params.upInfoIntvl,
      mapPswd: terminalParams.params.mapPswd,
      managePwd: terminalParams.params.managePwd,
      fileDownloadHtval: terminalParams.params.fileDownloadHtval,
      broadcastTime: terminalParams.params.broadcastTime,
      locationIntvl: terminalParams.params.locationIntvl,
      isWifi: terminalParams.params.isWifi,
      systemUpdateRequiredPower:
        terminalParams.params.systemUpdateRequiredPower,
      appUpdateRequiredPower: terminalParams.params.appUpdateRequiredPower,
      sysUpRequiresNoOperTime: terminalParams.params.sysUpRequiresNoOperTime,
      appUpRequiresNoOperTime: terminalParams.params.appUpRequiresNoOperTime,
      tmsDomainName: terminalParams.params.tmsDomainName,
      tmsDomainNameBakFirst: terminalParams.params.tmsDomainNameBakFirst,
      tmsDomainNameBakSecond: terminalParams.params.tmsDomainNameBakSecond,
      amsDomainName: terminalParams.params.amsDomainName,
    });
  }, [terminalParams, dictLoading]);

  const initToken = type === DetailType.ADD ? true : !loading;

  const formatParamsContent = (base: ITerminalParams) => {
    const mergeBase: any = merge({}, base);
    if (mergeBase.deptId) {
      delete mergeBase.deptId;
    }
    if (mergeBase.groupId) {
      delete mergeBase.groupId;
    }
    const baseParams: ITerminalParams = {
      ...mergeBase,
      infoList: base.infoList
        .split(/[\s\n]/)
        .filter((t) => !!t)
        .join('\n'),
    };
    return JSON.stringify(baseParams);
  };

  /**
   * 格式化
   * 1.遇到空格格式化
   * 2.遇到换行符格式化
   */
  const formatInfoList = () => {
    const formatList = infoList.split(/[\s\n]/).filter((t) => !!t);
    setInfoList(formatList.join(`\n`));
  };

  const onFinish = async () => {
    try {
      const values: any = await form.validateFields();
      const payload = {
        deptId: values.deptId,
        groupId: values.groupId,
        paramContent: formatParamsContent({ ...values, infoList: infoList }),
        ...(type === DetailType.EDIT ? { id } : {}),
      };
      console.log('payload', payload);
      setLoading(true);
      const result = await terminalParamUpdate(type, payload);
      setLoading(false);
      invariant(result.code === RESPONSE_CODE.success, result.msg || ' ');
      notification.success({ message: '操作成功！' });
      history.goBack();
    } catch (error) {
      notification.warn({ message: error.message });
    }
  };

  const deptForms: CustomFromItem[] = [
    {
      label: fieldLabels.deptId,
      key: 'deptId',
      requiredType: 'select',
      render: () =>
        renderTreeSelect({
          disabled: !switchDept,
          placeholder: '请选择所属机构',
          formName: 'deptId',
          formType: FormItmeType.TreeSelect,
          treeSelectData: deptTreeData,
          value: deptId,
          onChange: (id: number) => {
            setDeptId(id);
          },
          span: 24,
        } as any),
    },
    {
      label: fieldLabels.groupId,
      key: 'groupId',
      requiredType: 'select',
      render: () =>
        // getCustomSelectFromItemData({})
        renderSelect({
          disabled: !switchDept,
          placeholder: '请选择组别',
          formName: 'groupId',
          formType: FormItmeType.Select,
          selectData:
            (terminalGroup &&
              terminalGroup.map((group) => {
                return {
                  title: `${group.name}`,
                  value: group.id,
                } as any;
              })) ||
            [],
          value: groupId,
          onChange: (id: number) => {
            setGroupId(id);
          },
          span: 24,
        }),
    },
  ];

  const formItems1: CustomFromItem[] = [
    {
      label: fieldLabels.htIntvl,
      key: 'htIntvl',
      requiredType: 'input',
    },
    {
      label: fieldLabels.reHtIntvl,
      key: 'reHtIntvl',
      requiredType: 'input',
    },
    {
      label: fieldLabels.fileTraTimeout,
      key: 'fileTraTimeout',
      requiredType: 'input',
    },
    {
      label: fieldLabels.reDownNum,
      key: 'reDownNum',
      requiredType: 'input',
    },
    {
      label: fieldLabels.upFlowIntvl,
      key: 'upFlowIntvl',
      requiredType: 'input',
    },
    {
      label: fieldLabels.upInfoIntvl,
      key: 'upInfoIntvl',
      requiredType: 'input',
    },
    {
      label: fieldLabels.mapPswd,
      key: 'mapPswd',
      requiredType: 'input',
    },
    {
      label: fieldLabels.managePwd,
      key: 'managePwd',
      requiredType: 'input',
    },
    {
      label: fieldLabels.fileDownloadHtval,
      key: 'fileDownloadHtval',
      requiredType: 'input',
    },
    {
      label: fieldLabels.broadcastTime,
      key: 'broadcastTime',
      requiredType: 'input',
    },
    {
      label: fieldLabels.locationIntvl,
      key: 'locationIntvl',
      requiredType: 'input',
    },
    {
      label: fieldLabels.isWifi,
      key: 'isWifi',
      render: () => (
        <Switch
          checked={isWifi === '1' ? true : false}
          onChange={(checked) => setIsWifi(!!checked ? '1' : '0')}
        />
      ),
    },
  ];

  const formItems2: CustomFromItem[] = [
    {
      label: fieldLabels.systemUpdateRequiredPower,
      key: 'systemUpdateRequiredPower',
      requiredType: 'input',
    },
    {
      label: fieldLabels.appUpdateRequiredPower,
      key: 'appUpdateRequiredPower',
      requiredType: 'input',
    },
    {
      label: fieldLabels.sysUpRequiresNoOperTime,
      key: 'sysUpRequiresNoOperTime',
      requiredType: 'input',
    },
    {
      label: fieldLabels.appUpRequiresNoOperTime,
      key: 'appUpRequiresNoOperTime',
      requiredType: 'input',
    },
  ];

  const getFormItems3 = (): CustomFromItem[] => {
    const formItems3: CustomFromItem[] = [
      {
        label: fieldLabels.tmsDomainName,
        key: 'tmsDomainName',
        requiredType: 'input',
        render: () => <Input disabled={!switchAddress} />,
      },
      {
        label: fieldLabels.tmsDomainNameBakFirst,
        key: 'tmsDomainNameBakFirst',
        requiredType: 'input',
        render: () => <Input disabled={!switchAddress} />,
      },
      {
        label: fieldLabels.tmsDomainNameBakSecond,
        key: 'tmsDomainNameBakSecond',
        requiredType: 'input',
        render: () => <Input disabled={!switchAddress} />,
      },
      {
        label: fieldLabels.amsDomainName,
        key: 'amsDomainName',
        requiredType: 'input',
        render: () => <Input disabled={!switchAddress} />,
      },
    ];

    if (type !== 'ADD') {
      formItems3.unshift({
        label: '地址修改开关',
        render: () => (
          <Switch checked={switchAddress} onChange={setSwitchAddress} />
        ),
      } as any);
    }

    return formItems3;
  };

  return (
    <Spin spinning={!initToken}>
      <Form form={form} style={{ paddingBottom: 100 }}>
        <Divider orientation="left">【基础参数】</Divider>
        <CustomFormItems items={deptForms} />
        <Divider orientation="left">【基础参数】</Divider>
        <CustomFormItems items={formItems1} />
        <Divider orientation="left">【更新参数】</Divider>
        <CustomFormItems items={formItems2} />
        <Divider orientation="left">【服务器地址配置】</Divider>
        <CustomFormItems items={getFormItems3()} />
        <Divider orientation="left">【应用信息上送】</Divider>
        <Row gutter={24}>
          <Col span={12} style={{ marginBottom: 12, position: 'relative' }}>
            <Form.Item
              label="配置应用信息"
              {...FormItemLayout}
              rules={getFormCommonRules('配置应用信息', 'input')}
            >
              <TextArea
                value={infoList}
                autoSize={{ minRows: 4 }}
                onChange={(e) => {
                  setInfoList(e.target.value);
                }}
              />
            </Form.Item>
            <div
              className={`${prefix}-item`}
              style={{ right: `-${buttonPostion}px` }}
              ref={buttonRef}
            >
              <Button
                type="primary"
                onClick={formatInfoList}
                style={{ marginLeft: 12 }}
              >
                格式化
              </Button>
              <span style={{ marginLeft: 12 }}>
                (格式化后一行文本代表一个应用包名)
              </span>
            </div>
          </Col>
        </Row>
      </Form>
      <FixedFoot errors={error} fieldLabels={fieldLabels}>
        <Button type="primary" onClick={onFinish as any}>
          提交
        </Button>
        <Button onClick={() => history.goBack()}>返回</Button>
      </FixedFoot>
    </Spin>
  );
};
