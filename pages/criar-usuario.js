import React, { useState, useEffect } from 'react';
import bcrypt from 'bcryptjs';
import { useRouter } from 'next/router';
import { db } from '../firebaseConfig';
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc, setDoc
} from 'firebase/firestore';

export default function CriarUsuario() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [editandoIdx, setEditandoIdx] = useState(null); // índice do usuário sendo editado
  const [isAdmin, setIsAdmin] = useState(false);
  const [tipo, setTipo] = useState('usuario'); // tipo selecionado para novo usuário
  const [cpf, setCpf] = useState('');
  const [endereco, setEndereco] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [erroCpf, setErroCpf] = useState('');
  const [erroNascimento, setErroNascimento] = useState('');
  const router = useRouter();

  // Carrega usuários do Firestore ao montar
  useEffect(() => {
    async function fetchUsuarios() {
      const querySnapshot = await getDocs(collection(db, 'usuarios'));
      const usersArr = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsuarios(usersArr);
      // Verifica admin pelo localStorage (mantém fluxo atual)
      const userLogado = JSON.parse(localStorage.getItem('usuarioLogado') || 'null');
      setIsAdmin(!!userLogado && userLogado.tipo === 'admin');
    }
    fetchUsuarios();
  }, []);

  // Cadastrar ou editar usuário no Firestore
  const cadastrar = async (e) => {
    e.preventDefault();
    if (!nome || !email || !senha || !cpf || !endereco || !dataNascimento) return setErro('Preencha todos os campos!');
    if (!email.match(/^\S+@\S+\.\S+$/)) return setErro('Email inválido!');
    // Validação CPF
    const cpfLimpo = cpf.replace(/\D/g, '');
    if (cpfLimpo.length !== 11) return setErro('CPF inválido!');
    // Validação maioridade
    const hoje = new Date();
    const nasc = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nasc.getFullYear();
    const m = hoje.getMonth() - nasc.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--;
    if (idade < 18) return setErro('Você deve ter pelo menos 18 anos para se cadastrar.');
    // Busca todos usuários para checar duplicidade
    const querySnapshot = await getDocs(collection(db, 'usuarios'));
    const usersArr = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    if (editandoIdx !== null) {
      // Edição
      const userEdit = usuarios[editandoIdx];
      if (usersArr.find((u, idx) => u.email === email && u.id !== userEdit.id)) return setErro('Já existe um usuário com este email!');
      try {
        // Gera hash da senha antes de salvar
        const senhaHash = await bcrypt.hash(senha, 10);
        await updateDoc(doc(db, 'usuarios', userEdit.id), { nome, email, senha: senhaHash });
        const novosUsuarios = usersArr.map(u => u.id === userEdit.id ? { ...u, nome, email, senha: senhaHash } : u);
        setUsuarios(novosUsuarios);
        setEditandoIdx(null);
        setErro('');
        alert('Usuário editado com sucesso!');
        setNome('');
        setEmail('');
        setSenha('');
        return;
      } catch (err) {
        setErro('Erro ao salvar usuário.');
      }
    }
    // Cadastro
    if (usersArr.find(u => u.email === email)) return setErro('Já existe um usuário com este email!');
    try {
      // Gera hash da senha antes de salvar
      const senhaHash = await bcrypt.hash(senha, 10);
      const novo = { nome, email, senha: senhaHash, tipo: isAdmin ? tipo : 'usuario', bloqueado: false, cpf, endereco, dataNascimento };
      await addDoc(collection(db, 'usuarios'), novo);
      // Atualiza lista
      const snap = await getDocs(collection(db, 'usuarios'));
      setUsuarios(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setErro('');
      if (isAdmin) {
        alert('Usuário criado com sucesso!');
        setNome('');
        setEmail('');
        setSenha('');
        setTipo('usuario');
      } else {
        alert('Usuário criado com sucesso! Faça login para acessar a loja.');
        router.push('/login');
      }
    } catch (err) {
      setErro('Erro ao salvar usuário.');
      console.error('Erro ao salvar usuário:', err);
    }
  };

  // Excluir usuário do Firestore
  const excluirUsuario = async (idx) => {
    if (!window.confirm('Tem certeza que deseja excluir este usuário?')) return;
    const user = usuarios[idx];
    await deleteDoc(doc(db, 'usuarios', user.id));
    const snap = await getDocs(collection(db, 'usuarios'));
    setUsuarios(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    if (editandoIdx === idx) cancelarEdicao();
  };

  // Bloquear/desbloquear usuário no Firestore
  const toggleBloqueioUsuario = async (idx) => {
    const user = usuarios[idx];
    await updateDoc(doc(db, 'usuarios', user.id), { bloqueado: !user.bloqueado });
    const snap = await getDocs(collection(db, 'usuarios'));
    setUsuarios(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  // Função para iniciar edição
  // Preenche campos para edição
  const editarUsuario = (idx) => {
    const u = usuarios[idx];
    setNome(u.nome);
    setEmail(u.email);
    setSenha(u.senha);
    setEditandoIdx(idx);
  };

  // Função para cancelar edição
  const cancelarEdicao = () => {
    setEditandoIdx(null);
    setNome('');
    setEmail('');
    setSenha('');
    setErro('');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(120deg, #f7f6f2 0%, #ede9df 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <main style={{ background: '#fff', borderRadius: 18, boxShadow: '0 6px 32px #bfa46b22', padding: '36px 28px', maxWidth: 400, width: '100%', fontFamily: 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 style={{ color: '#bfa46b', fontWeight: 700, fontSize: 28, marginBottom: 18, letterSpacing: 0.5 }}>Criar Conta de Usuário</h1>
        <form onSubmit={cadastrar} style={{ width: '100%', marginBottom: 18 }}>
          {editandoIdx !== null && (
            <div style={{ color: '#bfa46b', marginBottom: 10, textAlign: 'center' }}>
              Editando usuário <b>{usuarios[editandoIdx]?.nome}</b>
              <button type="button" onClick={cancelarEdicao} style={{ marginLeft: 14, color: '#e74c3c', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }}>Cancelar</button>
            </div>
          )}
          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={e => setNome(e.target.value)}
            style={{ marginBottom: 14, width: '100%', padding: 10, borderRadius: 8, border: '1px solid #e6e6e6', fontSize: 16, outlineColor: '#bfa46b', transition: 'border 0.2s' }}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ marginBottom: 14, width: '100%', padding: 10, borderRadius: 8, border: '1px solid #e6e6e6', fontSize: 16, outlineColor: '#bfa46b', transition: 'border 0.2s' }}
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={e => setSenha(e.target.value)}
            style={{ marginBottom: 14, width: '100%', padding: 10, borderRadius: 8, border: '1px solid #e6e6e6', fontSize: 16, outlineColor: '#bfa46b', transition: 'border 0.2s' }}
          />
          <input
            type="text"
            placeholder="CPF"
            value={cpf}
            onChange={e => {
              // Máscara de CPF: 000.000.000-00
              let val = e.target.value.replace(/\D/g, '');
              if (val.length > 11) val = val.slice(0, 11);
              val = val.replace(/(\d{3})(\d)/, '$1.$2');
              val = val.replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
              val = val.replace(/(\d{3})\.(\d{3})\.(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
              setCpf(val);
            }}
            maxLength={14}
            style={{ marginBottom: 14, width: '100%', padding: 10, borderRadius: 8, border: '1px solid #e6e6e6', fontSize: 16, outlineColor: '#bfa46b', transition: 'border 0.2s' }}
          />
          {erroCpf && <div style={{ color: 'red', marginBottom: 6 }}>{erroCpf}</div>}
          <input
            type="text"
            placeholder="Endereço"
            value={endereco}
            onChange={e => setEndereco(e.target.value)}
            style={{ marginBottom: 14, width: '100%', padding: 10, borderRadius: 8, border: '1px solid #e6e6e6', fontSize: 16, outlineColor: '#bfa46b', transition: 'border 0.2s' }}
          />
          <input
            type="date"
            placeholder="Data de Nascimento"
            value={dataNascimento}
            onChange={e => setDataNascimento(e.target.value)}
            style={{ marginBottom: 14, width: '100%', padding: 10, borderRadius: 8, border: '1px solid #e6e6e6', fontSize: 16, outlineColor: '#bfa46b', transition: 'border 0.2s' }}
          />
          {erroNascimento && <div style={{ color: 'red', marginBottom: 6 }}>{erroNascimento}</div>}
          {isAdmin && (
            <select
              value={tipo}
              onChange={e => setTipo(e.target.value)}
              style={{ marginBottom: 14, width: '100%', padding: 10, borderRadius: 8, border: '1px solid #e6e6e6', fontSize: 16, outlineColor: '#bfa46b', transition: 'border 0.2s' }}
            >
              <option value="usuario">Usuário comum</option>
              <option value="admin">Administrador</option>
            </select>
          )}
          <button
            type="submit"
            style={{
              width: '100%',
              background: '#bfa46b',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '12px 0',
              fontWeight: 700,
              fontSize: 17,
              marginTop: 12,
              cursor: 'pointer',
              boxShadow: '0 2px 8px #bfa46b11',
              transition: 'background 0.2s'
            }}
          >
            Criar Conta
          </button>
        </form>
        {erro && <div style={{ color: '#e74c3c', marginTop: 10, fontWeight: 600, textAlign: 'center', background: '#ffeaea', borderRadius: 6, padding: 8 }}>{erro}</div>}
      {isAdmin && (
        <>
          <h2 style={{ marginTop: 40, fontSize: 22, color: '#bfa46b', fontWeight: 700, textAlign: 'center' }}>Usuários cadastrados</h2>
          <div style={{ background: '#fafafa', border: '1px solid #eee', borderRadius: 10, padding: 16, marginTop: 18, boxShadow: '0 2px 12px #bfa46b11' }}>
            {usuarios.length === 0 ? (
              <div style={{ color: '#888', textAlign: 'center' }}>Nenhum usuário cadastrado.</div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
                  <thead>
                    <tr style={{ background: '#f4f4f4' }}>
                      <th style={{ textAlign: 'left', padding: 6, borderBottom: '1px solid #eee' }}>Nome</th>
                      <th style={{ textAlign: 'left', padding: 6, borderBottom: '1px solid #eee' }}>Email</th>
                      <th style={{ textAlign: 'left', padding: 6, borderBottom: '1px solid #eee' }}>Tipo</th>
                      <th style={{ textAlign: 'left', padding: 6, borderBottom: '1px solid #eee' }}>Status</th>
                      <th style={{ textAlign: 'left', padding: 6, borderBottom: '1px solid #eee' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map((u, idx) => (
                      <tr key={u.email + idx}>
                        <td style={{ padding: 6, borderBottom: '1px solid #f0f0f0' }}>{u.nome}</td>
                        <td style={{ padding: 6, borderBottom: '1px solid #f0f0f0' }}>{u.email}</td>
                        <td style={{ padding: 6, borderBottom: '1px solid #f0f0f0', color: u.tipo === 'admin' ? '#bfa46b' : '#333', fontWeight: u.tipo === 'admin' ? 600 : 400 }}>{u.tipo}</td>
                        <td style={{ padding: 6, borderBottom: '1px solid #f0f0f0', color: u.bloqueado ? '#e74c3c' : '#27ae60', fontWeight: 600 }}>
                          {u.bloqueado ? 'Bloqueado' : 'Ativo'}
                        </td>
                        <td style={{ padding: 6, borderBottom: '1px solid #f0f0f0', whiteSpace: 'nowrap' }}>
                          <button onClick={() => editarUsuario(idx)} style={{ background: '#bfa46b', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 10px', cursor: 'pointer', fontSize: 14, marginRight: 5 }}>Editar</button>
                          <button onClick={() => excluirUsuario(idx)} style={{ background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 10px', cursor: 'pointer', fontSize: 14, marginRight: 5 }}>Excluir</button>
                          <button onClick={() => toggleBloqueioUsuario(idx)} style={{ background: u.bloqueado ? '#27ae60' : '#e67e22', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 10px', cursor: 'pointer', fontSize: 14 }}>
                            {u.bloqueado ? 'Desbloquear' : 'Bloquear'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
      <div style={{ display: 'flex', gap: 12, marginTop: 28, width: '100%' }}>
        <button
          type="button"
          style={{ flex: 1, padding: '10px 0', background: '#bfa46b', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: 16, boxShadow: '0 2px 8px #bfa46b11' }}
          onClick={() => window.location.href = '/login'}
        >
          Voltar para Login
        </button>
        <button
          type="button"
          style={{ flex: 1, padding: '10px 0', background: '#888', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: 16, boxShadow: '0 2px 8px #bfa46b11' }}
          onClick={() => window.location.href = '/'}
        >
          Página Principal
        </button>
      </div>
    </main>
  </div>);
}
