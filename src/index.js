import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './state/store/store';

const root = ReactDOM.createRoot(document.getElementById('root'));
// Mount the app once and expose router + redux context to the entire component tree.
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider> 
    </BrowserRouter>
  </React.StrictMode>
);

// Keep this hook so perf metrics can be wired to analytics later if needed.
reportWebVitals();
