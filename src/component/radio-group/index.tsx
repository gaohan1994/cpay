import React, { useImperativeHandle, useEffect, useState } from 'react';
import { Checkbox, Form, Col, Radio } from 'antd';
interface Props {
  list: any[];
  valueKey: string;
  nameKey: string;
  setForm?: any;
  // setCheckedList: any;
}
export const CustomRadioGroup = React.forwardRef((props: Props, ref) => {
  const { list, valueKey, nameKey, setForm } = props;
  const [value, setValue] = useState('');

  useImperativeHandle(ref, () => ({
    // 这个函数会返回一个对
    // 该对象会作为父组件 current 属性的值
    // 通过这种方式，父组件可以使用操作子组件中的多个 ref
    setValue: (value: any) => { setValue(value) }
  }), []);

  useEffect(() => {
    if (list.length > 0) {
      setValue(list[0][valueKey]);
    }
  }, [list]);

  useEffect(() => {
    if (setForm) {
      setForm(value);
    }
  }, [value]);

  return (
    <Radio.Group value={value}>
      {
        list.length > 0 && list.map(item => {
          return (
            <Radio key={item[valueKey]} value={item[valueKey]}>{item[nameKey]}</Radio>
          )
        })
      }
    </Radio.Group>
  )
});