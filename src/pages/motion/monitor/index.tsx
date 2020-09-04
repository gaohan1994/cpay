import React, { useEffect, useState } from 'react';
import { Form, Input, Col, Row, Button, notification } from 'antd';
import { UnorderedListOutlined } from '@ant-design/icons';
import { useStore } from '@/pages/common/costom-hooks';
import { FormItmeType, FormItem } from '@/component/form/type';
import { renderCommonTreeSelectForm } from '@/component/form/render';
import './index.scss';
import invariant from 'invariant';
import { useMount } from 'ahooks';

export default () => {
  useStore([]);
  const [form] = Form.useForm();
  const [map, setMap] = useState({} as any);
  const [deptId, setDeptId] = useState('');

  useEffect(() => {
    const mp = new BMap.Map('monitor-map-container');
    // const pointMap = new BMap.Point(point.longidude, point.latitude);
    // mp.centerAndZoom(pointMap, 15);
    // mp.addControl(new BMap.NavigationControl());
    // mp.addControl(new BMap.ScaleControl());
    // mp.addControl(new BMap.OverviewMapControl());
    mp.enableScrollWheelZoom(true);
    setMap(mp);
  }, []);

  const onSelect = () => {
    try {
      const fields = form.getFieldsValue();
      console.log('fields, ', fields);
      invariant(!!fields.deptId, '请先选择机构');
    } catch (error) {
      notification.warn({ message: error.message });
    }
  };

  const onSearch = () => {
    const pointMap = new BMap.Point(116.404, 39.915);
    map.centerAndZoom(pointMap, 15);
  };

  const deptForm: FormItem = {
    span: 6,
    formName: 'deptId',
    formType: FormItmeType.TreeSelectCommon,
  };

  const suffix = (
    <div onClick={() => onSelect()}>
      <UnorderedListOutlined />
      <span style={{ marginLeft: 4 }}>选择</span>
    </div>
  );
  return (
    <div>
      <Form form={form}>
        <Row gutter={24}>
          {renderCommonTreeSelectForm(deptForm)}

          <Col span={6}>
            <Form.Item>
              <Input addonAfter={suffix} />
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

      <div id="monitor-map-container" className="monitor-map-container">
        map
      </div>
    </div>
  );
};
