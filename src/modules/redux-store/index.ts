import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { homeReducer } from '@/pages/home/reducers/home';
import common from '@/pages/common/reducer';

const reducer = combineReducers({
  homeReducer,
  common,
});

const configureStore = () => {
  const store =
    (process.env.NODE_ENV as string) === 'prodcution'
      ? createStore(reducer, compose(applyMiddleware(thunk)))
      : createStore(reducer, compose(applyMiddleware(thunk, logger)));

  return store;
};

export const store = configureStore();

export default store;
