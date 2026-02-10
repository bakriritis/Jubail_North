import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import emailjs from '@emailjs/browser';

emailjs.init(process.env.REACT_APP_EMAILJS_PUBLIC_KEY!);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
