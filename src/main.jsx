import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Mesh from './components/Mesh';
import { AppProvider } from './state/AppContext';
import { ConfirmProvider } from './components/ConfirmDialog';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppProvider>
      <ConfirmProvider>
        <Mesh />
        <div className="relative z-[1]">
          <App />
        </div>
      </ConfirmProvider>
    </AppProvider>
  </React.StrictMode>
);
