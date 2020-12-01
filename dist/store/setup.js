/* eslint-disable import/no-cycle */
import { createStore, applyMiddleware, compose } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import epics from './epics';
import reducers from './reducers';
const composeEnhancers = process.env.NODE_ENV === 'production' ? compose : window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // if (sessionStorage.getItem('_dev_mode') === '1') console.log(`ENVIRONMENT: ${process.env.NODE_ENV}`);

export default function configureStore() {
  const epicMiddleware = createEpicMiddleware();
  const store = createStore(reducers, composeEnhancers(applyMiddleware(epicMiddleware)));
  epicMiddleware.run(epics);
  return store;
}