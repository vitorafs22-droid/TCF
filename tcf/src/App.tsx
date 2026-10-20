import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  User, 
  Send, 
  ShoppingCart, 
  Trash2, 
  LogIn, 
  Gamepad2, 
  Calculator, 
  MessageSquare,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

// Interface do Jogo
interface Game {
  id: number;
  title: string;
  price: number;
  image: string;
  category: string;
}

const LISTA_JOGOS: Game[] = [
  {
    id: 1,
    title: "Red Dead Redemption 2",
    price: 299.90,
    image: "https://images.alphacoders.com/917/thumb-1920-917393.jpg",
    category: "Mundo Aberto / Ação"
  },
  {
    id: 2,
    title: "Cyberpunk 2077",
    price: 199.90,
    image: "https://images.alphacoders.com/100/thumb-1920-1004128.jpg",
    category: "RPG / Sci-Fi"
  },
  {
    id: 3,
    title: "Elden Ring",
    price: 229.90,
    image: "https://images.alphacoders.com/120/thumb-1920-1200251.jpg",
    category: "Soulslike / Ação"
  },
  {
    id: 4,
    title: "Counter-Strike 2",
    price: 0.00,
    image: "https://images.alphacoders.com/130/thumb-1920-1306303.png",
    category: "FPS / Multijogador"
  },
  {
    id: 5,
    title: "God of War Ragnarök",
    price: 249.90,
    image: "https://images.alphacoders.com/128/thumb-1920-1282218.jpg",
    category: "Ação / Aventura"
  },
  {
    id: 6,
    title: "GTA V: Premium Edition",
    price: 89.90,
    image: "https://images.alphacoders.com/439/thumb-1920-439563.jpg",
    category: "Ação / Mundo Aberto"
  }
];

