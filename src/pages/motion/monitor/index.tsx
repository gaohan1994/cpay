import React, { useEffect, useState } from 'react';
import { Form, Input, Col, Row, Button, notification } from 'antd';
import { UnorderedListOutlined } from '@ant-design/icons';
import { useStore } from '@/pages/common/costom-hooks';
import { FormItmeType, FormItem } from '@/component/form/type';
import { renderCommonTreeSelectForm } from '@/component/form/render';
import './index.scss';
import invariant from 'invariant';
import pic_map_address from '@/assets/map/pic_map_address.png';
import pic_map_position from '@/assets/map/pic_map_position.png';
import { TableTusns } from '../component/table';
import { getAllTerminalPosition } from '../constants';
import { RESPONSE_CODE } from '@/common/config';

export default () => {
  useStore([]);
  const [form] = Form.useForm();
  const [map, setMap] = useState({} as any);
  const [deptId, setDeptId] = useState('');
  const [visible, setVisible] = useState(false);
  const [selectList, setSelectList] = useState([] as any[]);
  const [merchantIcon, setMerchantIcon] = useState({} as any);
  const [terminalIcon, setTerminalIcon] = useState({} as any);

  useEffect(() => {
    if(!(window as any).BMap) {
      return
    }
    const mp = new BMap.Map('monitor-map-container');
    if(!mp) {
      return
    }
    // const pointMap = new BMap.Point(point.longidude, point.latitude);
    // mp.centerAndZoom(pointMap, 15);
    // mp.addControl(new BMap.NavigationControl());
    // mp.addControl(new BMap.ScaleControl());
    // mp.addControl(new BMap.OverviewMapControl());
    mp.addControl(new BMap.NavigationControl());
    mp.enableScrollWheelZoom(); // 启用滚轮放大缩小。
    mp.enableKeyboard(); // 启用键盘操作。
    mp.addControl(
      new BMap.OverviewMapControl({
        anchor: 'BMAP_ANCHOR_TOP_RIGHT',
        isOpen: true,
      })
    ); //缩略图控件
    setMap(mp);

    const terminalIcon = new BMap.Icon(pic_map_position, new BMap.Size(32, 37));
    setTerminalIcon(terminalIcon);

    const mIcon = new BMap.Icon(pic_map_address, new BMap.Size(32, 37));
    setMerchantIcon(mIcon);
  }, []);

  const onSearch = async () => {
    try {
      invariant(selectList && selectList[0], '请先选择终端设备！');
      const result = await getAllTerminalPosition({ tusn: selectList[0] });
      invariant(result.code === RESPONSE_CODE.success, result.msg || ' ');
      console.log('result', result);

      /**
       * @param {radius} 半径
       * @param {currentTerminalData} 终端数据
       * @param {currentMerchantData} 商户数据
       *
       * @param {merchantPoint} 商户坐标点
       * @param {terminalPoint} 终端坐标点
       */
      const radius = 5000;
      const currentTerminalData = result.data.terminalPosition;
      const currentMerchantData = result.data.terminalInfo;

      const merchantPoint = new BMap.Point(
        currentMerchantData.longitude,
        currentMerchantData.latitude
      );
      map.centerAndZoom(merchantPoint, 12);

      const merchantMarker = new BMap.Marker(merchantPoint, {
        icon: merchantIcon,
      });
      map.addOverlay(merchantMarker);

      const circle = new BMap.Circle(merchantPoint, radius, {
        fillColor: 'blue',
        strokeWeight: 1,
        fillOpacity: 0.3,
        strokeOpacity: 0.3,
        // enableEditing: true,
      });
      map.addOverlay(circle);

      const merchantInfoWindow = new BMap.InfoWindow(
        `商户地址：` + currentMerchantData.address,
        { width: 300, height: 100, title: '商户地址' }
      );
      merchantMarker.addEventListener('click', () => {
        map.openInfoWindow(merchantInfoWindow, merchantPoint);
      });

      const terminalPoint = new BMap.Point(
        currentTerminalData.longitude,
        currentTerminalData.latitude
      );

      const terminalMarker = new BMap.Marker(terminalPoint, {
        icon: terminalIcon,
      });
      map.addOverlay(terminalMarker);

      const terminalInfoWindow = new BMap.InfoWindow(
        `终端地址：` + currentTerminalData.address,
        { width: 300, height: 100, title: '终端地址' }
      );
      terminalMarker.addEventListener('click', () => {
        map.openInfoWindow(terminalInfoWindow, terminalPoint); //开启信息窗口
      });
    } catch (error) {
      console.log('error', error);
      notification.warn({ message: error.message });
    }
  };

  const onReset = async () => {
    await form.resetFields()
    onSearch()
  }

  const deptForm: FormItem = {
    span: 6,
    formName: 'deptId',
    formType: FormItmeType.TreeSelectCommon,
    onChange: (value) => {
      setDeptId(value);
    },
  };

  const suffix = (
    <div
      onClick={() => {
        if (!deptId) {
          notification.warn({ message: '请先选择机构' });
          return;
        }
        setVisible(true);
      }}
    >
      <UnorderedListOutlined />
      <span style={{ marginLeft: 4 }}>选择</span>
    </div>
  );
  console.log('selectList:', selectList);
  return (
    <div>
      <Form form={form}>
        <Row gutter={24}>
          <Col span={6}>
            {renderCommonTreeSelectForm(deptForm)}
          </Col>
          <Col span={6}>
            <Form.Item>
              <Input
                addonAfter={suffix}
                value={(selectList && selectList[0]) || ''}
              />
            </Form.Item>
          </Col>
          <Form.Item>
            <Button onClick={onReset}>重置</Button>
          </Form.Item>
          <Form.Item style={{ marginLeft: 12 }}>
            <Button type="primary" onClick={onSearch}>
              查询
            </Button>
          </Form.Item>
        </Row>
      </Form>

      <TableTusns
        visible={visible}
        hideModal={() => setVisible(false)}
        fetchParam={{ deptId }}
        setOptions={setSelectList}
        options={[]}
      />

      <div id="monitor-map-container" className="monitor-map-container"></div>
    </div>
  );
};
