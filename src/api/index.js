/* eslint-disable import/no-mutable-exports */
/* eslint-disable import/no-cycle */
import configureStore from './store/setup';
import * as req from './src/actions';
import {
  useApiLoading,
  useApiList,
  useApiShow,
  useApiGet,
} from './hooks';
import storage from './cache-storage';

let SETTINGS = {
  endpoint: 'http://127.0.0.1:8000',
  requestHeaders: () => ({}),
  onError: () => {},
  timeout: 120000,
  cacheStorage: 'LOCALSTORAGE',
};

const store = configureStore();

const STORE_TYPES = {
  INDEXEDDB: storage.INDEXEDDB,
  LOCALSTORAGE: storage.LOCALSTORAGE,
  WEBSQL: storage.WEBSQL,
};

const configureApi = (options) => {
  SETTINGS = { ...SETTINGS, ...options };

  storage.config({
    driver: STORE_TYPES[SETTINGS.cacheStorage] || storage.LOCALSTORAGE,
    name: 'reqq',
  });
  // console.log('INIT', SETTINGS);
  return store;
};

export {
  useApiLoading,
  useApiList,
  useApiShow,
  useApiGet,
  SETTINGS,
  configureApi,
  req,
  store,
};
