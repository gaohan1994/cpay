import React, { useState } from 'react';
import { useBoolean } from 'ahooks';

export function useModal() {
  // const [visible, { toggle, setTrue, setFalse }] = useBoolean(false);
  const [visible, setVisible] = useState(false);
  console.log('useModal visible:', visible);
  return {
    visible,
    toggle: () => setVisible(!visible),
    setTrue: () => setVisible(true),
    setFalse: () => setVisible(false),
  };
}
