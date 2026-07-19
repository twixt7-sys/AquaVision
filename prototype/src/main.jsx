import React from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner';
import './shared/styles/index.css';
import './styles/charts.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Toaster theme="light" position="top-center" richColors closeButton />
  </React.StrictMode>,
);
