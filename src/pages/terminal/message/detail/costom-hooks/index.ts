import { useCallback, useEffect } from 'react';
import { ACTION_TYPES_COMMON } from '@/pages/common/reducer';
import { terminalInfoDetail } from '../constants';
import { DictItem } from '@/pages/common/type';
import { RESPONSE_CODE } from '@/common/config';
import { useRedux } from '@/common/redux-util';

/**
 * 全局通用级别的初始化函数
 *
 * @export
 * @param {string} dictType
 */
export function useStore(id: string, currentTab: string): any {
  // const [] =

  const terminalInfoDetailCallback = useCallback((data: any) => {
    console.log('data:', data);
  }, []);

  useEffect(() => {
    // if (currentTab === 1) {
    //   terminalInfoDetail();
    // }
  }, []);

  return {};
}
