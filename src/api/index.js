/* eslint-disable import/no-mutable-exports */
/* eslint-disable import/no-cycle */
import configureStore from './store/setup';
import * as req from './src/actions';

let SETTINGS = {
  endpoint: '127.0.0.1:8000',
  requestHeaders: () => ({}),
  onError: () => {},
};

const store = configureStore();

const configureApi = (options) => {
  SETTINGS = { ...SETTINGS, ...options };
  // console.log('INIT', SETTINGS);
  return store;
};

export {
  SETTINGS,
  configureApi,
  req,
  store,
};
