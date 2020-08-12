import { CommonReducerInterface } from '../type';
import { UserDept } from '@/common/type';
export const initState: CommonReducerInterface.ICommonReducerState = {
  deptData: [],
  deptTreeData: [],
  dictList: {},
  userDept: {} as UserDept,
};

export const ACTION_TYPES_COMMON = {
  RECEIVE_DEPT_DATA: 'RECEIVE_DEPT_DATA',
  RECEIVE_DEPT_TREE_DATA: 'RECEIVE_DEPT_TREE_DATA',
  RECEIVE_DICT_LIST: 'RECEIVE_DICT_LIST',
  RECEIVE_USER_DEPT: 'RECEIVE_USER_DEPT',
};

export function common(
  state: CommonReducerInterface.ICommonReducerState = initState,
  action: { type: string; payload: any }
): CommonReducerInterface.ICommonReducerState {
  switch (action.type) {
    case ACTION_TYPES_COMMON.RECEIVE_DEPT_DATA: {
      const { payload } = action;
      return {
        ...state,
        deptData: payload,
      };
    }
    case ACTION_TYPES_COMMON.RECEIVE_DEPT_TREE_DATA: {
      const { payload } = action;
      return {
        ...state,
        deptTreeData: payload,
      };
    }
    case ACTION_TYPES_COMMON.RECEIVE_DICT_LIST: {
      const { payload } = action;
      return {
        ...state,
        dictList: {
          ...state.dictList,
          [payload.dictType]: payload.data,
        },
      };
    }
    case ACTION_TYPES_COMMON.RECEIVE_USER_DEPT: {
      const { payload } = action;
      return {
        ...state,
        userDept: payload,
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
