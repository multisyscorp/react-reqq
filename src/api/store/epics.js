/* eslint-disable import/no-cycle */
import { combineEpics } from 'redux-observable';
import api from '../src/epics';

export default combineEpics(
  api,
);
