import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [cpf, setCpf] = useState('');
  const [endereco, setEndereco] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cartoes, setCartoes] = useState([]);
  const [cartaoEdit, setCartaoEdit] = useState({ nome: '', numero: '', validade: '', cvv: '', principal: false });
  const [editIdx, setEditIdx] = useState(null);
  const [showCartoes, setShowCartoes] = useState(false);
  const [editandoPerfil, setEditandoPerfil] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = JSON.parse(localStorage.getItem('usuarioLogado') || 'null');
      if (!user) {
        router.push('/login');
        return;
      }
      setUsuario(user);
      setNome(user.nome);
      setEmail(user.email);
      setSenha(user.senha);
      setCpf(user.cpf || '');
      setEndereco(user.endereco || '');
      setTelefone(user.telefone || '');
      setCartoes(user.cartoesCredito || []);
      setCartaoEdit({ nome: '', numero: '', validade: '', cvv: '', principal: false });
      setEditIdx(null);
    }
  }, [router]);

  const salvar = (e) => {
    e.preventDefault();
    if (!nome || !email || !senha || !cpf || !endereco || !telefone) return setErro('Preencha todos os campos!');
    if (!email.match(/^\S+@\S+\.\S+$/)) return setErro('Email inválido!');
    if (!cpf.match(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)) return setErro('CPF inválido!');
    if (!telefone.match(/^\(\d{2}\) \d{5}-\d{4}$/)) return setErro('Telefone inválido!');
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    // Verifica se está tentando usar email de outro usuário
    if (usuarios.find(u => u.email === email && u.email !== usuario.email)) return setErro('Já existe um usuário com este email!');
    // Atualiza usuário
    const atualizados = usuarios.map(u =>
      u.email === usuario.email ? { ...u, nome, email, senha, cpf, endereco, telefone, cartoesCredito: cartoes } : u
    );
    localStorage.setItem('usuarios', JSON.stringify(atualizados));
    const novoLogado = { ...usuario, nome, email, senha, cpf, endereco, telefone, cartoesCredito: cartoes };
    localStorage.setItem('usuarioLogado', JSON.stringify(novoLogado));
    setUsuario(novoLogado);
    setErro('');
    setSucesso('Perfil atualizado com sucesso!');
  };

  if (!usuario) return null;

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>Meu Perfil</h1>
      {!editandoPerfil ? (
        <div style={{ marginBottom: 30 }}>
          <div style={{ marginBottom: 12 }}><b>Nome:</b> {nome}</div>
          <div style={{ marginBottom: 12 }}><b>Email:</b> {email}</div>
          <div style={{ marginBottom: 12 }}><b>CPF:</b> {cpf}</div>
          <div style={{ marginBottom: 12 }}><b>Endereço:</b> {endereco}</div>
          <div style={{ marginBottom: 12 }}><b>Telefone:</b> {telefone}</div>
          <div style={{ marginBottom: 12 }}><b>Senha:</b> {'*'.repeat(senha.length)}</div>
          <button type="button" style={{ background: '#bfa46b', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 0', width: '100%', fontSize: 16, marginTop: 10, cursor: 'pointer' }} onClick={() => setEditandoPerfil(true)}>Editar Perfil</button>
        </div>
      ) : (
        <form onSubmit={salvar} style={{ marginBottom: 30 }}>
          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={e => setNome(e.target.value)}
            style={{ marginBottom: 10, width: '100%' }}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ marginBottom: 10, width: '100%' }}
          />
          <input
            type="text"
            placeholder="CPF"
            value={cpf}
            onChange={e => {
              let val = e.target.value.replace(/\D/g, '').slice(0, 11);
              val = val.replace(/(\d{3})(\d{0,3})(\d{0,3})(\d{0,2})/, (m, a, b, c, d) => {
                let out = a;
                if (b) out += '.' + b;
                if (c) out += '.' + c;
                if (d) out += '-' + d;
                return out;
              });
              setCpf(val);
            }}
            maxLength={14}
            style={{ marginBottom: 10, width: '100%' }}
          />
          <input
            type="text"
            placeholder="Endereço"
            value={endereco}
            onChange={e => setEndereco(e.target.value)}
            style={{ marginBottom: 10, width: '100%' }}
          />
          <input
            type="text"
            placeholder="Telefone"
            value={telefone}
            onChange={e => {
              let val = e.target.value.replace(/\D/g, '').slice(0, 11);
              val = val.replace(/(\d{2})(\d{0,5})(\d{0,4})/, (m, a, b, c) => {
                let out = '';
                if (a) out += '(' + a + ')';
                if (b) out += ' ' + b;
                if (c) out += '-' + c;
                return out;
              });
              setTelefone(val);
            }}
            maxLength={15}
            style={{ marginBottom: 10, width: '100%' }}
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={e => setSenha(e.target.value)}
            style={{ marginBottom: 10, width: '100%' }}
          />
          <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
            <button type="submit" style={{ background: '#bfa46b', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 22px', fontSize: 16, cursor: 'pointer', width: '100%' }}>Salvar Alterações</button>
            <button type="button" style={{ background: '#888', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 22px', fontSize: 16, cursor: 'pointer', width: '100%' }} onClick={() => { setEditandoPerfil(false); setErro(''); setNome(usuario.nome); setEmail(usuario.email); setSenha(usuario.senha); setCpf(usuario.cpf || ''); setEndereco(usuario.endereco || ''); setTelefone(usuario.telefone || ''); }}>Cancelar</button>
          </div>
        </form>
      )}

      {/* Cartões de crédito - sempre fora do form de perfil */}
      {!showCartoes && (
        <button
          type="button"
          style={{ background: '#bfa46b', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 0', width: '100%', fontSize: 16, margin: '20px 0', cursor: 'pointer' }}
          onClick={() => {
            const user = JSON.parse(localStorage.getItem('usuarioLogado') || 'null');
            setCartoes(user && user.cartoesCredito ? user.cartoesCredito : []);
            setShowCartoes(true);
          }}
        >
          Gerenciar Cartões
        </button>
      )}
      {showCartoes && (
        <div>
          <button
            type="button"
            style={{ background: '#eee', color: '#bfa46b', border: 'none', borderRadius: 6, padding: '5px 16px', fontSize: 15, cursor: 'pointer', float: 'right', marginBottom: 10 }}
            onClick={() => setShowCartoes(false)}
          >
            Minimizar Cartões
          </button>
          <h3 style={{ margin: '25px 0 10px 0', color: '#bfa46b', fontSize: 18 }}>Cartões de Crédito</h3>
          {cartoes.length === 0 && <div style={{ color: '#888', marginBottom: 12 }}>Nenhum cartão cadastrado.</div>}
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {cartoes.map((c, idx) => (
              <li key={idx} style={{ marginBottom: 14, background: '#fafafa', border: '1px solid #eee', borderRadius: 6, padding: 10, position: 'relative' }}>
                <div style={{ fontWeight: 600 }}>
                  {c.nome} {c.principal && <span style={{ color: '#27ae60', fontWeight: 700, marginLeft: 8 }}>(Principal)</span>}
                </div>
                <div style={{ fontSize: 15, color: '#444', marginBottom: 4 }}>•••• •••• •••• {c.numero.slice(-4)} | Validade: {c.validade}</div>
                <button type="button" style={{ background: '#bfa46b', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 12px', fontSize: 14, marginRight: 8, cursor: 'pointer' }} onClick={() => { setCartaoEdit(c); setEditIdx(idx); }}>Editar</button>
                <button type="button" style={{ background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 12px', fontSize: 14, cursor: 'pointer', marginRight: 8 }} onClick={() => {
                  const novos = cartoes.filter((_, i) => i !== idx);
                  setCartoes(novos);
// Atualiza localStorage
const usuarioAtual = JSON.parse(localStorage.getItem('usuarioLogado'));
const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
const usuarioAtualizado = { ...usuarioAtual, cartoesCredito: novos };
localStorage.setItem('usuarioLogado', JSON.stringify(usuarioAtualizado));
const usuariosAtualizados = usuarios.map(u => u.email === usuarioAtual.email ? { ...u, cartoesCredito: novos } : u);
localStorage.setItem('usuarios', JSON.stringify(usuariosAtualizados));
setUsuario(usuarioAtualizado);
                }}>Remover</button>
                {!c.principal && (
                  <button type="button" style={{ background: '#27ae60', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 12px', fontSize: 14, cursor: 'pointer' }} onClick={() => {
                    const novos = cartoes.map((cart, i) => ({ ...cart, principal: i === idx }));
                    setCartoes(novos);
// Atualiza localStorage
const usuarioAtual = JSON.parse(localStorage.getItem('usuarioLogado'));
const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
const usuarioAtualizado = { ...usuarioAtual, cartoesCredito: novos };
localStorage.setItem('usuarioLogado', JSON.stringify(usuarioAtualizado));
const usuariosAtualizados = usuarios.map(u => u.email === usuarioAtual.email ? { ...u, cartoesCredito: novos } : u);
localStorage.setItem('usuarios', JSON.stringify(usuariosAtualizados));
setUsuario(usuarioAtualizado);
                  }}>Definir como Principal</button>
                )}
              </li>
            ))}
          </ul>
          <div style={{ marginTop: 18, marginBottom: 6, fontWeight: 500 }}>{editIdx !== null ? 'Editar Cartão' : 'Adicionar Novo Cartão'}</div>
          <input
            type="text"
            placeholder="Nome no Cartão"
            value={cartaoEdit.nome}
            onChange={e => setCartaoEdit({ ...cartaoEdit, nome: e.target.value })}
            style={{ marginBottom: 10, width: '100%' }}
          />
          <input
            type="text"
            placeholder="Número do Cartão"
            value={cartaoEdit.numero.replace(/(\d{4})(?=\d)/g, '$1 ')}
            onChange={e => {
              let val = e.target.value.replace(/\D/g, '').slice(0, 16);
              val = val.replace(/(\d{4})(?=\d)/g, '$1 ');
              setCartaoEdit({ ...cartaoEdit, numero: val.replace(/ /g, '') });
            }}
            style={{ marginBottom: 10, width: '100%' }}
            maxLength={19}
          />
          <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
            <input
              type="text"
              placeholder="Validade (MM/AA)"
              value={cartaoEdit.validade.replace(/(\d{2})(\d{0,2})/, (m, m1, m2) => m2 ? m1 + '/' + m2 : m1)}
              onChange={e => {
                let val = e.target.value.replace(/\D/g, '').slice(0, 4);
                val = val.replace(/(\d{2})(\d{0,2})/, (m, m1, m2) => m2 ? m1 + '/' + m2 : m1);
                setCartaoEdit({ ...cartaoEdit, validade: val });
              }}
              style={{ flex: 1 }}
              maxLength={5}
            />
            <input
              type="text"
              placeholder="CVV"
              value={cartaoEdit.cvv}
              onChange={e => setCartaoEdit({ ...cartaoEdit, cvv: e.target.value })}
              style={{ flex: 1 }}
              maxLength={4}
            />
          </div>
          <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
            <button type="button" style={{ background: '#bfa46b', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 22px', fontSize: 16, cursor: 'pointer' }} onClick={() => {
              if (!cartaoEdit.nome || !cartaoEdit.numero || !cartaoEdit.validade || !cartaoEdit.cvv) return setErro('Preencha todos os dados do cartão!');
              // Impedir cartão duplicado (mesmo número, exceto se estiver editando o mesmo)
              if (cartoes.some((c, i) => c.numero === cartaoEdit.numero && i !== editIdx)) return setErro('Já existe um cartão com esse número!');
              let novos;
              if (editIdx !== null) {
                // Se estava como principal, mantém
                const wasPrincipal = cartoes[editIdx].principal;
                novos = cartoes.map((c, i) => i === editIdx ? { ...cartaoEdit, principal: wasPrincipal } : c);
              } else {
                // Se for o primeiro cartão, define como principal
                const isFirst = cartoes.length === 0;
                novos = [...cartoes, { ...cartaoEdit, principal: isFirst }];
              }
              setCartoes(novos);
// Atualiza localStorage
const usuarioAtual = JSON.parse(localStorage.getItem('usuarioLogado'));
const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
const usuarioAtualizado = { ...usuarioAtual, cartoesCredito: novos };
localStorage.setItem('usuarioLogado', JSON.stringify(usuarioAtualizado));
const usuariosAtualizados = usuarios.map(u => u.email === usuarioAtual.email ? { ...u, cartoesCredito: novos } : u);
localStorage.setItem('usuarios', JSON.stringify(usuariosAtualizados));
setUsuario(usuarioAtualizado);
              setCartaoEdit({ nome: '', numero: '', validade: '', cvv: '', principal: false });
              setEditIdx(null);
              setErro('');
            }}>{editIdx !== null ? 'Salvar Cartão' : 'Adicionar Cartão'}</button>
            {editIdx !== null && (
              <button type="button" style={{ background: '#888', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 22px', fontSize: 16, cursor: 'pointer' }} onClick={() => {
                setCartaoEdit({ nome: '', numero: '', validade: '', cvv: '', principal: false });
                setEditIdx(null);
                setErro('');
              }}>Cancelar</button>
            )}
          </div>
        </div>
      )}

      {erro && <div style={{ color: 'red', marginTop: 12 }}>{erro}</div>}
      {sucesso && <div style={{ color: 'green', marginTop: 12 }}>{sucesso}</div>}
      <button
        type="button"
        style={{ marginTop: 24, width: '100%', background: '#888', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 0', cursor: 'pointer' }}
        onClick={() => window.location.href = '/'}
      >
        Voltar para Página Inicial
      </button>
    </div>
  );
}

