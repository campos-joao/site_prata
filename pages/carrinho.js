import { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

export default function Carrinho() {
  // Estado para armazenar os itens do carrinho
  const [carrinho, setCarrinho] = useState([]);

  // useEffect para buscar o carrinho do usuário logado no Firestore ao montar
  useEffect(() => {
    async function fetchCarrinho() {
      // Busca usuário logado
      const user = JSON.parse(localStorage.getItem('usuarioLogado') || 'null');
      if (!user) return;
      // Busca o documento do carrinho do usuário na coleção 'carrinhos'
      const carrinhoDoc = await getDoc(doc(db, 'carrinhos', user.email));
      if (carrinhoDoc.exists()) {
        setCarrinho(carrinhoDoc.data().itens || []);
      } else {
        setCarrinho([]);
      }
    }
    fetchCarrinho();
  }, []);

  // Função para remover um item do carrinho e atualizar no Firestore
  const removerItem = async (nome) => {
    // Busca usuário logado
    const user = JSON.parse(localStorage.getItem('usuarioLogado') || 'null');
    if (!user) return;
    // Remove o item da lista local
    const novo = carrinho.filter(item => item.nome !== nome);
    setCarrinho(novo);
    // Atualiza o documento do carrinho no Firestore
    await setDoc(doc(db, 'carrinhos', user.email), { itens: novo });
  };

  // Função para alterar a quantidade de um item e atualizar no Firestore
  const alterarQuantidade = async (nome, delta) => {
    // Busca usuário logado
    const user = JSON.parse(localStorage.getItem('usuarioLogado') || 'null');
    if (!user) return;
    // Altera a quantidade do item na lista local
    const novo = carrinho.map(item =>
      item.nome === nome ? { ...item, quantidade: Math.max(1, item.quantidade + delta) } : item
    );
    setCarrinho(novo);
    // Atualiza o documento do carrinho no Firestore
    await setDoc(doc(db, 'carrinhos', user.email), { itens: novo });
  };

  // Calcula o valor total do carrinho
  const total = carrinho.reduce((soma, item) => soma + Number(item.preco) * item.quantidade, 0);

  // Função utilitária para checar se o usuário está logado
  function usuarioLogado() {
    try {
      const u = JSON.parse(localStorage.getItem('usuarioLogado') || 'null');
      return u && u.nome;
    } catch {
      return false;
    }
  }

  // Função para finalizar a compra
  const handleFinalizarCompra = async () => {
    if (!usuarioLogado()) {
      // Salva que veio do carrinho para redirecionar após login
      localStorage.setItem('redirectAfterLogin', '/carrinho');
      window.location.href = '/login';
      return;
    }
    const user = JSON.parse(localStorage.getItem('usuarioLogado') || 'null');
    if (user) {
      // Limpa o carrinho do Firestore após finalizar compra
      await setDoc(doc(db, 'carrinhos', user.email), { itens: [] });
    }
    window.location.href = '/pagamento';
  };

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>Carrinho de Compras</h1>
      {carrinho.length === 0 ? (
        <div style={{ color: '#bfa46b', marginTop: 24 }}>Seu carrinho está vazio.</div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {carrinho.map((item, idx) => (
            <li key={item.nome} style={{ marginBottom: 18, display: 'flex', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: 10 }}>
              {item.foto && (
                <img src={item.foto} alt={item.nome} style={{ width: 60, height: 60, objectFit: 'cover', marginRight: 12, borderRadius: 8 }} />
              )}
              <div style={{ flex: 1 }}>
                <strong>{item.nome}</strong><br />
                <span style={{ color: '#555', fontSize: 14 }}>{item.descricao}</span><br />
                <span style={{ color: '#bfa46b', fontWeight: 600 }}>Preço: R$ {Number(item.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <button onClick={() => alterarQuantidade(item.nome, -1)} style={{ padding: '2px 8px' }}>-</button>
                <span style={{ minWidth: 24, textAlign: 'center' }}>{item.quantidade}</span>
                <button onClick={() => alterarQuantidade(item.nome, 1)} style={{ padding: '2px 8px' }}>+</button>
              </div>
              <button onClick={() => removerItem(item.nome)} style={{ marginLeft: 10, background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 10px', cursor: 'pointer' }}>Remover</button>
            </li>
          ))}
        </ul>
      )}
      <div style={{ marginTop: 30, fontSize: 18, fontWeight: 600 }}>
        Total: <span style={{ color: '#bfa46b' }}>R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      </div>
      <button
        type="button"
        style={{ marginTop: 24, width: '100%', background: '#bfa46b', color: '#fff', border: 'none', borderRadius: 6, padding: '12px 0', cursor: 'pointer', fontSize: 16 }}
        disabled={carrinho.length === 0}
        onClick={handleFinalizarCompra}
      >
        Finalizar Compra
      </button>
      <button
        type="button"
        style={{ marginTop: 14, width: '100%', background: '#888', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 0', cursor: 'pointer' }}
        onClick={() => window.location.href = '/'}
      >
        Voltar para Página Inicial
      </button>
    </div>
  );
}
