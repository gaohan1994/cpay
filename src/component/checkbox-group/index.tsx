import React, { useImperativeHandle, useEffect } from 'react';
import { Checkbox, Form, Col } from 'antd';
import { useCheckGroupData } from '../../pages/common/costom-hooks/form-select';
interface Props {
  list: any[];
  valueKey: string;
  nameKey: string;
  setForm?: any;
  // setCheckedList: any;
}
const CheckboxGroup = Checkbox.Group;
export const CustomCheckGroup = React.forwardRef((props: Props, ref) => {
  const { list, valueKey, nameKey, setForm } = props;
  const { indeterminate, checkAll, checkedList, setCheckedList, onChange, onCheckAllChange } = useCheckGroupData(list);

  useImperativeHandle(ref, () => ({
    // 这个函数会返回一个对
    // 该对象会作为父组件 current 属性的值
    // 通过这种方式，父组件可以使用操作子组件中的多个 ref
    setCheckedList: (list: any[]) => { setCheckedList(list) }
  }), []);

  useEffect(() => {
    if (setForm) {
      setForm(checkedList);
    }
  }, [checkedList]);

  return (
    <Col
      span={24}
      style={{
        borderRadius: 2,
        border: '1px solid #d9d9d9',
        padding: 10,
        display: 'flex',
        flexDirection: 'column',
        width: '100%'
      }}
    >
      <Checkbox
        indeterminate={indeterminate}
        onChange={onCheckAllChange}
        checked={checkAll}
      >
        全选
        </Checkbox>
      {
        list.length > 0 && (
          <CheckboxGroup onChange={onChange} value={checkedList} style={{ marginTop: 10 }}>
            {
              list.map(item => {
                return (
                  <Checkbox key={item[valueKey]} value={item[valueKey]} style={{ marginLeft: 0, marginRight: 8 }}>{item[nameKey]}</Checkbox>
                )
              })
            }
          </CheckboxGroup>
        )
      }
    </Col>
  )
});