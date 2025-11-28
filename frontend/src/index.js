import React from 'react';
import ReactDOM from 'react-dom/client';

// Import your new modular CSS files
import './styles/global.css';
import './styles/navbar.css';
import './styles/auth.css';
import './styles/dashboard.css';

import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();