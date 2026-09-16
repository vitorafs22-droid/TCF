import { useState } from "react";

export default function containerLogin() {
    const [Usuario, setUsuario] = useState("");
    const [Senha, setSenha] = useState("");

    function entrar() {
        alert(`Usuário=${Usuario}, 
               Senha=${Senha}
               `);
    }

    return (
        <>
            <label htmlFor="Usuario">Username:</label>
            <input type="text" id="Usuario" value={Usuario} onChange={(e) => setUsuario(e.target.value)} />
            <br/>
            <label htmlFor="Senha">Senha:</label>
            <input type="password" id="Senha" value={Senha} onChange={(e) => setSenha(e.target.value)} />
            <br/>
            <br/>
            <button onClick={entrar}>Entrar</button>
        </>
    )
}


