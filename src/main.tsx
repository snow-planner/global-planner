import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

try {
  const code = new URLSearchParams(window.location.search).get('code')
  if (code) localStorage.setItem('snow-planner:code', code)
} catch {
  // 저장 실패해도 화면은 동작
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
