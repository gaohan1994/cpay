import { CommonReducerInterface } from '../type';
export const initState: CommonReducerInterface.ICommonReducerState = {
  deptData: [],
  deptTreeData: [],
  dictList: {},
};

export const ACTION_TYPES_COMMON = {
  RECEIVE_DEPT_DATA: 'RECEIVE_DEPT_DATA',
  RECEIVE_DEPT_TREE_DATA: 'RECEIVE_DEPT_TREE_DATA',
  RECEIVE_DICT_LIST: 'RECEIVE_DICT_LIST',
};

export function common(
  state: CommonReducerInterface.ICommonReducerState = initState,
  action: { type: string; payload: any }
): CommonReducerInterface.ICommonReducerState {
  switch (action.type) {
    case ACTION_TYPES_COMMON.RECEIVE_DEPT_DATA: {
      const { payload } = action;
      console.log('payload:', payload);
      return {
        ...state,
        deptData: payload,
      };
    }
    case ACTION_TYPES_COMMON.RECEIVE_DEPT_TREE_DATA: {
      const { payload } = action;
      console.log('RECEIVE_DEPT_TREE_DATA payload', payload);
      return {
        ...state,
        deptTreeData: payload,
      };
    }
    case ACTION_TYPES_COMMON.RECEIVE_DICT_LIST: {
      const { payload } = action;
      console.log('RECEIVE_DICT_LIST payload', payload);
      return {
        ...state,
        dictList: {
          ...state.dictList,
          [payload.dictType]: payload.data,
        },
      };
    }
    default:
      return {
        ...state,
      };
  }
}

export const connectCommonReducer = (
  state: any
): {
  common: CommonReducerInterface.ICommonReducerState;
} => {
  return {
    common: state.common,
  };
};
