import { useState } from "react";
import {SalvarCookie, gerarToken, getDataHoje} from "../auth.js"

export default function ContainerLogin() {
    const [Usuario, setUsuario] = useState("");
    const [Senha, setSenha] = useState("");
    const [mensagem, setMensagem] = useState("");

    async function entrar() {
                // alert(`Usuário=${Usuario}, 
                //        Senha=${Senha}
            //        `);
            const bancoDeDados = await (await fetch("/users.json")).json();
            const usuarioEncontrado = bancoDeDados.find((user) => user.usuario === Usuario && user.privateKey === Senha);
            if (usuarioEncontrado) {
                const data = getDataHoje();
                const token = await gerarToken(usuarioEncontrado.usuario, usuarioEncontrado.privateKey, data);
                SalvarCookie(token);

            } else {
                setMensagem("Usuário ou senha inválidos");
            }
        }

        return (
            <>
                <label htmlFor="Usuario">Username:</label>
                <input type="text" id="Usuario" value={Usuario} onChange={(e) => setUsuario(e.target.value)} />
                <br/>
                <label htmlFor="Senha">Senha:</label>
                <input type="password" id="Senha" value={Senha} onChange={(e) => setSenha(e.target.value)} />
                <br/>
                <p>{mensagem}</p>
                <br/>
                <br/>
                <button onClick={entrar}>Entrar</button>
            </>
        )
    }


