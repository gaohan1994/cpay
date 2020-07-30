import { Reducer, compose } from 'redux';
import { useReducer, Dispatch } from 'react';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import {
  useSelector as useSelectorNoType,
  useDispatch,
  TypedUseSelectorHook,
} from 'react-redux';
import { reducer } from '@/modules/redux-store';

/**
 * 支持 dispatch 多个 action dispatch([action1,action2,action3])
 * @param next dispatch
 */
export const reduxMultiAction = (next: any) => (action: any) => {
  if (action) {
    if (Array.isArray(action)) {
      action.map((item) => next(item));
    } else {
      next(action);
    }
  }
};

export const useReducerT = <T>(reducer: Reducer, initState?: any): any[] => {
  const [state, dispatch] = useReducer(reducer, initState || {});
  const middlewares: Function[] = [thunk, createLogger(), reduxMultiAction];
  const newDispatch: any = compose(...middlewares)(dispatch);
  return [state, newDispatch];
};

export const useRedux = (): [
  TypedUseSelectorHook<ReturnType<typeof reducer>>,
  Dispatch<any>
] => {
  const useSelector: TypedUseSelectorHook<ReturnType<
    typeof reducer
  >> = useSelectorNoType;
  const dispatch = useDispatch();

  return [useSelector, dispatch];
};

export const useSelectorHook = <TSelected>(
  select: (state: ReturnType<typeof reducer>) => TSelected,
  equalityFn?: (left: TSelected, right: TSelected) => boolean
): TSelected => {
  return useSelectorNoType(select, equalityFn);
};
