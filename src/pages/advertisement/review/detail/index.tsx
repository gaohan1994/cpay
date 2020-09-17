import React, { useEffect, useState } from 'react';
import {
  Form,
  Row,
  Col,
  Input,
  Button,
  Descriptions,
  notification,
} from 'antd';
import './index.scss';
import { advertInfoDetail } from '@/pages/advertisement/constants/api';
import { formatSearch } from '@/common/request-util';
import { useHistory } from 'react-router-dom';
import { renderColumns } from '@/pages/terminal/message/detail/components/content';
import { AdvertisementDetail } from '../../types';
import { advertInfoAudit } from '../../constants/api';
import { RESPONSE_CODE } from '@/common/config';
import { useStore } from '@/pages/common/costom-hooks';
import { merge } from 'lodash';
import moment from 'moment';
import invariant from 'invariant';
import { useSelectorHook } from '@/common/redux-util';
import { CommonProps } from '@/common/type';

const { TextArea } = Input;

type Props = {} & CommonProps<{ id: any }>;

type State = {
  detail: AdvertisementDetail;
  pass: boolean;
};

export default (props: Props) => {
  const history = useHistory();
  useStore(['advert_file_type', 'advert_type']);
  const dictList = useSelectorHook((state) => state.common.dictList);
  const state: State = {
    detail: {} as any,
    pass: false,
  };
  const [detail, setDetail] = useState(state.detail);
  const [pass, setPass] = useState(true);
  useEffect(() => {
    const { id } = props.match.params;
    if (id) {
      advertInfoDetail(id).then((response) => {
        if (response.code === RESPONSE_CODE.success) {
          setDetail(response.data);
        }
      });
    }
  }, [props.match.params]);
  const [form] = Form.useForm();

  const getFields = () => {
    const detailArr: any[] = [];
    detailArr.push({
      label: '名称',
      value: detail?.adName || '--',
    });
    detailArr.push({
      label: '有效起始时间',
      value: detail?.startTime || '--',
    });
    detailArr.push({
      label: '有效结束时间',
      value: detail?.endTime || '--',
    });
    detailArr.push({
      label: '所属机构',
      value: detail?.deptName || '--',
    });
    detailArr.push({
      label: '广告类型',
      value:
        (
          dictList &&
          detail &&
          dictList.advert_type &&
          dictList.advert_type.data.find(
            (t) => t.dictValue === `${detail.type}`
          )
        )?.dictLabel || '--',
    });
    detailArr.push({
      label: '广告文件类型',
      value:
        (
          dictList &&
          detail &&
          dictList.advert_file_type &&
          dictList.advert_file_type.data.find(
            (t) => t.dictValue === `${detail.adFileType}`
          )
        )?.dictLabel || '--',
    });
    detailArr.push({
      label: '终端屏幕类型',
      value: detail?.advertCopsSign || '--',
    });
    detailArr.push({
      label: '广告文件名',
      value: '--',
    });
    detailArr.push({
      label: '审核意见',
      render: () => {
        return (
          <Form.Item name="reviewMsg">
            <TextArea style={{ minHeight: 100 }} />
          </Form.Item>
        );
      },
    });

    const secondArr = [
      {
        label: '广告预览图片',
        render: () => {
          return <img src={detail?.picPath} style={{ width: '100%' }} />;
        },
      },
    ];
    // 审核意见;
    return (
      <Row style={{ padding: 12 }}>
        {[detailArr, secondArr].map((array, index) => {
          return (
            <Col span={10} style={{ marginLeft: index === 1 ? '24px' : '' }}>
              <Descriptions
                bordered
                column={1}
                layout={index === 1 ? 'vertical' : 'horizontal'}
              >
                {array.length > 0 &&
                  array.map((item: any) => {
                    const { label, render, value, ...rest } = item;
                    return (
                      <Descriptions.Item
                        label={<div style={{ width: '100px' }}>{label}</div>}
                      >
                        {render ? render() : value}
                      </Descriptions.Item>
                    );
                  })}
              </Descriptions>
            </Col>
          );
        })}
      </Row>
    );
  };

  const onFinish = async (values: any) => {
    try {
      const { search } = history.location;
      const field = formatSearch(search);
      if (pass === true) {
        const payload = {
          id: field.id,
          isPass: pass,
          reviewTime: moment().format('YYYY-MM-DD HH:mm:ss'),
          reviewMsg: values.reviewMsg || '审核通过',
        };
        const result = await advertInfoAudit(payload);
        invariant(result.code === RESPONSE_CODE.success, result.msg || ' ');
        notification.success({ message: '审核通过！' });
        history.goBack();
        return;
      }
      invariant(values.reviewMsg, '请填写审核意见');
      const payload = {
        id: field.id,
        isPass: pass,
        reviewTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        reviewMsg: values.reviewMsg,
      };
      const result = await advertInfoAudit(payload);
      invariant(result.code === RESPONSE_CODE.success, result.msg || ' ');
      notification.success({ message: '审核不通过！' });
      history.goBack();
    } catch (error) {
      notification.warn({ message: error.message });
    }
  };

  return (
    <Form form={form} className="ant-advanced-search-form" onFinish={onFinish}>
      {getFields()}
      <Row style={{ padding: 12 }}>
        <Col style={{ textAlign: 'left' }}>
          <Button
            type="primary"
            onClick={() => {
              setPass(true);
              form.submit();
            }}
          >
            通过
          </Button>
          <Button
            style={{ margin: '0 8px' }}
            onClick={() => {
              setPass(false);
              form.submit();
            }}
          >
            不通过
          </Button>
        </Col>
      </Row>
    </Form>
  );
};
