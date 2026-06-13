import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'

const GOOGLE_CLIENT_ID = "42013750449-jotp40p91osareho8b9rmj4b7p80k93b.apps.googleusercontent.com"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <App />
        <Toaster position="top-center" />
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>,
)
