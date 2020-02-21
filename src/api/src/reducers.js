/* eslint-disable no-nested-ternary */
import _ from 'lodash';
import * as c from './constants';

export const apiInitState = {};

// FOR JSON API
export const transformIncluded = (x, included) => {
  if (!included || _.isEmpty(included)) return x;
  const rowIncluded = {};
  _.forOwn(x.relationships, (v, k) => {
    rowIncluded[k] = Array.isArray(v.data)
      ? v.data.map((z) => included.find((y) => y.type === _.get(z, 'type') && y.id === _.get(z, 'id')) || {})
      : included.find((y) => y.type === _.get(v, 'data.type') && y.id === _.get(v, 'data.id')) || {};
  });
  const {
    links, relationships, type, ...rest
  } = x;
  return ({ ...rest, included: rowIncluded });
};

const transform = (raw) => {
  try {
    const { included } = raw;
    const data = Array.isArray(raw) ? raw : (Array.isArray(raw.data) ? raw.data : [raw]);
    const items = {};
    if (typeof data === 'object' && Array.isArray(data)) {
      _.forOwn(data, (v) => {
        items[v.id] = transformIncluded(v, included);
      });
    }
    if (typeof data === 'object' && !Array.isArray(data)) {
      items[data.id] = transformIncluded(data, included);
    }
    return items;
  } catch (err) {
    console.warn('Unable to parse API response!'); // eslint-disable-line
    return {};
  }
};

const formatList = (state, res) => {
  const raw = transform(res);
  var newRaw = {};
  _.forOwn(raw, (v, k) => {
    newRaw[k] = { ..._.get(state, `raw.${k}`) || {}, ...v }
  });
  const data = Array.isArray(res) ? res : Array.isArray(res.data) ? res.data : [];
  const list = data.map(x => `${x.id}`); // Object.keys(raw);

  const meta = _.get(res, 'meta') || state.meta || {}; // .map(k => newRaw[k]);

  return { ...state,
    raw: newRaw,
    list,
    meta
  };
};

const formatShow = (state, res) => {
  const raw = transform(res);
  const newRaw = {
    ...state.raw || {},
    ...raw,
  };
  const selected = _.get(res, 'data.id');
  return {
    ...state,
    raw: newRaw,
    selected,
  };
};

const startLoading = (state, { key }, loadKey) => {
  const newKey = `LOADING/${loadKey}/${key}`;
  return {
    ...state,
    [newKey]: true,
  };
};

const endLoading = (state, { key }, loadKey) => {
  const newKey = `LOADING/${loadKey}/${key}`;
  return _.omit(state, newKey);
};

export default {
  [c.GET_SET]: (state, action) => startLoading(state, action, 'get'),
  [c.GOT_SET]: (state, action) => endLoading({
    ...state,
    [action.key]: action.data,
  }, action, 'get'),
  [c.POST]: (state, action) => startLoading(state, action, 'post'),
  [c.GOT_POST]: (state, action) => endLoading(state, action, 'post'),
  [c.PUT]: (state, action) => startLoading(state, action, 'put'),
  [c.GOT_PUT]: (state, action) => endLoading(state, action, 'put'),
  [c.REMOVE]: (state, action) => startLoading(state, action, 'remove'),
  [c.GOT_REMOVE]: (state, action) => endLoading(state, action, 'remove'),

  [c.GET_LIST]: (state, action) => startLoading(state, action, 'list'),
  [c.GOT_LIST]: (state, action) => endLoading({
    ...state,
    [action.key]: formatList(state[action.key] || {}, action.res),
  }, action, 'list'),

  [c.GET_SHOW]: (state, action) => startLoading({
    ...state,
    [action.key]: {
      ..._.get(state, `${action.key}`) || {},
      selected: action.id,
    },
  }, action, action.id || 'show'),
  [c.SELECT_ID]: (state, action) => ({
    ...state,
    [action.key]: {
      ..._.get(state, action.key, {}),
      selected: action.id,
    },
  }),
  [c.GOT_SHOW]: (state, action) => endLoading({
    ...state,
    [action.key]: formatShow(state[action.key] || {}, action.res),
  }, action, action.id || 'show'),
  [c.GOT_ERROR]: (state, action) => endLoading(state, action, action.request_type),
  [c.RESET]: () => apiInitState,
};
