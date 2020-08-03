import React, { useState, useCallback, useEffect } from 'react';
import { terminalGroupListByDept } from '../constants/api';
import { ITerminalGroupByDeptId } from '../types';

/**
 * 监听树选择器值改变函数
 *
 * @export
 * @param {string} deptId
 * @param {() => void} [callback]
 * @returns {{ terminalGroup: ITerminalGroupByDeptId[] }}
 */
export function useRegisterTree(
  deptId: number,
  callback?: (params: ITerminalGroupByDeptId[]) => void
): void {
  // const [terminalGroup, setTerminalGroup] = useState(
  //   [] as ITerminalGroupByDeptId[]
  // );

  // const getTerminalGroupListByDeptCallback = useCallback((data: ITerminalGroupByDeptId[]) => {

  // }, []);
  useEffect(() => {
    terminalGroupListByDept(deptId, callback);
  }, [deptId]);

  // return { terminalGroup };
}
