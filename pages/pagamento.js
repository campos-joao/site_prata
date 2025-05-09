import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { db } from '../firebaseConfig';
import { collection, addDoc, doc, getDoc, setDoc } from 'firebase/firestore';

export default function Pagamento() {
  const router = useRouter();

  const [metodo, setMetodo] = useState('');
  const [cartoes, setCartoes] = useState([]); // lista de cartões salvos do usuário
  const [cartaoSelecionado, setCartaoSelecionado] = useState(null); // índice do cartão selecionado
  const [novoCartao, setNovoCartao] = useState({ nome: '', numero: '', validade: '', cvv: '' });
  const [msg, setMsg] = useState('');
  const [cadastrando, setCadastrando] = useState(false); // Para controle do botão

  // Função para cadastrar cartão e salvar no Firestore
  async function handleCadastrarCartao(e) {
    e.preventDefault();
    if (!novoCartao.nome || !novoCartao.numero || !novoCartao.validade || !novoCartao.cvv) {
      setMsg('Preencha todos os dados do cartão!');
      return;
    }
    setCadastrando(true);
    const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
    let cartoesAtualizados = [...cartoes, { ...novoCartao, principal: cartoes.length === 0 }];
    try {
      await setDoc(doc(db, 'usuarios', usuario.email), {
        cartoesCredito: cartoesAtualizados
      }, { merge: true });
      // Atualiza localStorage e estado local
      usuario.cartoesCredito = cartoesAtualizados;
      localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
      setCartoes(cartoesAtualizados);
      setCartaoSelecionado(cartoesAtualizados.length - 1);
      setNovoCartao({ nome: '', numero: '', validade: '', cvv: '' });
      setMsg('Cartão cadastrado com sucesso! Agora finalize o pagamento.');
    } catch (err) {
      setMsg('Erro ao salvar cartão no Firestore. Tente novamente.');
    }
    setCadastrando(false);
  }

  useEffect(() => {
    // Se não estiver logado, redireciona para login
    const user = JSON.parse(localStorage.getItem('usuarioLogado') || 'null');
    if (!user) {
      localStorage.setItem('redirectAfterLogin', '/pagamento');
      router.push('/login');
      return;
    }
    // Busca cartões do Firestore
    async function fetchCartoesFirestore() {
      try {
        const userDoc = await getDoc(doc(db, 'usuarios', user.email));
        if (userDoc.exists() && userDoc.data().cartoesCredito) {
          setCartoes(userDoc.data().cartoesCredito);
          if (userDoc.data().cartoesCredito.length > 0) setCartaoSelecionado(0);
        } else {
          setCartoes([]);
        }
      } catch (err) {
        setCartoes([]);
      }
    }
    fetchCartoesFirestore();
  }, [router]);

  // Função responsável por processar o pagamento e salvar o pedido no Firestore
  async function handlePagamento(e) {
    e.preventDefault();
    let usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
    let usuarios = JSON.parse(localStorage.getItem('usuarios'));
    if (metodo === 'cartao') {
      let cartoesAtualizados = [...cartoes];
      let cartaoParaUsar = null;
      if (cartoes.length > 0) {
        // Seleciona cartão já existente
        cartaoParaUsar = cartoes[cartaoSelecionado];
      } else {
        // Cadastro de novo cartão
        if (!novoCartao.nome || !novoCartao.numero || !novoCartao.validade || !novoCartao.cvv)
          return setMsg('Preencha todos os dados do cartão!');
        cartaoParaUsar = { ...novoCartao, principal: true };
        cartoesAtualizados = [cartaoParaUsar];
      }
      // Salva cartão utilizado no usuário
      usuario.cartoesCredito = cartoesAtualizados;
      localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
      // Atualiza na lista de usuários também
      const idx = usuarios.findIndex(u => u.email === usuario.email);
      if (idx !== -1) {
        usuarios[idx].cartoesCredito = cartoesAtualizados;
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
      }
      // Salva cartões também no Firestore
      try {
        await setDoc(doc(db, 'usuarios', usuario.email), {
          cartoesCredito: cartoesAtualizados
        }, { merge: true });
      } catch (err) {
        // Se der erro, apenas loga, mas não impede pagamento
        console.error('Erro ao salvar cartão no Firestore:', err);
      }
    }
    // Busca o carrinho do localStorage
    const carrinho = JSON.parse(localStorage.getItem('carrinho') || '[]');
    if (!carrinho.length) return setMsg('Carrinho vazio!');

    // Calcula o total da compra
    const total = carrinho.reduce((soma, item) => soma + Number(item.preco) * (item.quantidade || 1), 0);

    // Monta o objeto do novo pedido
    const novoPedido = {
      data: new Date().toLocaleString('pt-BR'), // data da compra
      usuarioNome: usuario.nome,
      usuarioEmail: usuario.email,
      total,
      itens: carrinho.map(item => ({ nome: item.nome, qtd: item.quantidade, preco: Number(item.preco) })),
      status: 'Finalizado'
    };

    // Salva o novo pedido na coleção 'pedidos' do Firestore
    await addDoc(collection(db, 'pedidos'), novoPedido);

    // Limpa o carrinho do localStorage
    localStorage.removeItem('carrinho');

    // Mensagem de sucesso
    setMsg('Pagamento realizado com sucesso! Obrigado pela compra.');
    setTimeout(() => router.push('/'), 2000);
  }

  return (
    <div style={{ maxWidth: 500, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>Pagamento</h1>
      <p style={{ color: '#bfa46b', margin: '20px 0' }}>Escolha a forma de pagamento para concluir sua compra.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginBottom: 30 }}>
        <button type="button" style={{ padding: '12px', background: metodo === 'cartao' ? '#8e7a4f' : '#bfa46b', color: '#fff', border: 'none', borderRadius: 6, fontSize: 18, cursor: 'pointer' }} 
  onClick={() => {
    // Sempre recarrega cartões do usuário logado ao selecionar cartão
    const user = JSON.parse(localStorage.getItem('usuarioLogado') || 'null');
    setCartoes(user && user.cartoesCredito ? user.cartoesCredito : []);
    setCartaoSelecionado(0);
    setMetodo('cartao');
  }}
>Cartão de Crédito</button>
        <button type="button" style={{ padding: '12px', background: metodo === 'pix' ? '#8e7a4f' : '#bfa46b', color: '#fff', border: 'none', borderRadius: 6, fontSize: 18, cursor: 'pointer' }} onClick={() => setMetodo('pix')}>Pix</button>
        <button type="button" style={{ padding: '12px', background: metodo === 'boleto' ? '#8e7a4f' : '#bfa46b', color: '#fff', border: 'none', borderRadius: 6, fontSize: 18, cursor: 'pointer' }} onClick={() => setMetodo('boleto')}>Boleto Bancário</button>
      </div>
      {metodo === 'cartao' && (
        <>
          {/* Se houver cartões cadastrados, mostra seleção */}
          {cartoes.length > 0 ? (
            <form onSubmit={handlePagamento} style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
              <div style={{ marginBottom: 10, fontWeight: 500 }}>Selecione um cartão para pagar:</div>
              {cartoes.map((c, idx) => (
                <div key={idx} style={{ border: cartaoSelecionado === idx ? '2px solid #bfa46b' : '1px solid #ccc', borderRadius: 6, padding: 10, marginBottom: 8, background: cartaoSelecionado === idx ? '#f7f3ec' : '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} onClick={() => setCartaoSelecionado(idx)}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{c.nome}</div>
                    <div style={{ fontSize: 15, color: '#666' }}>•••• {c.numero.slice(-4)} | Validade: {c.validade}</div>
                    {c.principal && <span style={{ fontSize: 12, color: '#bfa46b', fontWeight: 600 }}>Principal</span>}
                  </div>
                  {cartaoSelecionado === idx && <span style={{ color: '#bfa46b', fontWeight: 700, fontSize: 18 }}>✓</span>}
                </div>
              ))}
              <button type="submit" style={{ marginTop: 8, background: '#bfa46b', color: '#fff', border: 'none', borderRadius: 6, padding: '12px 0', fontSize: 17, cursor: 'pointer' }}>Finalizar Pagamento</button>
              <div style={{ fontSize: 14, color: '#888', marginTop: 10 }}>Para cadastrar um novo cartão, acesse seu <a href="/perfil" style={{ color: '#bfa46b', textDecoration: 'underline' }}>perfil</a>.</div>
            </form>
          ) : (
            // Se não houver cartões, mostra formulário de cadastro
            <>
              <form onSubmit={handleCadastrarCartao} style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
                <input type="text" placeholder="Nome no Cartão" value={novoCartao.nome} onChange={e => setNovoCartao({ ...novoCartao, nome: e.target.value })} style={{ padding: 10, borderRadius: 6, border: '1px solid #ccc', fontSize: 16 }} />
                <input type="text" placeholder="Número do Cartão" value={novoCartao.numero} onChange={e => setNovoCartao({ ...novoCartao, numero: e.target.value })} style={{ padding: 10, borderRadius: 6, border: '1px solid #ccc', fontSize: 16 }} maxLength={19} />
                <div style={{ display: 'flex', gap: 10 }}>
                  <input type="text" placeholder="Validade (MM/AA)" value={novoCartao.validade} onChange={e => setNovoCartao({ ...novoCartao, validade: e.target.value })} style={{ flex: 1, padding: 10, borderRadius: 6, border: '1px solid #ccc', fontSize: 16 }} maxLength={5} />
                  <input type="text" placeholder="CVV" value={novoCartao.cvv} onChange={e => setNovoCartao({ ...novoCartao, cvv: e.target.value })} style={{ flex: 1, padding: 10, borderRadius: 6, border: '1px solid #ccc', fontSize: 16 }} maxLength={4} />
                </div>
                <button type="submit" disabled={cadastrando} style={{ marginTop: 8, background: '#bfa46b', color: '#fff', border: 'none', borderRadius: 6, padding: '12px 0', fontSize: 17, cursor: 'pointer' }}>{cadastrando ? 'Salvando...' : 'Cadastrar Cartão'}</button>
                <div style={{ fontSize: 14, color: '#888', marginTop: 10 }}>Após cadastrar, selecione o cartão para finalizar o pagamento.</div>
              </form>
              {/* Após cadastrar, exibe cartões para seleção e pagamento */}
              {cartoes.length > 0 && (
                <form onSubmit={handlePagamento} style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
                  <div style={{ marginBottom: 10, fontWeight: 500 }}>Selecione um cartão para pagar:</div>
                  {cartoes.map((c, idx) => (
                    <div key={idx} style={{ border: cartaoSelecionado === idx ? '2px solid #bfa46b' : '1px solid #ccc', borderRadius: 6, padding: 10, marginBottom: 8, background: cartaoSelecionado === idx ? '#f7f3ec' : '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} onClick={() => setCartaoSelecionado(idx)}>
                      <div>
                        <div style={{ fontWeight: 600 }}>{c.nome}</div>
                        <div style={{ fontSize: 15, color: '#666' }}>•••• {c.numero.slice(-4)} | Validade: {c.validade}</div>
                        {c.principal && <span style={{ fontSize: 12, color: '#bfa46b', fontWeight: 600 }}>Principal</span>}
                      </div>
                      {cartaoSelecionado === idx && <span style={{ color: '#bfa46b', fontWeight: 700, fontSize: 18 }}>✓</span>}
                    </div>
                  ))}
                  <button type="submit" style={{ marginTop: 8, background: '#bfa46b', color: '#fff', border: 'none', borderRadius: 6, padding: '12px 0', fontSize: 17, cursor: 'pointer' }}>Finalizar Pagamento</button>
                </form>
              )}
            </>
          )}
        </>
      )}
      {metodo && metodo !== 'cartao' && (
        <form onSubmit={handlePagamento} style={{ marginBottom: 20 }}>
          <button type="submit" style={{ background: '#bfa46b', color: '#fff', border: 'none', borderRadius: 6, padding: '12px 0', width: '100%', fontSize: 17, cursor: 'pointer' }}>Finalizar Pagamento</button>
        </form>
      )}
      {msg && <div style={{ color: '#27ae60', margin: '14px 0', fontWeight: 600, fontSize: 16 }}>{msg}</div>}
      <button type="button" style={{ marginTop: 10, width: '100%', background: '#888', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 0', cursor: 'pointer' }} onClick={() => router.push('/carrinho')}>
        Voltar para o Carrinho
      </button>
    </div>
  );
}
