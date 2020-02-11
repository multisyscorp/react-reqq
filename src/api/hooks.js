import { useSelector, shallowEqual } from 'react-redux';
import _ from 'lodash';

export const useApiLoading = (key, type) => {
  const loading = useSelector(state => !!_.get(state, `api.LOADING/${type}/${key}`), shallowEqual);
  return loading;
};

export const useApiList = (key) => {
  const list = useSelector((state) => _.get(state, `api.${key}.list`) || [], shallowEqual);
  const meta = useSelector((state) => _.get(state, `api.${key}.meta`) || {}, shallowEqual);
  const raw = useSelector((state) => _.get(state, `api.${key}.raw`) || {}, shallowEqual);
  return [
    list.map((x) => raw[x]),
    meta,
  ];
};

export const useApiShow = (key, id) => {
  const selected = useSelector((state) => _.get(state, `api.${key}.raw.${id}`) || {}, shallowEqual);
  return selected;
};

export const useApiGet = (key, default_value = {}) => {
  const selected = useSelector((state) => _.get(state, `api.${key}`) || default_value, shallowEqual);
  return selected;
};
