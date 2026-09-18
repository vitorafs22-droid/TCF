export function getDataHoje() {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const dia = String(hoje.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
}

export async function sha256(text) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function gerarToken(usuario, privateKey, data) {
    return sha256( usuario + privateKey + data);
   
}   

const NOME_COKKIE = "auth_session";
export function SalvarCookie(token) {
    document.cookie = `${NOME_COKKIE}=${token}; path=/`;

}




