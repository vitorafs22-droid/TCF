import './style.css'
import heroImg from './assets/hero.png'
import typescriptLogo from './assets/typescript.svg'
import viteLogo from './assets/vite.svg'
import { setupCounter } from './counter.ts'
import tiutloLogin from './componentes/tituloLogin.tsx'
import containerLogin from './componentes/containerLogin.tsx'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<>
<tituloLogin/>
<containerLogin/>
</>
` 