import { UserInterface } from '../types';
import { RESPONSE_CODE } from '@/common/config';
import ApiRequest from '@/common/request-util';

export const initState: UserInterface.IUserReducerState = {
  menus: [],
  user: {},
};



export const ACTION_TYPES_USER = {
  RECEIVE_MENU_USER: 'RECEIVE_MENU_USER',
};

export function user(state = initState, action: { type: string; payload: any }): UserInterface.IUserReducerState {
  switch (action.type) {
    case ACTION_TYPES_USER.RECEIVE_MENU_USER: {
      const { payload } = action;
      return {
        ...state,
        ...payload,
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
  user: UserInterface.IUserReducerState;
} => {
  return {
    user: state.user,
  };
};
