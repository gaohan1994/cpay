import React, { useEffect, useState } from 'react';
import { Form, Input, Col, Row, Button, notification } from 'antd';
import { UnorderedListOutlined } from '@ant-design/icons';
import { useStore } from '@/pages/common/costom-hooks';
import { FormItmeType, FormItem } from '@/component/form/type';
import { renderCommonTreeSelectForm } from '@/component/form/render';
import './index.scss';
import invariant from 'invariant';
import pic_map_address from '@/assets/map/pic_map_address.png';
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

  useEffect(() => {
    const mp = new BMap.Map('monitor-map-container');
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

    const mIcon = new BMap.Icon(pic_map_address, new BMap.Size(32, 37));
    console.log('mIcon:', mIcon);
    setMerchantIcon(mIcon);
  }, []);

  const onSearch = async () => {
    try {
      invariant(selectList && selectList[0], '请先选择终端设备！');
      const result = await getAllTerminalPosition({ tusn: selectList[0] });
      invariant(result.code === RESPONSE_CODE.success, result.msg || ' ');
      console.log('result', result);

      /**
       * 创建终端点坐标
       */
      const pointData = {
        longitude: result.data.terminalInfo.longitude,
        latitude: result.data.terminalInfo.latitude,
      };
      console.log('pointData', pointData);
      const point = new BMap.Point(pointData.longitude, pointData.latitude);
      map.centerAndZoom(point, 12);

      /**
       *
       */
      var marker = new BMap.Marker(point, { icon: merchantIcon });
      map.addOverlay(marker);

      /**
       * 设置半径
       */
      const circle = new BMap.Circle(point, 5000, {
        fillColor: 'blue',
        strokeWeight: 1,
        fillOpacity: 0.3,
        strokeOpacity: 0.3,
        enableEditing: true,
      });
      map.addOverlay(circle);
    } catch (error) {
      notification.warn({ message: error.message });
    }
  };

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
          {renderCommonTreeSelectForm(deptForm)}

          <Col span={6}>
            <Form.Item>
              <Input
                addonAfter={suffix}
                value={(selectList && selectList[0]) || ''}
              />
            </Form.Item>
          </Col>
          <Form.Item>
            <Button>重置</Button>
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

      <div id="monitor-map-container" className="monitor-map-container">
        map
      </div>
    </div>
  );
};
