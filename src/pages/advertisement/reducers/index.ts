import { IAdvertReducerInterface } from '../types';
export const initState: IAdvertReducerInterface.IReducerState = {};

export const ACTION_TYPES_COMMON = {};

export function advert(
  state: IAdvertReducerInterface.IReducerState = initState,
  action: { type: string; payload: any }
): IAdvertReducerInterface.IReducerState {
  switch (action.type) {
    default:
      return {
        ...state,
      };
  }
}
