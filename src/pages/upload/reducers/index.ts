import { IUploadReducerInterface } from "../types";
import { ISoftInfo } from '../types/index';

/*
 * @Author: centerm.gaozhiying 
 * @Date: 2020-08-12 09:32:25 
 * @Last Modified by: centerm.gaozhiying
 * @Last Modified time: 2020-08-12 15:34:27
 * 
 * @todo 应用模块的redux
 */
export const initState: IUploadReducerInterface.IReducerState = {
  
};

export const ACTION_TYPES_UPLOAD = {
  // RECEIVE_SOFT_INFO: 'RECEIVE_SOFT_INFO',
};

export function upload(
  state: IUploadReducerInterface.IReducerState = initState,
  action: { type: string; payload: any }
): IUploadReducerInterface.IReducerState {
  switch (action.type) {
    // case ACTION_TYPES_UPLOAD.RECEIVE_SOFT_INFO: {
    //   const { payload } = action;
    //   return {
    //     ...state,
    //     softInfo: payload,
    //   };
    // }
    default:
      return {
        ...state,
      };
  }
}

export const connectCommonReducer = (
  state: any
): {
  upload: IUploadReducerInterface.IReducerState;
} => {
  return {
    upload: state.upload,
  };
};
