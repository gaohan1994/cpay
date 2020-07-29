import { useReducer, useCallback, useEffect } from 'react';
import { common, initState, ACTION_TYPES_COMMON } from '@/pages/common/reducer';
import {
  getDeptTreeData,
  GetDeptTreeDataCallback,
  getDictList,
} from '@/pages/common/constants';
import { DictItem, CommonHooksState } from '@/pages/common/type';

/**
 * 全局通用级别的初始化函数
 *
 * @export
 * @param {string} dictType
 */
export function useStore(dictType: string): CommonHooksState {
  const [state, dispatch] = useReducer(common, initState);

  const getDeptCallback = useCallback((deptData: GetDeptTreeDataCallback) => {
    const [data, treeData] = deptData;
    console.log('deptData:', deptData);
    dispatch({
      type: ACTION_TYPES_COMMON.RECEIVE_DEPT_DATA,
      payload: data,
    });
    dispatch({
      type: ACTION_TYPES_COMMON.RECEIVE_DEPT_TREE_DATA,
      payload: treeData,
    });
  }, []);

  const getDictListCallback = useCallback((dictList: DictItem[]) => {
    console.log('dictList: ', dictList);
    dispatch({
      type: ACTION_TYPES_COMMON.RECEIVE_DICT_LIST,
      payload: {
        dictType,
        data: dictList,
      },
    });
  }, []);

  useEffect(() => {
    /**
     * 请求机构数据
     */
    getDeptTreeData(getDeptCallback);

    /**
     * 请求字典数据
     */
    getDictList(dictType, getDictListCallback);
  }, []);

  return {
    deptList: state.deptData,
    deptTreeList: state.deptTreeData,
    dictList: state.dictList[dictType] || [],
  };
}
