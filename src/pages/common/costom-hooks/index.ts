import { useCallback, useEffect, useState } from 'react';
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
  const parentId = state?.userDept?.parentId

  const [timer, setTimer] = useState(0);

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
    if (dictList.length === 0) {
      return;
    }

    dictList.map((item) => {
      dispatch({
        type: ACTION_TYPES_COMMON.RECEIVE_DICT_LIST,
        payload: {
          dictType: item.dictType,
          data: {
            dictName: item.dictName || '',
            dictType: item.dictType || '',
            data: item.dictDataList || []
          }
        },
      });
    })

    // const promises = dictList.map((dict) => getDictData(dict.dictType));
    // Promise.all(promises)
    //   // .then((responses) =>
    //   //   responses.filter((res) => res.code === RESPONSE_CODE.success)
    //   // )
    //   .then((responses) => {
    //     responses.forEach((response, index) => {
    //       let data: any = { rows: [] };
    //       if (response.code === RESPONSE_CODE.success && response.data) {
    //         data = response.data;
    //       }
    //       const { rows } = data;
    //       /**
    //        * @params {dictTypeItem} 找到分类父亲
    //        */
    //       const dictTypeItem =
    //         rows.length > 0
    //           ? dictList.find((d) => d.dictType === rows[0].dictType)
    //           : dictList[index];

    //       dispatch({
    //         type: ACTION_TYPES_COMMON.RECEIVE_DICT_LIST,
    //         payload: {
    //           dictType: dictTypeItem?.dictType,
    //           data: {
    //             ...dictTypeItem,
    //             data: rows,
    //           },
    //         },
    //       });
    //     });
    //   });
  }, []);

  useEffect(() => {
    /**
     * 请求机构数据
     * @time 1014加入缓存机制，全局请求一次
     */
    // if (state.deptData.length === 0 && timer < 3) {
      getDeptTreeData(getDeptCallback);
      setTimer(prevTimer => prevTimer + 1);
    // }
  }, [parentId])

  useEffect(() => {

    /**
     * 请求字典数据
     */
    const promises =
      dictType.length > 0 && getDictList(dictType, getDictListCallback)
      // dictType.map((type) => getDictList(type, getDictListCallback));

  }, []);

  const isLoading = () => {
    let flag = false;
    for (let i = 0; i < dictType.length; i++) {
      if (!(dictType[i] && state.dictList && state.dictList[dictType[i]])) {
        flag = true;
        break;
      }
    }
    return flag;
  }

  return {
    deptList: state.deptData,
    deptTreeList: state.deptTreeData,
    dictList: state.dictList || ({} as any),
    loading: isLoading()
  };
}
