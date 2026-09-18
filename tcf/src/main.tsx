import './style.css'
import TituloLogin from './componentes/TituloLogin.tsx'
import ContainerLogin from './componentes/ContainerLogin.tsx'
import React from 'react'
import ReactDOM from 'react-dom/client'

ReactDOM.createRoot(document.getElementById('app')!).render(
  <React.StrictMode>
    <div>
      <TituloLogin />
      <ContainerLogin />
    </div>
  </React.StrictMode>
)