import React, { useEffect, useState } from 'react';
import { Descriptions, notification, Col, Row, Rate, Spin } from 'antd';
import { useQueryParam } from '@/common/request-util';
import { advertInfoDetail } from '../../constants/api';
import { AdvertisementDetail } from '../../types';
import { RESPONSE_CODE } from '../../../../common/config';
import { useStore } from '@/pages/common/costom-hooks';
import { getDictText } from '../../../common/util/index';
import { IResponseResult } from '@/common/type';

type IDetailArr = {
  label: string;
  value: string;
};

function Page() {
  useStore(['advert_file_type', 'advert_type']);
  const id = useQueryParam('id');
  const [detailArr, setDetailArr] = useState<IDetailArr[]>([]);
  const [loading, setLoading] = useState(false);

  /**
   * @todo 获取完相应字典数据，设置详情值
   */
  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    advertInfoDetail(id, getDetailCallback);
  }, []);

  /**
   * @todo 从接口拿到应用详情后的回调方法
   * @param result
   */
  const getDetailCallback = (result: IResponseResult<AdvertisementDetail>) => {
    setLoading(false);
    if (result && result.code === RESPONSE_CODE.success) {
      const data = result.data || {};
      let obj: IDetailArr[] = [
        { label: '名称', value: data.adName },
        { label: '有效起始时间', value: data.startTime },
        { label: '有效结束时间', value: data.endTime },
        { label: '所属机构', value: data.deptName },
        { label: '组别名称', value: data.groupName },
        { label: '终端厂商', value: data.firmName },
        { label: '终端型号', value: data.terminalTypes },
        { label: '广告类型', value: getDictText(`${data.type}`, 'advert_type') },
        { label: '广告文件类型', value: getDictText(`${data.adFileType}`, 'advert_file_type') },
        { label: '广告营销说明', value: data.description },
      ];
      setDetailArr(obj);
    } else {
      notification.warn({ message: result.msg || '获取详情失败，请刷新页面重试' });
    }
  };

  return (
    <Spin spinning={loading}>
      <div style={{ paddingTop: '10px', width: '50vw' }}>
        <Descriptions column={1} bordered>
          {detailArr &&
            detailArr.map((item, index) => (
              <Descriptions.Item key={index} label={<div style={{ width: '100px' }}>{item.label}</div>}>
                <div style={{ width: 'calc(60vw - 200px)' }}>{item.value || '--'}</div>
              </Descriptions.Item>
            ))}
        </Descriptions>
      </div>
    </Spin>
  );
}

export default Page;
