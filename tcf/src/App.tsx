import { useEffect, useState } from "react";
import { getSessaoValidaDeHoje } from "./auth.js";
import Login from "./pags/Login.tsx";
import Loja from "./pags/Loja.tsx";

export default function App() {
  const [sessao, setSessao] = useState(undefined);

  useEffect(() => {
    async function checarSessao() {
      const sessaoValida = await getSessaoValidaDeHoje();
      setSessao(sessaoValida);
    }
    checarSessao();
  }, []);

  if (sessao === undefined) {
    return <p>Carregando...</p>;
  }

  if (!sessao) {
    return <Login onLoginSucesso={(novaSessao) => setSessao(novaSessao)} />;
  }

  return <Loja sessao={sessao} onLogout={() => setSessao(null)} />;
}