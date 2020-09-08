import React, { useImperativeHandle, useEffect, useState } from 'react';
import { Checkbox, Form, Col, Radio } from 'antd';
import { listenerCount } from 'process';
interface Props {
  list: any[];
  valueKey: string;
  nameKey: string;
  setForm?: any;
  // setCheckedList: any;
  value?: any;
}
export const CustomRadioGroup = React.forwardRef((props: Props, ref) => {
  const { list, valueKey, nameKey, setForm, value: valueProps } = props;
  const [value, setValue] = useState(list);

  useImperativeHandle(ref, () => ({
    // 这个函数会返回一个对
    // 该对象会作为父组件 current 属性的值
    // 通过这种方式，父组件可以使用操作子组件中的多个 ref
    setValue: (value: any) => { setValue(value) }
  }), []);

  useEffect(() => {
    if (list.length > 0 && !valueProps) {
      setValue(list[0][valueKey]);
    } else {
      setValue(valueProps);
    }
  }, [list, valueProps]);

  // useEffect(() => {
  //   setValue(valueProps);
  // }, [valueProps]);

  useEffect(() => {
    if (setForm && !Array.isArray(value)) {
      setForm(value);
    }
  }, [value]);

  return (
    <Radio.Group value={value} onChange={(e) => setValue(e.target.value)}>
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
