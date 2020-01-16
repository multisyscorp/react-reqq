import React from 'react';
import logo from './logo.svg';
import './App.css';
import { req, useApiLoading } from './api';

function App() {
  const isLoading = useApiLoading('test', 'get');
  React.useEffect(() => {
    req.get({
      key: 'test',
      url: '/foo',
    });
  }, []);
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
