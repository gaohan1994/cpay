import React, { useState, useEffect } from 'react';
import { useBoolean } from 'ahooks';
import { Input, Row, Col, Switch, Divider, Form } from 'antd';
import { TerminalParamItem } from '@/pages/terminal/params/types';
import '../index.scss';
import { DetailType } from '../../../types';
import { useSelectorHook } from '@/common/redux-util';
import { renderTreeSelect, renderSelect } from '@/component/form/render';
import { FormItmeType } from '@/component/form/type';
import { terminalGroupListByDept } from '@/pages/terminal/message/constants/api';
import { ITerminalGroupByDeptId } from '@/pages/terminal/message/types';
import { FormInstance } from 'antd/lib/form';
import { CustomFromItem } from '@/common/type';

const prefix = 'terminal-params-component-detail';

type Props = {
  type: DetailType;
  form: FormInstance;
  value?: TerminalParamItem;
  onChange?: (params?: any) => void;
};

interface State {
  editServerSwitch: boolean;
  deptId: string;
  terminalGroup: ITerminalGroupByDeptId[];
  groupValue: string;
}

export default (props: Props) => {
  const { value, onChange, type, form } = props;
  console.log('dept props', props);
  const initState: State = {
    editServerSwitch: false,
    deptId: '',
    terminalGroup: [] as ITerminalGroupByDeptId[], // 终端组别
    groupValue: '', // 终端组别选中值
  };

  const [deptId, setDeptId] = useState(initState.deptId);
  const [terminalGroup, setTerminalGroup] = useState(initState.terminalGroup);
  // const [groupValue, setGroupValue] = useState(initState.groupValue);

  const [editServerSwitch, { setFalse, toggle }] = useBoolean(
    initState.editServerSwitch
  );

  const [deptTreeData] = useSelectorHook((state) => state.common?.deptTreeData);

  useEffect(() => {
    if (type === DetailType.EDIT) {
      setFalse();
    }
  }, [type]);

  /**
   * @todo 根据机构id获取终端组别
   */
  useEffect(() => {
    terminalGroupListByDept(Number(value?.deptId), (groupData) => {
      setTerminalGroup(groupData);
      if (type === DetailType.EDIT) {
        const currentGroup = groupData.find((g) => g.id === value?.groupId);
        console.log('currentGroup:', currentGroup);
      }
    });
  }, [deptId]);

  /**
   * 修改参数外部也要修改
   * @param changedValue
   */
  const triggerChange = (changedValue: any) => {
    if (onChange) {
      onChange({ ...value, ...changedValue });
    }
  };

  /**
   * 修改参数
   * @param newValue
   * @param key
   * @param callback
   */
  const onValueChange = (newValue: string, key: string) => {
    if (key === 'deptId') {
      setDeptId(newValue);
    }
    triggerChange({ [`${key}`]: newValue });
  };

  const renderTreeSelectProps: any =
    deptTreeData && deptTreeData.children && type === DetailType.EDIT
      ? {
          disabled: true,
          value: value?.deptName,
          formName: '',
          formType: FormItmeType.TreeSelect,
          treeSelectData: [deptTreeData],
        }
      : {
          formName: 'deptId',
          placeHolder: '请选择机构',
          value: value?.deptId || deptId,
          onChange: (value: any) => onValueChange(value, 'deptId'),
          formType: FormItmeType.TreeSelect,
          treeSelectData: [deptTreeData],
        };

  const currentGroup = terminalGroup.find((g) => g.id === value?.groupId);
  const renderSelectProps: any =
    deptTreeData && deptTreeData.children && type === DetailType.EDIT
      ? {
          disabled: true,
          value: currentGroup?.name,
        }
      : {
          formName: '',
          value: value?.groupId,
          onChange: (value: any) => onValueChange(value, 'groupId'),
          selectData:
            (terminalGroup &&
              terminalGroup.map((group) => {
                return {
                  title: group.name,
                  value: group.id,
                };
              })) ||
            [],
        };
  console.log('renderSelectProps:', renderSelectProps);
  return (
    <div>
      <Divider orientation="left">【基础参数】</Divider>
      <Row gutter={24}>
        <Col style={{ marginBottom: 12 }} span={11}>
          <div className={`${prefix}-item`}>
            <span>所属机构*</span>
            {renderTreeSelect(renderTreeSelectProps)}
          </div>
        </Col>
        <Col style={{ marginBottom: 12 }} span={11}>
          <div className={`${prefix}-item`}>
            <span>所属组别*</span>
            {renderSelect(renderSelectProps)}
          </div>
        </Col>
      </Row>
    </div>
  );
};
