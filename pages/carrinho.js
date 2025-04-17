import { useEffect, useState } from 'react';

export default function Carrinho() {
  const [carrinho, setCarrinho] = useState([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const itens = JSON.parse(localStorage.getItem('carrinho') || '[]');
      setCarrinho(itens);
    }
  }, []);

  const removerItem = (nome) => {
    const novo = carrinho.filter(item => item.nome !== nome);
    setCarrinho(novo);
    localStorage.setItem('carrinho', JSON.stringify(novo));
  };

  const alterarQuantidade = (nome, delta) => {
    const novo = carrinho.map(item =>
      item.nome === nome ? { ...item, quantidade: Math.max(1, item.quantidade + delta) } : item
    );
    setCarrinho(novo);
    localStorage.setItem('carrinho', JSON.stringify(novo));
  };

  const total = carrinho.reduce((soma, item) => soma + Number(item.preco) * item.quantidade, 0);

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
        onClick={() => alert('Compra finalizada!')}
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
