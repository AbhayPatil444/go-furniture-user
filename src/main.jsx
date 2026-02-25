import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
//redux related imports
import {Provider} from 'react-redux';
import store from './reduxStore/store.js';

import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify/unstyled';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <ToastContainer
          position="top-center"
          autoClose={2500}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
          theme="colored"
          />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
