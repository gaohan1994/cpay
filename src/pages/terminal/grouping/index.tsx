import React, { useState, useEffect } from 'react';
import { Row, Col } from 'antd';
import { terminalGetGroupSet } from './constants';
import { TerminalGroupItem } from '@/pages/terminal/group/types';
import { useStore } from '@/pages/common/costom-hooks';
import Menu from './component/menu';
import TabContenet from './component/tabs';

export default () => {
  useStore(['terminal_type']);

  const initState = {
    currentGroupSet: {} as TerminalGroupItem,
    groupSet: [] as TerminalGroupItem[],
  };
  const [currentGroupSet, setCurrentGroupSet] = useState(
    initState.currentGroupSet
  );
  const [groupSet, setGroupSet] = useState(initState.groupSet);

  useEffect(() => {
    terminalGetGroupSet((result) => {
      setGroupSet(result);
      setCurrentGroupSet(result[0] || {});
    });
  }, []);
  return (
    <div
      style={{
        minWidth: '1000px',
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <div style={{ flex: 1, maxWidth: 200, height: '100%' }}>
        <Menu
          groupSet={groupSet}
          currentGroupSet={currentGroupSet}
          setCurrentGroupSet={setCurrentGroupSet}
        />
      </div>
      <div style={{ flex: 4 }}>
        <TabContenet groupSet={groupSet} currentGroupSet={currentGroupSet} />
      </div>
    </div>
  );
};
