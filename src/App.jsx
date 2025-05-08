import React from 'react';
import './App.css'
import './styles/custom.css'
import AppRoutes from './routes/AppRoutes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GlobalStateProvider } from './store/GlobalStateContext';

function App() {
  return (
    <>
      <GlobalStateProvider>

        <AppRoutes />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </GlobalStateProvider>

    </>
  );
}

export default App;
