/* eslint-disable import/no-cycle */
import { ajax as rxAjax } from 'rxjs/ajax';
import { qs } from './helpers';
import { SETTINGS } from '../index';

const DEFAULT_HEADER = {
  'Content-Type': 'application/vnd.api+json',
  Accept: 'application/json',
  // 'Content-Type': 'application/x-www-form-urlencoded',
};

export const get = (url, params, headers) => {
  const newHeaders = typeof headers === 'function'
    ? headers({ ...DEFAULT_HEADER, ...SETTINGS.requestHeaders() })
    : { ...DEFAULT_HEADER, ...SETTINGS.requestHeaders(), ...headers };
  return rxAjax({
    url: typeof url === 'function' ? `${url()}${qs(params)}` : `${SETTINGS.endpoint}${url}${qs(params)}`,
    method: 'GET',
    responseType: 'json',
    headers: newHeaders,
    timeout: SETTINGS.timeout,
  });
};

export const post = (url, payload, headers) => {
  const newHeaders = typeof headers === 'function'
    ? headers({ ...DEFAULT_HEADER, ...SETTINGS.requestHeaders() })
    : { ...DEFAULT_HEADER, ...SETTINGS.requestHeaders(), ...headers };
  return rxAjax({
    url: typeof url === 'function' ? url() : `${SETTINGS.endpoint}${url}`,
    method: 'POST',
    responseType: 'json',
    headers: newHeaders,
    body: JSON.stringify({
      ...payload,
    }),
  });
};

export const put = (url, payload, headers) => {
  const newHeaders = typeof headers === 'function'
    ? headers({ ...DEFAULT_HEADER, ...SETTINGS.requestHeaders() })
    : { ...DEFAULT_HEADER, ...SETTINGS.requestHeaders(), ...headers };
  return rxAjax({
    url: typeof url === 'function' ? url() : `${SETTINGS.endpoint}${url}`,
    method: 'PUT',
    responseType: 'json',
    headers: newHeaders,
    body: JSON.stringify({
      ...payload,
    }),
  });
};

export const remove = (url, payload = {}, headers) => {
  const newHeaders = typeof headers === 'function'
    ? headers({ ...DEFAULT_HEADER, ...SETTINGS.requestHeaders() })
    : { ...DEFAULT_HEADER, ...SETTINGS.requestHeaders(), ...headers };
  return rxAjax({
    url: typeof url === 'function' ? url() : `${SETTINGS.endpoint}${url}`,
    method: 'DELETE',
    responseType: 'json',
    headers: newHeaders,
    body: JSON.stringify({
      ...payload,
    }),
  });
};
