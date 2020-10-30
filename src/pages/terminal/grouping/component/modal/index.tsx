import React, { useState, useCallback } from 'react';
import { Modal, Row, Col, Form, Button, Radio, notification } from 'antd';
import ImportModal from '@/component/modal/importModal'
import { RESPONSE_CODE, getDownloadPath } from '@/common/config';
import { groupSetImportTemplate, groupSetImportData } from '../../constants/index'

type Props = {
  visible: boolean;
  setFalse: () => void;
};

const { Item } = Form;

export default (props: Props) => {
  const { visible, setFalse } = props;

  const [value, setValue] = useState<string>('Tusn');

  const data: any[] = [
    {
      title: '按终端序列号',
      type: 'primary',
      key: 'Tusn'
    },
    {
      title: '按终端编号',
      type: 'primary',
      key: 'Code'
    },
    {
      title: '按商户编号',
      type: 'primary',
      key: 'Merchant'
    },
  ]

  const onChange = (e: any) => {
    setValue(e.target.value);
  };

      /**
   * @todo 下载模版
   */
  const onDownloadImportTemplate = async (type: string) => {
    const res = await groupSetImportTemplate({ type });
    if (res && res.code === RESPONSE_CODE.success) {
      const href = getDownloadPath(res.data);
      // window.open(href, '_blank');
    } else {
      notification.error({ message: res && res.msg || '下载模版失败' });
    }
  }

  const onDownloadImport = useCallback(
    (params: FormData) => {
      return groupSetImportData(params, value)
    },
    [value]
  )

  return (
    <ImportModal visible={visible} onCancel={setFalse} importFunc={onDownloadImport}>
      <Item label="导入类型">
        <Radio.Group onChange={onChange} value={value}>
          {data.map((item) => {
            return <Radio key={item.key} value={item.key}>{item.title}</Radio>;
          })}
        </Radio.Group>
      </Item>
      <Item label="模板下载">
        {data.map((button) => {
          return (
            <Button {...button} style={{ marginRight: 12 }} onClick={() => onDownloadImportTemplate(button.key)}>
              {button.title}
            </Button>
          );
        })}
      </Item>
    </ImportModal>
  );
};
