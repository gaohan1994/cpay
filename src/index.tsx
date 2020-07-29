import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';
import { store } from '@/modules/redux-store';
import { AppRouter } from '@/modules/route-container';
import './index.css';

/**
 * 使用antd  findDOMNode is deprecated in StrictMode 报错生产环境再用StrictMode吧
 * 但是不推荐这么做
 */
const RenderComponent = function () {
  return process.env.NODE_ENV === 'production' ? (
    <React.StrictMode>
      <Provider store={store}>
        <AppRouter />
      </Provider>
    </React.StrictMode>
  ) : (
    <Provider store={store}>
      <AppRouter />
    </Provider>
  );
};

ReactDOM.render(<RenderComponent />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
