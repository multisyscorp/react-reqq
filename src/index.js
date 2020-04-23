import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import App2 from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import { configureApi, req, useApiGet } from './api';

const c = {
  FOO1: 'CONSTANT_1',
  FOO2: 'CONSTANT_2',
  FOO3: 'CONSTANT_3',
  FOO1_INIT_VALUE: [],
  FOO2_INIT_VALUE: [],
  FOO3_INIT_VALUE: [],
}

export const store = configureApi({
  endpoint: 'http://localhost:8000',
  defaultValue: {
    [c.FOO1]: c.FOO1_INIT_VALUE,
    [c.FOO2]: c.FOO2_INIT_VALUE,
    [c.FOO3]: c.FOO3_INIT_VALUE,
  },
});

const App = () => {
  const [counter, setCounter] = React.useState(0);
  React.useEffect(() => {
    console.log('call this');
    req.get({
      key: 'LOAD_THIS',
      url: () => 'https://coronavirus-tracker-api.herokuapp.com/v2/locations',
      // url: () => 'https://swapi.co/api/people/1',
      // headers: {
      //   foo: 'asd',
      // },
      transform: (res) => {
        console.log('response', res);
        return res;
      },
      cache: false,
    });
    setTimeout(() => {
      req.cancelAll();
    }, 500);
  }, []);
  const a = useApiGet('FOO', {});
  React.useEffect(() => {
    console.log('changed!', a);
  }, [a]);
  return (
    <div>
      SAMPLE THISS
    <button onClick={() => setCounter(counter + 1)} type="button">{counter}</button>
    </div>
  )
};

ReactDOM.render(
  <Provider store={store}>
    <App />
    {/* <App2 /> */}
  </Provider>
, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
