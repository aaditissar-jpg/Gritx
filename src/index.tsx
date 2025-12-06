
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// import './index.css';  <-- REMOVED TO PREVENT BUILD ERRORS

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

console.log("GRIT X: Build Refreshed - " + new Date().toLocaleTimeString());

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
