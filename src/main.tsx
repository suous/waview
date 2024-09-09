/** @format */

import * as React from 'react';
import ReactDOM from 'react-dom/client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import './App.css';
import App from './App';
import resources from './locales/resources';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'zh',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  })
  .catch(console.error);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
