import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
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
    }
  }, [router]);

  const salvar = (e) => {
    e.preventDefault();
    if (!nome || !email || !senha) return setErro('Preencha todos os campos!');
    if (!email.match(/^\S+@\S+\.\S+$/)) return setErro('Email inválido!');
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    // Verifica se está tentando usar email de outro usuário
    if (usuarios.find(u => u.email === email && u.email !== usuario.email)) return setErro('Já existe um usuário com este email!');
    // Atualiza usuário
    const atualizados = usuarios.map(u =>
      u.email === usuario.email ? { ...u, nome, email, senha } : u
    );
    localStorage.setItem('usuarios', JSON.stringify(atualizados));
    const novoLogado = { ...usuario, nome, email, senha };
    localStorage.setItem('usuarioLogado', JSON.stringify(novoLogado));
    setUsuario(novoLogado);
    setErro('');
    setSucesso('Perfil atualizado com sucesso!');
  };

  if (!usuario) return null;

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>Meu Perfil</h1>
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
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={e => setSenha(e.target.value)}
          style={{ marginBottom: 10, width: '100%' }}
        />
        <button type="submit" style={{ width: '100%' }}>Salvar Alterações</button>
      </form>
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
