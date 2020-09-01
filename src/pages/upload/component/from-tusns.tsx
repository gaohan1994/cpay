/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-09-01 11:44:53 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-09-01 11:47:25
 * 
 * @todo 封装的终端集合选择表单
 */
import React, { useState } from "react";
import { Space, Button } from "antd";
import { PlusOutlined, CloseOutlined, UploadOutlined, ClearOutlined } from '@ant-design/icons';

interface Props {
  onAddTerminals: () => void;
  options: any[];
  setOptions: any;
}

export function FormTusns(props: Props) {
  const { onAddTerminals, options, setOptions } = props;
  const [selectedOptions, setSelectOptions] = useState([] as any[]);

  /**
   * @todo 删除选中的终端
   * @param type 'ALL'表示清空
   */
  const onDeleTerminals = (type?: string) => {
    if (type === 'ALL') {
      setOptions([]);
    } else if (selectedOptions.length > 0) {
      const arr: string[] = [];
      for (let i = 0; i < options.length; i++) {
        let flag = false;
        for (let j = 0; j < selectedOptions.length; j++) {
          if (options[i] === selectedOptions[j]) {
            flag = true;
            break;
          }
        }
        if (!flag) {
          arr.push(options[i]);
        }
      }
      setOptions(arr);
    }
    setSelectOptions([]);
  }

  /**
   * @todo excel导入终端
   */
  const onImportTerminals = () => {

  }

  /**
   * @todo 改变选中值
   * @param e 
   */
  const handleSelectChange = (e: any) => {
    const options = e.target.options;
    let arr: string[] = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        arr.push(options[i].value);
      }
    }
    setSelectOptions(arr);
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
        value={selectedOptions}
        onChange={handleSelectChange}
      >
        {
          options.map(item => {
            return (
              <option value={item} key={item}>{item}</option>
            )
          })
        }
      </select>
    </Space>
  )
}