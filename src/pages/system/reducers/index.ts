/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-08-12 09:32:25 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-08-12 09:32:46
 * 
 * @todo 应用模块的redux
 */
import { ISystemReducerInterface, IMenuItem } from '../types';
export const initState: ISystemReducerInterface.IReducerState = {
  menuList: [] as IMenuItem[],
  menuTreeData: [] as any[],
};

export const ACTION_TYPES_SYSTEM = {
  RECEIVE_MENU_LIST: 'RECEIVE_MENU_LIST',
  RECEIVE_MENU_TREE_DATA: 'RECEIVE_MENU_TREE_DATA'
};

export function system(
  state: ISystemReducerInterface.IReducerState = initState,
  action: { type: string; payload: any }
): ISystemReducerInterface.IReducerState {
  switch (action.type) {
    case ACTION_TYPES_SYSTEM.RECEIVE_MENU_LIST: {
      const { payload } = action;
      return {
        ...state,
        menuList: payload,
      };
    }
    case ACTION_TYPES_SYSTEM.RECEIVE_MENU_TREE_DATA: {
      const { payload } = action;
      return {
        ...state,
        menuTreeData: payload,
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
  system: ISystemReducerInterface.IReducerState;
} => {
  return {
    system: state.system,
  };
};
