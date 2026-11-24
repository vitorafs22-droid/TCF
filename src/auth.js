// 1. Pega a data de hoje no formato YYYY-MM-DD
export function getDataHoje() {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

// 2. Embaralha o texto usando SHA-256 nativo do navegador
export async function sha256(texto) {
  const encoder = new TextEncoder();
  const dados = encoder.encode(texto);
  const hashBuffer = await crypto.subtle.digest("SHA-256", dados);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// 3. Junta Usuário + Senha + Data e gera o Token Diário
export async function gerarToken(usuario, privateKey, data) {
  return sha256(usuario + privateKey + data);
}

const COOKIE_USER = "auth_user";
const COOKIE_TOKEN = "auth_token";

export function salvarSessaoNoCookie(usuario, token) {
  const meiaNoite = new Date();
  meiaNoite.setHours(23, 59, 59, 999);
  const expires = `expires=${meiaNoite.toUTCString()}; path=/; SameSite=Lax`;

  document.cookie = `${COOKIE_USER}=${encodeURIComponent(usuario)}; ${expires}`;
  document.cookie = `${COOKIE_TOKEN}=${encodeURIComponent(token)}; ${expires}`;
}

export function lerCookie(nome) {
  const cookies = document.cookie.split("; ");
  const encontrado = cookies.find((linha) => linha.startsWith(`${nome}=`));
  if (!encontrado) return null;
  return decodeURIComponent(encontrado.split("=")[1]);
}

export function apagarSessaoDoCookie() {
  const past = "expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = `${COOKIE_USER}=; ${past}`;
  document.cookie = `${COOKIE_TOKEN}=; ${past}`;
}

export async function getSessaoValidaDeHoje() {
  const usuario = lerCookie(COOKIE_USER);
  const tokenSalvo = lerCookie(COOKIE_TOKEN);

  if (!usuario || !tokenSalvo) return null;

  try {
    const resposta = await fetch("/users.json");
    const usuarios = await resposta.json();

    const usuarioEncontrado = usuarios.find((u) => u.usuario === usuario);
    if (!usuarioEncontrado) {
      apagarSessaoDoCookie();
      return null;
    }

    const hoje = getDataHoje();
    const tokenCalculado = await gerarToken(usuarioEncontrado.usuario, usuarioEncontrado.privateKey, hoje);

    // Se o token for igual ao token calculado para o dia de hoje, a sessão é válida!
    if (tokenSalvo !== tokenCalculado) {
      apagarSessaoDoCookie();
      return null;
    }

    return { usuario: usuarioEncontrado.usuario, token: tokenSalvo, data: hoje };
  } catch {
    return null;
  }
}