export default function App() {
  // Controle de Abas: 'loja', 'carrinho', 'suporte', 'login'
  const [activeTab, setActiveTab] = useState<'loja' | 'carrinho' | 'suporte' | 'login'>('loja');
  
  // Estado do Carrinho de Compras
  const [cart, setCart] = useState<Game[]>([]);
  
  // Estado do Usuário
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [loginInput, setLoginInput] = useState('');

  // Estados do Chat com IA
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Olá! Sou o assistente de suporte inteligente da Steam. Posso ajudar com dúvidas sobre reembolsos, somar os preços do seu carrinho ou fazer cálculos matemáticos!',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Calcular valor total do carrinho
  const totalPrice = cart.reduce((acc, item) => acc + item.price, 0);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addToCart = (game: Game) => {
    if (!cart.find(item => item.id === game.id)) {
      setCart([...cart, game]);
    }
  };

  const removeFromCart = (gameId: number) => {
    setCart(cart.filter(item => item.id !== gameId));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginInput.trim()) {
      setUser({ name: loginInput });
      setActiveTab('loja');
    }
  };

  // Lógica inteligente do Chat / IA de Suporte
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages(prev => [...prev, { sender: 'user', text: userText, time }]);
    setInputMessage('');

    setTimeout(() => {
      let botResponse = '';
      const lower = userText.toLowerCase();

      // 1. Se perguntar sobre carrinho, valor total ou gastos
      if (lower.includes('carrinho') || lower.includes('total') || lower.includes('quanto') || lower.includes('comprar')) {
        if (cart.length === 0) {
          botResponse = '🛒 Seu carrinho está vazio no momento. Vá até a aba STORE e escolha alguns jogos para eu somar o valor total!';
        } else {
          const titles = cart.map(item => item.title).join(', ');
          botResponse = `🛒 Analisando seu carrinho: Você tem ${cart.length} item(ns) (${titles}). O valor total da compra é **R$ ${totalPrice.toFixed(2)}**.`;
        }
      } 
      // 2. Se for uma expressão matemática (contas)
      else if (/[0-9+\-*/().]/.test(userText) && /[\+\-\*\/]/.test(userText)) {
        try {
          const sanitized = userText.replace(/[^0-9+\-*/().]/g, '');
          if (sanitized) {
            const result = Function(`"use strict"; return (${sanitized})`)();
            botResponse = `🧮 **Cálculo realizado:** ${sanitized} = **${result}**. Precisa de mais alguma conta para o seu orçamento?`;
          }
        } catch {
          botResponse = 'Hmm, não consegui calcular essa expressão. Tente enviar uma conta direta como "150 + 50" ou "200 * 2".';
        }
      } 
      // 3. Perguntas gerais sobre jogos, suporte e a plataforma
      else if (lower.includes('reembolso') || lower.includes('devolver')) {
        botResponse = '🎮 **Política de Reembolso:** Jogos jogados por menos de 2 horas e comprados há menos de 14 dias podem ser reembolsados integralmente.';
      } else if (lower.includes('olá') || lower.includes('oi') || lower.includes('boa') || lower.includes('tudo bem')) {
        botResponse = `Olá${user ? `, ${user.name}` : ''}! Como posso ajudar você na Steam hoje? Posso tirar dúvidas, calcular o total dos seus jogos ou resolver contas matemáticas!`;
      } else if (lower.includes('ajuda') || lower.includes('suporte')) {
        botResponse = '🛠️ Estou aqui para dar suporte! Você pode me perguntar sobre status da conta, jogos da loja, pedir para calcular o total do carrinho ou mandar qualquer expressão matemática.';
      } else {
        // Resposta genérica e fluida para qualquer outra pergunta do usuário
        botResponse = `✨ Entendi sua pergunta sobre "${userText}". Como um assistente de IA da Steam, estou focado em garantir sua satisfação, gerenciar seu carrinho (atualmente em R$ ${totalPrice.toFixed(2)}) e resolver cálculos para você. Tem mais alguma dúvida sobre os jogos?`;
      }

      setMessages(prev => [...prev, { sender: 'bot', text: botResponse, time }]);
    }, 500);
  };
  return (
    <div>
      {/* HEADER PRINCIPAL ESTILO STEAM */}
      <header className="global-header">
        <div className="header-content">
          <div className="steam-logo" onClick={() => setActiveTab('loja')}>
            <Gamepad2 size={36} color="#66c0f4" />
            <div className="steam-logo-text">STEAM</div>
          </div>

          <nav className="global-nav">
            <button 
              className={`global-nav-btn ${activeTab === 'loja' ? 'active' : ''}`}
              onClick={() => setActiveTab('loja')}
            >
              STORE
            </button>
            <button 
              className={`global-nav-btn ${activeTab === 'suporte' ? 'active' : ''}`}
              onClick={() => setActiveTab('suporte')}
            >
              SUPPORT IA
            </button>
            <button 
              className={`global-nav-btn ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => setActiveTab('login')}
            >
              {user ? user.name : 'LOGIN'}
            </button>
          </nav>
        </div>
      </header>

      {/* SUB-BARRA COM O BOTÃO DE CARRINHO */}
      <div className="store-nav-bar">
        <div className="store-nav-content">
          <span style={{ fontSize: '13px', color: '#e5e5e5', fontWeight: 'bold' }}>
            A FESTA DE JOGOS E SUPORTE IA
          </span>
          
          <button className="cart-badge-btn" onClick={() => setActiveTab('carrinho')}>
            <ShoppingCart size={14} />
            Carrinho ({cart.length}) - R$ {totalPrice.toFixed(2)}
          </button>
        </div>
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="main-wrapper">

        {/* ABA 1: LOJA / STORE */}
        {activeTab === 'loja' && (
          <div>
            {/* Banner Destaque Estilo Steam */}
            <div className="featured-banner">
              <div 
                className="featured-image-area" 
                style={{ backgroundImage: `url(${LISTA_JOGOS[0].image})` }}
              />
              <div className="featured-info-area">
                <div>
                  <h2 style={{ color: '#fff', fontSize: '22px', marginBottom: '8px' }}>
                    {LISTA_JOGOS[0].title}
                  </h2>
                  <p style={{ color: '#acb2b8', fontSize: '13px' }}>
                    Em Destaque e Recomendado pela Comunidade
                  </p>
                </div>
                <div>
                  <div style={{ color: '#66c0f4', fontSize: '18px', fontWeight: 'bold', marginBottom: '12px' }}>
                    R$ {LISTA_JOGOS[0].price.toFixed(2)}
                  </div>
                  <button 
                    className="btn-add-cart" 
                    style={{ width: '100%', padding: '10px' }}
                    onClick={() => addToCart(LISTA_JOGOS[0])}
                  >
                    Adicionar ao Carrinho
                  </button>
                </div>
              </div>
            </div>

            <h3 style={{ color: '#fff', fontSize: '16px', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Jogos em Destaque & Ofertas
            </h3>

            {/* Grid com Todos os Jogos */}
            <div className="games-grid">
              {LISTA_JOGOS.map((game) => {
                const inCart = cart.some(item => item.id === game.id);
                return (
                  <div key={game.id} className="game-card">
                    <img src={game.image} alt={game.title} className="game-thumb" />
                    <div className="game-details">
                      <div className="game-title">{game.title}</div>
                      <span style={{ fontSize: '11px', color: '#8f98a0' }}>{game.category}</span>
                      
                      <div className="price-area">
                        <span className="price-tag">
                          {game.price === 0 ? 'Gratuito' : `R$ ${game.price.toFixed(2)}`}
                        </span>
                        <button 
                          className="btn-add-cart"
                          onClick={() => addToCart(game)}
                          disabled={inCart}
                          style={inCart ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
                        >
                          {inCart ? 'No Carrinho' : 'Adicionar'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ABA 2: CARRINHO DE COMPRAS E VALOR TOTAL */}
        {activeTab === 'carrinho' && (
          <div className="cart-container">
            <h2 style={{ color: '#fff', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShoppingCart color="#66c0f4" /> Seu Carrinho de Compras
            </h2>

            {cart.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#8f98a0' }}>
                Seu carrinho está vazio. Volte para a aba STORE e adicione alguns jogos!
              </div>
            ) : (
              <div>
                {cart.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img src={item.image} alt={item.title} style={{ width: '80px', height: '45px', objectFit: 'cover' }} />
                      <div>
                        <div style={{ color: '#fff', fontWeight: 'bold' }}>{item.title}</div>
                        <div style={{ fontSize: '12px', color: '#8f98a0' }}>{item.category}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                      <span style={{ color: '#acdbf5', fontWeight: 'bold' }}>
                        {item.price === 0 ? 'Gratuito' : `R$ ${item.price.toFixed(2)}`}
                      </span>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        style={{ background: 'transparent', border: 'none', color: '#c53030', cursor: 'pointer' }}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}

                {/* CAIXA DO VALOR TOTAL DA COMPRA */}
                <div className="cart-total-box">
                  <div>
                    <span style={{ fontSize: '12px', color: '#8f98a0', display: 'block' }}>Total Estimado</span>
                    <span style={{ fontSize: '28px', color: '#66c0f4', fontWeight: 'bold' }}>
                      R$ {totalPrice.toFixed(2)}
                    </span>
                  </div>

                  <button 
                    className="btn-add-cart" 
                    style={{ padding: '12px 28px', fontSize: '14px' }}
                    onClick={() => alert('Compra finalizada com sucesso!')}
                  >
                    Finalizar Compra
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ABA 3: SUPORTE COM IA */}
        {activeTab === 'suporte' && (
          <div className="chat-wrapper">
            <aside className="chat-sidebar">
              <div style={{ color: '#fff', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles color="#66c0f4" size={18} /> Assistente IA
              </div>

              <div style={{ background: '#0a0f14', padding: '12px', borderRadius: '4px', marginBottom: '12px' }}>
                <span style={{ fontSize: '11px', color: '#8f98a0' }}>Jogos no Carrinho</span>
                <div style={{ color: '#66c0f4', fontWeight: 'bold', fontSize: '16px', marginTop: '4px' }}>
                  {cart.length} item(s)
                </div>
              </div>

              <div style={{ background: '#0a0f14', padding: '12px', borderRadius: '4px' }}>
                <span style={{ fontSize: '11px', color: '#8f98a0' }}>Total do Carrinho</span>
                <div style={{ color: '#799905', fontWeight: 'bold', fontSize: '16px', marginTop: '4px' }}>
                  R$ {totalPrice.toFixed(2)}
                </div>
              </div>
            </aside>

            <section className="chat-main">
              <div style={{ background: '#0a0f14', padding: '12px 16px', borderBottom: '1px solid #2a475e', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Bot color="#66c0f4" />
                <div>
                  <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '14px' }}>Steam AI Support</div>
                  <div style={{ color: '#75b022', fontSize: '11px' }}>● Pronto para resolver suas dúvidas e calcular seus gastos</div>
                </div>
              </div>

              <div className="chat-messages-list">
                {messages.map((msg, i) => (
                  <div key={i} style={{ display: 'flex', gap: '10px', flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row' }}>
                    <div style={{ 
                      background: msg.sender === 'user' ? '#0072ff' : '#2a475e',
                      color: '#fff',
                      padding: '10px 14px',
                      borderRadius: '4px',
                      maxWidth: '75%',
                      fontSize: '13px'
                    }}>
                      <p>{msg.text}</p>
                      <span style={{ fontSize: '9px', opacity: 0.6, display: 'block', marginTop: '4px', textAlign: 'right' }}>
                        {msg.time}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              <form onSubmit={handleSendMessage} className="chat-input-bar">
                <input 
                  type="text" 
                  className="steam-input-field"
                  placeholder="Pergunte sobre 'total', 'reembolso' ou envie uma conta (ex: 200 - 50)..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                />
                <button type="submit" className="btn-add-cart" style={{ padding: '8px 16px' }}>
                  <Send size={14} />
                </button>
              </form>
            </section>
          </div>
        )}

        {/* ABA 4: LOGIN */}
        {activeTab === 'login' && (
          <div style={{ maxWidth: '400px', margin: '40px auto', background: '#121c24', padding: '32px', borderRadius: '4px', border: '1px solid #2a475e' }}>
            <h2 style={{ color: '#fff', textAlign: 'center', marginBottom: '20px' }}>
              {user ? `Olá, ${user.name}` : 'Iniciar Sessão na Steam'}
            </h2>

            {!user ? (
              <form onSubmit={handleLogin}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12px', color: '#8f98a0', marginBottom: '6px' }}>Nome da Conta Steam</label>
                  <input 
                    type="text" 
                    className="steam-input-field" 
                    style={{ width: '100%' }}
                    value={loginInput}
                    onChange={(e) => setLoginInput(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn-add-cart" style={{ width: '100%', padding: '10px' }}>
                  Entrar
                </button>
              </form>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <CheckCircle2 color="#75b022" size={32} style={{ margin: '0 auto 12px' }} />
                <p style={{ color: '#fff', marginBottom: '20px' }}>Você está autenticado.</p>
                <button onClick={() => setUser(null)} className="btn-add-cart" style={{ background: '#c53030', width: '100%' }}>
                  Sair da Conta
                </button>
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}