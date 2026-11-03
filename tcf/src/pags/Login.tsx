import { useState } from "react";
import { getDataHoje, gerarToken, salvarSessaoNoCookie } from "../auth.js";

export default function Login({ onLoginSucesso }) {
  const [usuario, setUsuario] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [mensagem, setMensagem] = useState("");

  async function handleSubmit(evento) {
    evento.preventDefault();
    setMensagem("Verificando...");

    const resposta = await fetch("/users.json");
    const usuarios = await resposta.json();

    const usuarioEncontrado = usuarios.find((u) => u.usuario === usuario.trim());

    if (!usuarioEncontrado) {
      setMensagem("Usuário não encontrado.");
      return;
    }

    if (usuarioEncontrado.privateKey !== privateKey) {
      setMensagem("Private key incorreta.");
      return;
    }

    const hoje = getDataHoje();
    const token = await gerarToken(usuarioEncontrado.usuario, usuarioEncontrado.privateKey, hoje);

    salvarSessaoNoCookie(usuarioEncontrado.usuario, token);
    setMensagem("Login válido!");

    onLoginSucesso({ usuario: usuarioEncontrado.usuario, token, data: hoje });
  }

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Usuário:
          <input
            type="text"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            required
          />
        </label>
        <br /><br />
        <label>
          Private Key:
          <input
            type="password"
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
            required
          />
        </label>
        <br /><br />
        <button type="submit">Entrar</button>
      </form>

      <p>{mensagem}</p>
    </div>
  );
}