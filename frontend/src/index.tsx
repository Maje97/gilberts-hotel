import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Ensure rootElement is of type HTMLElement
const rootElement = document.getElementById('root') as HTMLElement;

// Create a root using React 18
const root = ReactDOM.createRoot(rootElement);

// Render the app
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);