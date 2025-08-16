import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import  App  from './App.tsx'
// import SampleApp from './app_sample.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    {/* <SampleApp />  */}
  </StrictMode>,
)
