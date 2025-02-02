import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Landing from './components/Landing.tsx'
import Settings from './components/settings.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/game' element={<App />} />
        <Route path='/settings' element={<Settings />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
