import { apagarSessaoDoCookie } from "../auth.js";

export default function Home({ sessao, onLogout }) {
  
  return (
    <div>
      <h1>Área Restrita</h1>
      <p>Bem-vindo(a), <b>{sessao.usuario}</b>!</p>
      <p>Token do dia: {sessao.token}</p>
      <button onClick={handleLogout}>Sair</button>
    </div>
  );
}