import './style.css'
import { setupCounter} from './counter.ts'
import {BrowserRouter} from 'react-router'
import React from 'react'
import ReactDOM from 'react-dom/client'

ReactDOM.createRoot(document.getElementById('root')!).render(
  
  <React.StrictMode>
  <App/>
  </React.StrictMode>
);