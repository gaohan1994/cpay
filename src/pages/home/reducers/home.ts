import { HomeInterface } from '../types';
export const initState: HomeInterface.IHomeReducerState = {
  test: {},
};

export const ACTION_TYPES = {};

export const actions = {};

export function homeReducer(
  state = initState,
  action: any
): HomeInterface.IHomeReducerState {
  return {
    ...state,
  };
}
