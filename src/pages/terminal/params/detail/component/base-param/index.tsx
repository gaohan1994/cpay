import React, { useEffect, useState, useRef } from 'react';
import { useBoolean } from 'ahooks';
import { Input, Row, Col, Switch, Divider, Button, Form } from 'antd';
import { ITerminalParams, ComponentItem } from '../../types';
import '../index.scss';
import { DetailType } from '../../../types';
import { FormInstance } from 'antd/lib/form';
import { getFormCommonRules } from '@/pages/common/util';

const { TextArea } = Input;
const prefix = 'terminal-params-component-detail';

type Props = {
  type: DetailType;
  form: FormInstance;
  value?: ITerminalParams;
  onChange?: (params?: any) => void;
};

interface State {
  editServerSwitch: boolean;
  infoList: string;
}

const FormItemLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 12,
  },
};

export default (props: Props) => {
  const buttonRef: any = useRef(null);
  const initState: State = {
    editServerSwitch: false,
    infoList: '',
  };
  const { value, onChange, type } = props;
  const [buttonPostion, setButtonPostion] = useState(0);
  const [infoList, setInfoList] = useState(initState.infoList);
  const [editServerSwitch, { setFalse, toggle }] = useBoolean(
    initState.editServerSwitch
  );

  useEffect(() => {
    setButtonPostion(buttonRef.current?.clientWidth);
  }, [buttonRef.current]);

  useEffect(() => {
    if (!!value?.infoList) {
      setInfoList(value.infoList);
    }
    if (type === DetailType.EDIT) {
      setFalse();
    }
  }, [type]);
  /**
   * 修改参数外部也要修改
   * @param changedValue
   */
  const triggerChange = (changedValue: any) => {
    if (onChange) {
      onChange({ ...value, ...changedValue });
    }
  };

  /**
   * 格式化
   * 1.遇到空格格式化
   * 2.遇到换行符格式化
   */
  const formatInfoList = () => {
    const formatList = infoList.split(/[\s\n]/).filter((t) => !!t);
    onValueChange(formatList.join(`\n`), 'infoList');
  };

  /**
   * 修改参数
   * @param newValue
   * @param key
   * @param callback
   */
  const onValueChange = (
    newValue: string,
    key: string
    // callback: (data: string) => void
  ) => {
    if (key === 'infoList') {
      console.log('newValue:', newValue);
      setInfoList(newValue);
    }
    triggerChange({ [`${key}`]: newValue });
  };

  const formInputs: ComponentItem[] = [
    {
      title: '心跳时间',
      key: 'htIntvl',
    },
    {
      title: '心跳重连次数',
      key: 'reHtIntvl',
    },
    {
      title: '文件传输超时时间(秒)',
      key: 'fileTraTimeout',
    },
    {
      title: '文件下载重试次数',
      key: 'reDownNum',
    },
    {
      title: '流量上送间隔时间(分)',
      key: 'upFlowIntvl',
    },
    {
      title: '信息上送间隔时间(分)',
      key: 'upInfoIntvl',
    },
    {
      title: '运维口令',
      key: 'mapPswd',
    },
    {
      title: '管理口令',
      key: 'managePwd',
    },
    {
      title: '文件下载间隔时间(秒)',
      key: 'fileDownloadHtval',
    },
    {
      title: '广播间隔时间(秒)',
      key: 'broadcastTime',
    },
    {
      title: '定位服务时间间隔(分)',
      key: 'locationIntvl',
    },
    {
      title: '仅在WIFI下通讯',
      key: 'asdasdasd',
      render: () => (
        <Form.Item label="地址修改开关" name="" {...FormItemLayout}>
          <Switch
            checked={value?.isWifi === '1' || false}
            onChange={(checked) =>
              onValueChange(!!checked ? '1' : '0', 'isWifi')
            }
          />
        </Form.Item>
      ),
    },
  ];

  const formUpdateInputs = [
    {
      title: '系统更新电量阀值(%)',
      key: 'systemUpdateRequiredPower',
    },
    {
      title: '应用更新电量阀值(%)',
      key: 'appUpdateRequiredPower',
    },
    {
      title: '系统更新闲置时间(秒)',
      key: 'sysUpRequiresNoOperTime',
    },
    {
      title: '应用更新闲置时间(秒)',
      key: 'appUpRequiresNoOperTime',
    },
  ];

  const renderFormsHelper = (formInputs: ComponentItem[]) => {
    return (
      <Row gutter={24}>
        {formInputs.map((item) => {
          const { title, key, render } = item;
          const itemValue = (value && (value as any)[item.key]) || '';
          return (
            <Col span={12} key={key} style={{ marginBottom: 12 }}>
              {!render ? (
                <Form.Item
                  label={item.title}
                  name={item.key}
                  {...FormItemLayout}
                  rules={getFormCommonRules(item.title, 'input')}
                >
                  <Input />
                </Form.Item>
              ) : (
                render()
              )}
            </Col>
          );
        })}
      </Row>
    );
  };

  const formServerInputs: ComponentItem[] = [
    {
      title: '终端运维服务地址',
      key: 'tmsDomainName',
    },
    {
      title: '终端运维服务地址-备机1',
      key: 'tmsDomainNameBakFirst',
    },
    {
      title: '终端运维服务地址-备机2',
      key: 'tmsDomainNameBakSecond',
    },
    {
      title: '应用商店服务地址',
      key: 'amsDomainName',
    },
    {
      title: '地址修改开关',
      key: 'zzxczxczcx',
      render: () => (
        <Form.Item label="地址修改开关" name="" {...FormItemLayout}>
          <Switch onChange={toggle} />
        </Form.Item>
      ),
    },
  ];
  return (
    <div>
      <Divider orientation="left">【基础参数】</Divider>
      {renderFormsHelper(formInputs)}

      <Divider orientation="left">【更新设置】</Divider>
      {renderFormsHelper(formUpdateInputs)}

      <Divider orientation="left">【服务器地址配置】</Divider>
      {type !== DetailType.EDIT ? (
        renderFormsHelper(formServerInputs)
      ) : (
        <div>
          <Row gutter={24}>
            {formServerInputs.map((item) => {
              const { render } = item;
              return (
                <Col span={12} key={item.key} style={{ marginBottom: 12 }}>
                  {!render ? (
                    <Form.Item
                      label={item.title}
                      name={item.key}
                      {...FormItemLayout}
                      rules={getFormCommonRules(item.title, 'input')}
                    >
                      <Input disabled={true} />
                    </Form.Item>
                  ) : (
                    render()
                  )}
                </Col>
              );
            })}
          </Row>
        </div>
      )}
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
                onValueChange(e.target.value, 'infoList');
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
    </div>
  );
};
