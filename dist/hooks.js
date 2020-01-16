import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import _ from 'lodash';
export const useApiLoading = (key, types) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const loader = useSelector(state => _.get(state, `api._loading.${key}`) || {}, shallowEqual);
  React.useEffect(() => {
    let newLoading = false;

    if (Array.isArray(types)) {
      _.forOwn(types, v => {
        if (loader[v]) newLoading = true;
      });
    }

    if (typeof types === 'string') {
      if (loader[types]) newLoading = true;
    }

    setIsLoading(newLoading);
  }, [loader, types]);
  return isLoading;
};
export const useApiList = key => {
  const list = useSelector(state => _.get(state, `api.${key}.list`) || [], shallowEqual);
  const pager = useSelector(state => _.get(state, `api.${key}.pager`) || {}, shallowEqual);
  const raw = useSelector(state => _.get(state, `api.${key}.raw`) || {}, shallowEqual);
  return [list.map(x => raw[x]), pager];
};
export const useApiShow = (key, id) => {
  const selected = useSelector(state => _.get(state, `api.${key}.raw.${id}`) || {}, shallowEqual);
  return selected;
};