import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom"
import Home from './home';
import store from './store/store';
import { Provider } from 'react-redux';
import Analytics from './components/analytics';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';

const persistor = persistStore(store)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <BrowserRouter>
          <Routes>
            {/*Below are the routes for different modules */}
            <Route exact path="/" element={<Home />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </>
);

reportWebVitals();
