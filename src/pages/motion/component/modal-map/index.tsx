import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import './index.scss';
import { MapItem } from '../../types';
import pic_map_address from '@/assets/map/pic_map_address.png';
import pic_map_position from '@/assets/map/pic_map_position.png';

type Props = {
  point?: MapItem;
  visible: boolean;
  toggle: (visible?: boolean) => void;
};

export default (props: Props) => {
  const { point, visible, toggle } = props;
  const [map, setMap] = useState({} as any);

  useEffect(() => {

  }, []);

  useEffect(() => {
    if (point) {
      if(!(window as any).BMap) {
        return
      }
      const mp = new BMap.Map('container');
      if(!mp) {
        return
      }
      mp.addControl(new BMap.NavigationControl());
      mp.addControl(new BMap.ScaleControl());
      mp.addControl(new BMap.OverviewMapControl());
      mp.enableScrollWheelZoom(true);

      const terminalIcon = new BMap.Icon(pic_map_position, new BMap.Size(32, 37));
      const merchantIcon = new BMap.Icon(pic_map_address, new BMap.Size(32, 37));

      const currentTerminalData: any = point;
      /**
       * @param {radius} 半径
       * @param {currentTerminalData} 终端数据
       * @param {currentMerchantData} 商户数据
       *
       * @param {merchantPoint} 商户坐标点
       * @param {terminalPoint} 终端坐标点
       */
      const radius = 5000;

      if (currentTerminalData.merchantLongitude) {
        const merchantPoint = new BMap.Point(
          currentTerminalData.merchantLongitude,
          currentTerminalData.merchantLatitude
        );
        mp.centerAndZoom(merchantPoint, 12);
  
        const merchantMarker = new BMap.Marker(merchantPoint, {
          icon: merchantIcon,
        });
        mp.addOverlay(merchantMarker);

        const circle = new BMap.Circle(merchantPoint, radius, {
          fillColor: 'blue',
          strokeWeight: 1,
          fillOpacity: 0.3,
          strokeOpacity: 0.3,
          // enableEditing: true,
        });
        mp.addOverlay(circle);

        const merchantInfoWindow = new BMap.InfoWindow(
          `商户地址：` + currentTerminalData.merchantAddress,
          { width: 300, height: 100, title: '商户地址' }
        );
        merchantMarker.addEventListener('click', () => {
          mp.openInfoWindow(merchantInfoWindow, merchantPoint);
        });
      }

      const terminalPoint = new BMap.Point(
        currentTerminalData.longidude,
        currentTerminalData.latitude
      );

      const terminalMarker = new BMap.Marker(terminalPoint, {
        icon: terminalIcon,
      });
      mp.addOverlay(terminalMarker);

      const terminalInfoWindow = new BMap.InfoWindow(
        `终端地址：` + currentTerminalData.curAddress,
        { width: 300, height: 100, title: '终端地址' }
      );
      terminalMarker.addEventListener('click', () => {
        mp.openInfoWindow(terminalInfoWindow, terminalPoint); //开启信息窗口
      });
      setMap(mp);
    }
  }, [point]);

  return (
    <Modal
      visible={visible}
      onCancel={() => toggle(false)}
      getContainer={false}
      footer={null}
    >
      <div id="container" className="component-modal-map"></div>
    </Modal>
  );
};
