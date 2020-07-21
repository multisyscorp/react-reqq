/* eslint-disable import/no-cycle */
import { SETTINGS, store } from '../index';
import * as c from './constants';
import storage from '../cache-storage';

const SET_OPTIONS = {
  onSuccess: () => {},
  onError: () => {},
};

const GET_OPTIONS = {
  params: {},
  onSuccess: () => {},
  onError: () => {},
  cache: false, // true,
};

export const set = (key, data) => store.dispatch({
  type: c.GOT_SET,
  key,
  data: (typeof data === 'function') ? data(store.getState().api) : data,
});

export const post = ({
  key, url, payload, ...options
}) => store.dispatch({
  type: c.POST,
  key,
  url,
  payload,
  options: { ...SET_OPTIONS, ...options },
});

export const gotPost = (doneConstant, options) => (res) => {
  setTimeout(() => { if (options.onSuccess) options.onSuccess(res, store.getState().api); }, 50);
  return {
    type: c.GOT_POST,
    key: doneConstant,
    data: res.response,
  };
};

export const put = ({
  key, url, payload, ...options
}) => store.dispatch({
  type: c.PUT,
  key,
  url,
  payload,
  options: { ...SET_OPTIONS, ...options },
});

export const gotPut = (doneConstant, options) => (res) => {
  setTimeout(() => { if (options.onSuccess) options.onSuccess(res, store.getState().api); }, 50);
  return {
    type: c.GOT_PUT,
    key: doneConstant,
    data: res.response,
  };
};

export const patch = ({
  key, url, payload, ...options
}) => store.dispatch({
  type: c.PATCH,
  key,
  url,
  payload,
  options: { ...SET_OPTIONS, ...options },
});

export const gotPatch = (doneConstant, options) => (res) => {
  setTimeout(() => { if (options.onSuccess) options.onSuccess(res, store.getState().api); }, 50);
  return {
    type: c.GOT_PATCH,
    key: doneConstant,
    data: res.response,
  };
};

export const remove = ({
  key, url, payload, ...options
}) => store.dispatch({
  type: c.REMOVE,
  key,
  url,
  payload,
  options: { ...SET_OPTIONS, ...options },
});

export const gotRemove = (doneConstant, options) => (res) => {
  setTimeout(() => { if (options.onSuccess) options.onSuccess(res, store.getState().api); }, 50);
  return {
    type: c.GOT_REMOVE,
    key: doneConstant,
    data: res.response,
  };
};

export const list = ({ key, url, ...options }) => store.dispatch({
  type: c.GET_LIST,
  key,
  url,
  options: { ...GET_OPTIONS, ...options },
});

export const get = ({ key, url, ...options }) => store.dispatch({
  type: c.GET_SET,
  key,
  url,
  options: { ...GET_OPTIONS, ...options },
});

export const show = ({
  key, url, id, ...options
}) => store.dispatch({
  type: c.GET_SHOW,
  key,
  url,
  id,
  options: { ...GET_OPTIONS, ...options },
});

export const selectId = ({ key, id }) => store.dispatch({
  type: c.SELECT_ID,
  key,
  id,
});

export const gotList = (key, options) => (res) => {
  const newRes = typeof options.transform === 'function'
    ? {
      ...res,
      response: options.transform(res.response, store.getState().api),
    } : res;
  setTimeout(() => { if (options.onSuccess) options.onSuccess(newRes, store.getState().api); }, 50);
  return {
    type: c.GOT_LIST,
    key,
    res: newRes.response || {},
  };
};

export const gotSet = (key, options) => (res) => {
  setTimeout(() => { if (options.onSuccess) options.onSuccess(res, store.getState().api); }, 50);
  return {
    type: c.GOT_SET,
    key,
    data: typeof options.transform === 'function' ? options.transform(res.response, store.getState().api) : (res.response || {}),
  };
};

export const gotShow = (key, id, options) => (res) => {
  const newRes = typeof options.transform === 'function'
    ? {
      ...res,
      response: options.transform(res.response, store.getState().api),
    } : res;
  setTimeout(() => { if (options.onSuccess) options.onSuccess(newRes, store.getState().api); }, 50);
  return {
    type: c.GOT_SHOW,
    key,
    res: newRes.response || {},
    id,
  };
};

export const gotError = ({ key, options }, request_type) => (res) => new Promise((r) => {
  if (options.onError) options.onError(res);
  SETTINGS.onError(res);
  r({
    type: c.GOT_ERROR,
    key,
    error: res || {},
    request_type,
  });
});

export const reset = () => store.dispatch({ type: c.RESET });

export const cancelAll = () => store.dispatch({ type: 'CANCEL' });

export const clearCache = () => storage.clear();
