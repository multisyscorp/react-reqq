import { combineReducers } from 'redux';
import api, { apiInitState } from '../src/reducers';

const mapReduce = (actions, initState) => (state = initState, action) => {
  if (actions[action.type]) {
    return actions[action.type](state, action);
  }
  return state;
};


export default combineReducers({
  api: mapReduce(api, apiInitState),
});
