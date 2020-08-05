import { useCallback, useEffect } from 'react';
import { ACTION_TYPES_COMMON } from '@/pages/common/reducer';
import {
  getDeptTreeData,
  GetDeptTreeDataCallback,
  getDictList,
  getDictData,
} from '@/pages/common/constants';
import { DictItem, CommonHooksState } from '@/pages/common/type';
import { RESPONSE_CODE } from '@/common/config';
import { useRedux } from '@/common/redux-util';

/**
 * 全局通用级别的初始化函数
 *
 * @export
 * @param {string} dictType
 */
export function useStore(dictType: string[]): CommonHooksState {
  // const [state, dispatch] = useRedux(common, initState);
  const [useSelector, dispatch] = useRedux();
  const state = useSelector((state) => state.common);

  const getDeptCallback = useCallback((deptData: GetDeptTreeDataCallback) => {
    const [data, treeData] = deptData;
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
    /**
     * 一级字典目录拿到之后遍历查询字典详情
     */
    if (dictList.length === 0) {
      return;
    }

    const promises = dictList.map((dict) => getDictData(dict.dictType));
    Promise.all(promises)
      .then((responses) =>
        responses.filter((res) => res.code === RESPONSE_CODE.success)
      )
      .then((responses) => {
        responses.forEach((response, index) => {
          const { data } = response;
          const { rows } = data;
          /**
           * @params {dictTypeItem} 找到分类父亲
           */
          const dictTypeItem =
            rows.length > 0
              ? dictList.find((d) => d.dictType === rows[0].dictType)
              : dictList[index];

          dispatch({
            type: ACTION_TYPES_COMMON.RECEIVE_DICT_LIST,
            payload: {
              dictType: dictTypeItem?.dictType,
              data: {
                ...dictTypeItem,
                data: rows,
              },
            },
          });
        });
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
    const promises =
      dictType.length > 0 &&
      dictType.map((type) => getDictList(type, getDictListCallback));
  }, []);

  return {
    deptList: state.deptData,
    deptTreeList: state.deptTreeData,
    dictList: state.dictList || ({} as any),
  };
}
