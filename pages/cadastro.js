import React, { useState } from 'react';
import { useRouter } from 'next/router';

export default function Cadastro() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(null); // null: carregando, false: não admin, true: admin
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = JSON.parse(localStorage.getItem('usuarioLogado') || 'null');
      if (!user || user.tipo !== 'admin') {
        setIsAdmin(false);
        router.replace('/');
      } else {
        setIsAdmin(true);
      }
    }
  }, [router]);
  const [usuarios, setUsuarios] = useState(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('usuarios') || '[]');
    }
    return [];
  });
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [tipo, setTipo] = useState('usuario');
  const [erro, setErro] = useState('');
  

  // Salva usuários no localStorage sempre que mudar
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }
  }, [usuarios]);

  // Cadastro de usuário
  const cadastrar = (e) => {
    e.preventDefault();
    if (!nome || !email || !senha) return setErro('Preencha todos os campos!');
    if (!email.match(/^\S+@\S+\.\S+$/)) return setErro('Email inválido!');
    if (usuarios.find(u => u.email === email)) return setErro('Já existe um usuário com este email!');
    const novo = { nome, email, senha, tipo };
    setUsuarios([...usuarios, novo]);
    setErro('');
    alert('Usuário cadastrado! Faça login.');
    setNome('');
    setEmail('');
    setSenha('');
  };



  if (isAdmin === null) {
    return <div style={{ maxWidth: 400, margin: '40px auto', fontFamily: 'sans-serif', textAlign: 'center' }}>Carregando...</div>;
  }
  if (!isAdmin) {
    return null;
  }
  return (
    <div style={{ maxWidth: 400, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>Cadastro de Usuários</h1>
      <form onSubmit={cadastrar} style={{ marginBottom: 30 }}>
        <h3>Cadastro de Usuários</h3>
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
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={e => setSenha(e.target.value)}
          style={{ marginBottom: 10, width: '100%' }}
        />
        <select value={tipo} onChange={e => setTipo(e.target.value)} style={{ marginBottom: 10, width: '100%' }}>
          <option value="usuario">Usuário</option>
          <option value="admin">Administrador</option>
        </select>
        <button type="submit" style={{ width: '100%' }}>Cadastrar</button>
      </form>
      {erro && <div style={{ color: 'red', marginTop: 12 }}>{erro}</div>}
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
