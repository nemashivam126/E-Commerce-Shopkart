import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store } from './store.js'
import { persistStore } from 'redux-persist'
import AppThemeProvider from './Theme/ThemeProvider/ThemeProvider.jsx'

let persistor = persistStore(store);
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppThemeProvider><App /></AppThemeProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
)
