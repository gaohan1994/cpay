/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-08-12 09:32:25 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-08-12 09:32:46
 * 
 * @todo 应用模块的redux
 */
import { IAppReducerInterface, IUploadAppInfo } from '../types';
export const initState: IAppReducerInterface.IReducerState = {
  appInfo: {} as IUploadAppInfo,
};

export const ACTION_TYPES_APP = {
  RECEIVE_APP_INFO: 'RECEIVE_APP_INFO',
};

export function app(
  state: IAppReducerInterface.IReducerState = initState,
  action: { type: string; payload: any }
): IAppReducerInterface.IReducerState {
  switch (action.type) {
    case ACTION_TYPES_APP.RECEIVE_APP_INFO: {
      const { payload } = action;
      return {
        ...state,
        appInfo: payload,
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
  app: IAppReducerInterface.IReducerState;
} => {
  return {
    app: state.app,
  };
};
