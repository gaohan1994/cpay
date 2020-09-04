import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import './index.scss';
import { MapItem } from '../../types';

type Props = {
  point?: MapItem;
  visible: boolean;
  toggle: (visible?: boolean) => void;
};

export default (props: Props) => {
  const { point, visible, toggle } = props;
  const [map, setMap] = useState({} as any);

  useEffect(() => {
    if (point) {
      const mp = new BMap.Map('container');
      const pointMap = new BMap.Point(point.longidude, point.latitude);
      mp.centerAndZoom(pointMap, 15);
      mp.addControl(new BMap.NavigationControl());
      mp.addControl(new BMap.ScaleControl());
      mp.addControl(new BMap.OverviewMapControl());
      mp.enableScrollWheelZoom(true);
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
