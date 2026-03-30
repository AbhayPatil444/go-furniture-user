import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './layout.css';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
//redux related imports
import {Provider} from 'react-redux';
import store from './reduxStore/store.js';

import { BrowserRouter } from 'react-router-dom';
import { ToastContainer, Bounce } from 'react-toastify';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <ToastContainer
          position="top-center"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover={false}
          draggable
          theme="light"
          transition={Bounce}
          />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
