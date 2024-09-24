import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <nav>
      <h1>Note Taker</h1>
    </nav>
    <App />
  </StrictMode>,
)
