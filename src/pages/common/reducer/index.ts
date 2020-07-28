import { CommonReducerInterface } from '../type';
export const initState: CommonReducerInterface.ICommonReducerState = {
  deptData: [],
  deptTreeData: [],
};

export const ACTION_TYPES_COMMON = {
  RECEIVE_DEPT_DATA: 'RECEIVE_DEPT_DATA',
  RECEIVE_DEPT_TREE_DATA: 'RECEIVE_DEPT_TREE_DATA',
};

export default (
  state: CommonReducerInterface.ICommonReducerState,
  action: { type: string; payload: any }
): CommonReducerInterface.ICommonReducerState => {
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
    default:
      return {
        ...state,
      };
  }
};

export const connectCommonReducer = (
  state: any
): {
  common: CommonReducerInterface.ICommonReducerState;
} => {
  return {
    common: state.common,
  };
};
