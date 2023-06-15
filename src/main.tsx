import React from 'react'
import ReactDOM from 'react-dom/client'
import { AuthContextProvider } from './context/authContext.tsx';
import App from './App.tsx'
import './index.css'


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>,
  </React.StrictMode>
)
