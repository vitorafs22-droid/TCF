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
    <div className="login-page-container">
      {/* Estilos CSS dedicados para esta interface */}
      <style>{`
        .login-page-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 80vh; /* Ajuste dependendo se há header fixo ou não */
          width: 100%;
          font-family: 'Motiva Sans', Arial, sans-serif;
        }

        .login-card {
          background-color: #181a21;
          border: 1px solid #2d3138;
          border-radius: 4px;
          padding: 40px;
          width: 380px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.6);
        }

        .login-card h2 {
          font-size: 24px;
          color: #fff;
          font-weight: 300;
          margin-top: 0;
          margin-bottom: 24px;
          text-transform: none;
        }

        .input-field-group {
          margin-bottom: 20px;
        }

        .input-field-group label {
          display: block;
          font-size: 12px;
          color: #afb1b4;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .input-field-group input {
          width: 100%;
          box-sizing: border-box;
          background-color: #32353c;
          border: 1px solid #1c1e23;
          border-radius: 2px;
          padding: 10px;
          color: #fff;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
        }

        .input-field-group input:focus {
          border-color: #66c0f4;
        }

        .action-submit-btn {
          background: linear-gradient(to right, #799905 0%, #8ca909 100%);
          border: none;
          border-radius: 2px;
          color: #fff;
          width: 160px;
          padding: 12px 0;
          font-size: 15px;
          font-weight: bold;
          cursor: pointer;
          display: block;
          margin: 30px auto 0 auto;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          transition: background 0.2s;
        }

        .action-submit-btn:hover {
          background: linear-gradient(to right, #8ca909 0%, #799905 100%);
        }

        .status-message {
          text-align: center;
          margin-top: 15px;
          font-size: 14px;
          color: #ff4a4a; /* Vermelho por padrão para erros */
        }
        
        /* Cor diferenciada caso o login seja validado com sucesso */
        .status-message.success {
          color: #a4d007;
        }
      `}</style>

      <div className="login-card">
        <h2>Iniciar Sessão na Steam</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="input-field-group">
            <label htmlFor="usuario">Nome da Conta Steam</label>
            <input
              type="text"
              id="usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
            />
          </div>

          <div className="input-field-group">
            <label htmlFor="privateKey">Private Key</label>
            <input
              type="password"
              id="privateKey"
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="action-submit-btn">Entrar</button>
        </form>

        {mensagem && (
          <p className={`status-message ${mensagem === "Login válido!" ? "success" : ""}`}>
            {mensagem}
          </p>
        )}
      </div>
    </div>
  );
}
