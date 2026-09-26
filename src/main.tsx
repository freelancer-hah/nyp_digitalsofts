import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './context/ThemeContext'

// Force instant global wipe of all previous browser local storage cache
if (typeof window !== 'undefined' && localStorage.getItem('nyp_total_wipe_v100') !== 'true') {
  try {
    localStorage.clear();
    sessionStorage.clear();
  } catch (e) {}
  localStorage.setItem('nyp_total_wipe_v100', 'true');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)


