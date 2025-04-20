import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = JSON.parse(localStorage.getItem('usuarioLogado') || 'null');
      if (!user) {
        router.push('/login');
        return;
      }
      setUsuario(user);
      const pedidosSalvos = JSON.parse(localStorage.getItem('pedidos') || '[]');
      setPedidos(pedidosSalvos);
    }
  }, [router]);

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>Meus Pedidos</h1>
      {pedidos.length === 0 ? (
        <div style={{ color: '#888', marginTop: 32 }}>Nenhum pedido finalizado ainda.</div>
      ) : (
        <div style={{ marginTop: 24 }}>
          {pedidos.map((pedido, idx) => (
            <div key={idx} style={{ border: '1px solid #eee', borderRadius: 8, marginBottom: 24, padding: 18, background: '#fafafa' }}>
              <div style={{ marginBottom: 8, fontWeight: 600 }}>Pedido #{pedido.id || idx+1}</div>
              <div style={{ marginBottom: 8 }}>Data: {pedido.data || '-'}</div>
              <div style={{ marginBottom: 8 }}>Usuário: {pedido.usuarioNome || pedido.usuarioEmail || '-'}</div>
              <div style={{ marginBottom: 8 }}>Total: <b>R$ {pedido.total?.toFixed(2) || '-'}</b></div>
              <div style={{ marginBottom: 8 }}>
                <b>Itens:</b>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                  {pedido.itens?.map((item, i) => (
                    <li key={i} style={{ borderBottom: '1px solid #eee', padding: '6px 0' }}>
                      {item.nome} - {item.qtd} x R$ {item.preco?.toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>
              {pedido.status && <div>Status: <b>{pedido.status}</b></div>}
            </div>
          ))}
        </div>
      )}
      <button
        type="button"
        style={{ marginTop: 24, width: '100%', background: '#bfa46b', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 0', fontSize: 16, cursor: 'pointer' }}
        onClick={() => router.push('/')}
      >
        Voltar para Página Inicial
      </button>
    </div>
  );
}
