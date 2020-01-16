/* eslint-disable import/no-mutable-exports */

/* eslint-disable import/no-cycle */
import configureStore from './store/setup';
import * as req from './src/actions';
import { useApiLoading, useApiList, useApiShow } from './hooks';
let SETTINGS = {
  endpoint: 'http://127.0.0.1:8000',
  requestHeaders: () => ({}),
  onError: () => {}
};
const store = configureStore();

const configureApi = options => {
  SETTINGS = { ...SETTINGS,
    ...options
  }; // console.log('INIT', SETTINGS);

  return store;
};

export { useApiLoading, useApiList, useApiShow, SETTINGS, configureApi, req, store };