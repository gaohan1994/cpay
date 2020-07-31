import React from 'react';
import { useSelectorHook } from '@/common/redux-util';
/**
 * table属性渲染helper
 */

export function UseDictRenderHelper(data: string, dictType: string) {
  /**
   * dictList 字典数据
   */
  const dictList = useSelectorHook((state) => state.common.dictList);
  const targetDict = dictList[dictType];

  const targetDictItem =
    targetDict &&
    targetDict.data &&
    targetDict.data.find((dictItem) => dictItem.dictValue === String(data));
  if (targetDictItem) {
    return <span>{targetDictItem.dictLabel}</span>;
  }
  return <span>--</span>;
}
