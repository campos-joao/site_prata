import React, { useState } from 'react';
import { useRouter } from 'next/router';

export default function CriarUsuario() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const router = useRouter();

  const cadastrar = (e) => {
    e.preventDefault();
    if (!nome || !email || !senha) return setErro('Preencha todos os campos!');
    if (!email.match(/^\S+@\S+\.\S+$/)) return setErro('Email inválido!');
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    if (usuarios.find(u => u.email === email)) return setErro('Já existe um usuário com este email!');
    const novo = { nome, email, senha, tipo: 'usuario' };
    localStorage.setItem('usuarios', JSON.stringify([...usuarios, novo]));
    setErro('');
    alert('Usuário criado com sucesso! Faça login para acessar a loja.');
    router.push('/login');
  };

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>Criar Conta de Usuário</h1>
      <form onSubmit={cadastrar} style={{ marginBottom: 30 }}>
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
        <button type="submit" style={{ width: '100%' }}>Criar Conta</button>
      </form>
      {erro && <div style={{ color: 'red', marginTop: 12 }}>{erro}</div>}
      <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
        <button
          type="button"
          style={{ flex: 1, padding: '8px 0', background: '#bfa46b', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}
          onClick={() => window.location.href = '/login'}
        >
          Voltar para Login
        </button>
        <button
          type="button"
          style={{ flex: 1, padding: '8px 0', background: '#888', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}
          onClick={() => window.location.href = '/'}
        >
          Página Principal
        </button>
      </div>
    </div>
  );
}
