import React from 'react';
import logo from './logo.svg';
import './App.css';
import { req, useApiLoading, useApiGet } from './api';

function App() {
  const isLoading = useApiLoading('test', 'get');
  const data = useApiGet('test', []);
  React.useEffect(() => {
    req.get({
      key: 'test',
      url: '/foo',
    });
  }, []);
  console.log(data); // eslint-disable-line
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          {isLoading ? 'Loading...' : 'Testing'}
        </p>
      </header>
    </div>
  );
}

export default App;
