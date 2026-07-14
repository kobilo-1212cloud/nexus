import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { NexusProvider } from './context/NexusContext' // 👈 ADD THIS

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NexusProvider>   {/* 👈 WRAP HERE */}
      <App />
    </NexusProvider>
  </React.StrictMode>,
)