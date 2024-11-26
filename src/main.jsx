import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AuthProvider from './components/auth/authProvider'
import SocketProvider from './components/sockets/SocketProvider'

import './assets/styles/main.css'


import Routing from './components/routing'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div className="main-container">
      <AuthProvider>
        <SocketProvider>
          <Routing />
        </SocketProvider>
      </AuthProvider>
    </div>
  </StrictMode>,
)
