import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { homeReducer } from '@/pages/home/reducers/home';
import { common } from '@/pages/common/reducer';
import { advert } from '@/pages/advertisement/reducers';
import { app } from '@/pages/application/reducers';
import { upload } from '@/pages/upload/reducers';

export const reducer = combineReducers({
  homeReducer,
  common,
  advert,
  app,
  upload
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
