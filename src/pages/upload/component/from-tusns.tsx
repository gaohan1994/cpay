import React from "react";
import { Space, Button } from "antd";
import { PlusOutlined, CloseOutlined, UploadOutlined, ClearOutlined } from '@ant-design/icons';

interface Props {
  onAddTerminals: () => void;
  options: any[];
  setOptions: () => void;
}

export function FormTusns(props: Props) {
  const { onAddTerminals, options } = props;
  const onDeleTerminals = (type?: string) => {

  }
  const onImportTerminals = () => {
    
  }
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Space>
        <Button type="primary" icon={<PlusOutlined />} onClick={onAddTerminals}>
          添加终端
        </Button>
        <Button type="primary" icon={<UploadOutlined />} onClick={onImportTerminals}>
          Excel导入
        </Button>
        <Button type="primary" icon={<CloseOutlined />} onClick={() => onDeleTerminals()}>
          删除
        </Button>
        <Button type="primary" icon={<ClearOutlined />} onClick={() => { onDeleTerminals('ALL') }}>
          清空
        </Button>
      </Space>

      <select
        style={{
          width: '100%',
          height: 200,
          border: '1px solid rgb(217, 217, 217)',
          padding: 11,
          overflow: 'auto'
        }}
        multiple={true}
      // value={seletedDeleteTerminals}
      // onChange={handleSelectChange}
      >
        {
          options.map(item => {
            return (
              <option value={item}>{item}</option>
            )
          })
        }
      </select>
    </Space>
  )
}