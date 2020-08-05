import React from 'react';
import { Button } from 'antd';
import { TerminalGroupItem } from '@/pages/terminal/group/types';
import './index.scss';

const prefix = 'terminal-group-component';

type Props = {
  groupSet: TerminalGroupItem[];
  currentGroupSet: TerminalGroupItem;
  setCurrentGroupSet: (data: TerminalGroupItem) => void;
};

export default (props: Props) => {
  const { groupSet, currentGroupSet, setCurrentGroupSet } = props;
  return (
    <div className={`${prefix}-menu`}>
      {groupSet &&
        groupSet.map((item) => {
          return (
            <Button
              type={item.id === currentGroupSet.id ? 'primary' : 'default'}
              onClick={() => setCurrentGroupSet(item)}
            >
              {item.deptName}
            </Button>
          );
        })}
    </div>
  );
};
