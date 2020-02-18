/* eslint-disable import/no-cycle */
import { ajax as rxAjax } from 'rxjs/ajax';
import { qs } from './helpers';
import { SETTINGS } from '../index';
const DEFAULT_HEADER = {
  'Content-Type': 'application/vnd.api+json',
  Accept: 'application/json' // 'Content-Type': 'application/x-www-form-urlencoded',

};
export const get = (url, params) => {
  const headers = { ...DEFAULT_HEADER,
    ...SETTINGS.requestHeaders()
  };
  return rxAjax({
    url: typeof url === 'function' ? `${url()}${qs(params)}` : `${SETTINGS.endpoint}${url}${qs(params)}`,
    method: 'GET',
    responseType: 'json',
    headers
  });
};
export const post = (url, payload) => {
  const headers = { ...DEFAULT_HEADER,
    ...SETTINGS.requestHeaders()
  };
  return rxAjax({
    url: typeof url === 'function' ? url() : `${SETTINGS.endpoint}${url}`,
    method: 'POST',
    responseType: 'json',
    headers,
    body: JSON.stringify({ ...payload
    })
  });
};
export const put = (url, payload) => {
  const headers = { ...DEFAULT_HEADER,
    ...SETTINGS.requestHeaders()
  };
  return rxAjax({
    url: typeof url === 'function' ? url() : `${SETTINGS.endpoint}${url}`,
    method: 'PUT',
    responseType: 'json',
    headers,
    body: JSON.stringify({ ...payload
    })
  });
};
export const remove = (url, payload = {}) => {
  const headers = { ...DEFAULT_HEADER,
    ...SETTINGS.requestHeaders()
  };
  return rxAjax({
    url: typeof url === 'function' ? url() : `${SETTINGS.endpoint}${url}`,
    method: 'DELETE',
    responseType: 'json',
    headers,
    body: JSON.stringify({ ...payload
    })
  });
};