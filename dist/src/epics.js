/* eslint-disable import/no-cycle */
import { combineEpics, ofType } from 'redux-observable';
import _ from 'lodash';
import { map, mergeMap, catchError, takeUntil } from 'rxjs/operators';
import md5 from 'md5';
import storage from '../cache-storage';
import { store } from '../index';
import * as actions from './actions';
import * as c from './constants';
import { qs } from './helpers';
import * as services from './services';

const cancelOngoing = req => {
  store.dispatch({
    type: req.key
  });
  return req;
};

const transformParams = params => {
  if (typeof params === 'function') return params(store.getState().api);
  return params;
};

const checkCache = req => new Promise(resolve => {
  const params = transformParams(_.get(req, 'options.params') || {});

  const _cacheKey = md5(_.get(req, 'options.cacheKey') || `${typeof req.url === 'function' ? req.url() : req.url}${qs(params)}`);

  const _isCacheEnabled = _.get(req, 'options.cache');

  store.dispatch({
    type: _cacheKey
  });

  if (_isCacheEnabled) {
    // console.log('GET CACHE!', _cacheKey);
    storage.getItem(_cacheKey, (err, value) => {
      if (err) resolve({ ...req,
        _cacheKey,
        _isCacheEnabled
      });
      resolve({ ...req,
        _cacheKey,
        _isCacheEnabled,
        _cache: value
      });
    });
    return;
  }

  storage.keys().then(k => {
    k.filter(x => x.indexOf(_cacheKey) > -1).map(y => storage.removeItem(y));
    resolve({ ...req,
      _cacheKey,
      _isCacheEnabled
    });
  });
});

const updateCache = (_isCacheEnabled, _cacheKey) => req => {
  if (_isCacheEnabled && req.status === 200 && !_.isEmpty(_.get(req, 'response', ''))) {
    // console.log('SET CACHE!');
    storage.setItem(_cacheKey, req);
  }

  return req;
};

const _list = action$ => action$.pipe(ofType(c.GET_LIST), mergeMap(checkCache), mergeMap(x => {
  const {
    key,
    url,
    options,
    _cache,
    _cacheKey,
    _isCacheEnabled
  } = x;

  if (options.cache && !!_cache) {
    return new Promise(r => r(actions.gotList(key, options)(_cache)));
  }

  return services.get(url, transformParams(options.params || {}), options.headers || {}).pipe(map(updateCache(_isCacheEnabled, _cacheKey)), map(actions.gotList(key, options)), catchError(actions.gotError(x, 'list')), takeUntil(action$.pipe(ofType('CANCEL'))), takeUntil(action$.pipe(ofType(_cacheKey))));
}));

const _get = action$ => action$.pipe(ofType(c.GET_SET), mergeMap(checkCache), mergeMap(x => {
  const {
    key,
    url,
    options,
    _cache,
    _cacheKey,
    _isCacheEnabled
  } = x;

  if (options.cache && !!_cache) {
    return new Promise(r => r(actions.gotSet(key, options)(_cache)));
  }

  return services.get(url, transformParams(options.params || {}), options.headers || {}).pipe(map(updateCache(_isCacheEnabled, _cacheKey)), map(actions.gotSet(key, options)), catchError(actions.gotError(x, 'get')), takeUntil(action$.pipe(ofType('CANCEL'))), takeUntil(action$.pipe(ofType(_cacheKey))));
}));

const _show = action$ => action$.pipe(ofType(c.GET_SHOW), mergeMap(checkCache), mergeMap(x => {
  const {
    key,
    url,
    id,
    options,
    _cache,
    _cacheKey,
    _isCacheEnabled
  } = x;

  if (options.cache && !!_cache) {
    return new Promise(r => r(actions.gotShow(key, id, options)(_cache)));
  }

  return services.get(url, transformParams(options.params || {}), options.headers || {}).pipe(map(updateCache(_isCacheEnabled, _cacheKey)), map(actions.gotShow(key, id, options)), catchError(actions.gotError(x, 'show')), takeUntil(action$.pipe(ofType('CANCEL'))), takeUntil(action$.pipe(ofType(_cacheKey))));
}));

const _post = action$ => action$.pipe(ofType(c.POST), map(cancelOngoing), mergeMap(x => {
  const {
    key,
    url,
    payload,
    options
  } = x;
  return services.post(url, payload || {}, options.headers || {}).pipe(map(actions.gotPost(key, options)), catchError(actions.gotError(x, 'post')), takeUntil(action$.pipe(ofType('CANCEL'))), takeUntil(action$.pipe(ofType(key))));
}));

const _put = action$ => action$.pipe(ofType(c.PUT), map(cancelOngoing), mergeMap(x => {
  const {
    key,
    url,
    payload,
    options
  } = x;
  return services.put(url, payload || {}, options.headers || {}).pipe(map(actions.gotPut(key, options)), catchError(actions.gotError(x, 'put')), takeUntil(action$.pipe(ofType('CANCEL'))), takeUntil(action$.pipe(ofType(key))));
}));

const _patch = action$ => action$.pipe(ofType(c.PATCH), map(cancelOngoing), mergeMap(x => {
  const {
    key,
    url,
    payload,
    options
  } = x;
  return services.patch(url, payload || {}, options.headers || {}).pipe(map(actions.gotPatch(key, options)), catchError(actions.gotError(x, 'patch')), takeUntil(action$.pipe(ofType('CANCEL'))), takeUntil(action$.pipe(ofType(key))));
}));

const _remove = action$ => action$.pipe(ofType(c.REMOVE), map(cancelOngoing), mergeMap(x => {
  const {
    key,
    url,
    payload,
    options
  } = x;
  return services.remove(url, payload || {}, options.headers || {}).pipe(map(actions.gotRemove(key, options)), catchError(actions.gotError(x, 'remove')), takeUntil(action$.pipe(ofType('CANCEL'))), takeUntil(action$.pipe(ofType(key))));
}));

export default combineEpics(_list, _show, _get, _post, _put, _patch, _remove);