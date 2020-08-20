import React, { useState, useEffect } from 'react';
import { useBoolean } from 'ahooks';
import { Input, Row, Col, Switch, Divider, Form } from 'antd';
import { ITerminalParams, ComponentItem } from '../../types';
import '../index.scss';
import { DetailType } from '../../../types';

const prefix = 'terminal-params-component-detail';

type Props = {
  type: DetailType;
  value?: ITerminalParams;
  onChange?: (params?: any) => void;
};

interface State {
  editServerSwitch: boolean;
}

export default (props: Props) => {
  const initState: State = {
    editServerSwitch: false,
  };
  const { value, onChange, type } = props;
  const [editServerSwitch, { setFalse, toggle }] = useBoolean(
    initState.editServerSwitch
  );
  useEffect(() => {
    if (type === DetailType.EDIT) {
      setFalse();
    }
  }, [type]);
  /**
   * 修改参数外部也要修改
   * @param changedValue
   */
  const triggerChange = (changedValue: any) => {
    console.log('changedValue:', changedValue);
    if (onChange) {
      onChange({ ...value, ...changedValue });
    }
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
    // if (value && !(`${key}` in value)) {
    //   // callback(newValue);
    //   console.log('newValue:', newValue);
    //   setCurrentState({
    //     ...currentState,
    //     [`${key}`]: newValue,
    //   });
    // }
    triggerChange({ [`${key}`]: newValue });
  };

  const formInputs: ComponentItem[] = [
    {
      title: '心跳时间*',
      key: 'htIntvl',
    },
    {
      title: '心跳重连次数*',
      key: 'reHtIntvl',
    },
    {
      title: '文件传输超时时间(秒)*	',
      key: 'fileTraTimeout',
    },
    {
      title: '文件下载重试次数*',
      key: 'reDownNum',
    },
    {
      title: '流量上送间隔时间(分)*',
      key: 'upFlowIntvl',
    },
    {
      title: '信息上送间隔时间(分)*',
      key: ' upInfoIntvl',
    },
    {
      title: '运维口令*',
      key: 'mapPswd',
    },
    {
      title: '管理口令*',
      key: ' managePwd',
    },
    {
      title: '文件下载间隔时间(秒)*',
      key: 'fileDownloadHtval',
    },
    {
      title: '广播间隔时间(秒)*',
      key: 'broadcastTime',
    },
    {
      title: '定位服务时间间隔(分)*',
      key: 'locationIntvl',
    },
    {
      title: '仅在WIFI下通讯*',
      key: '',
      render: () => (
        <Switch
          checked={value?.isWifi === '1' || false}
          onChange={(checked) => onValueChange(!!checked ? '1' : '0', 'isWifi')}
        />
      ),
    },
  ];

  const formUpdateInputs = [
    {
      title: '系统更新电量阀值(%)*',
      key: 'systemUpdateRequiredPower',
    },
    {
      title: '应用更新电量阀值(%)*',
      key: 'appUpdateRequiredPower',
    },
    {
      title: '系统更新闲置时间(秒)*',
      key: 'sysUpRequiresNoOperTime',
    },
    {
      title: '应用更新闲置时间(秒)*	',
      key: 'appUpRequiresNoOperTime',
    },
  ];

  const renderFormsHelper = (formInputs: ComponentItem[]) => {
    return (
      <Row>
        {formInputs.map((item) => {
          const { title, key, render } = item;
          const itemValue = (value && (value as any)[item.key]) || '';
          return (
            <Col span={11} key={key} style={{ marginBottom: 12 }}>
              <div className={`${prefix}-item`}>
                <span>{title}</span>
                {!render ? (
                  <Input
                    required
                    value={itemValue}
                    onChange={(e) => onValueChange(e.target.value, key)}
                  />
                ) : (
                  render()
                )}
              </div>
            </Col>
          );
        })}
      </Row>
    );
  };

  const formServerInputs: ComponentItem[] = [
    {
      title: '终端运维服务地址*',
      key: 'tmsDomainName',
    },
    {
      title: '终端运维服务地址-备机1*',
      key: 'tmsDomainNameBakFirst',
    },
    {
      title: '终端运维服务地址-备机2*',
      key: 'tmsDomainNameBakSecond',
    },
    {
      title: '应用商店服务地址*',
      key: 'amsDomainName',
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
          <Col span={11} style={{ marginBottom: 12 }}>
            <div className={`${prefix}-item`}>
              <span>地址修改开关*</span>
              <Switch checked={editServerSwitch} onChange={toggle} />
            </div>
          </Col>
          <Row>
            {formServerInputs.map((item) => {
              const { title, key, render } = item;
              const itemValue = (value && (value as any)[item.key]) || '';
              return (
                <Col span={11} key={key} style={{ marginBottom: 12 }}>
                  <div className={`${prefix}-item`}>
                    <span>{title}</span>
                    {!render ? (
                      <Input
                        disabled={!editServerSwitch}
                        value={itemValue}
                        onChange={(e) => onValueChange(e.target.value, key)}
                      />
                    ) : (
                      render()
                    )}
                  </div>
                </Col>
              );
            })}
          </Row>
        </div>
      )}
      {/* <Divider orientation="left">【应用信息上送】</Divider> */}
    </div>
  );
};
