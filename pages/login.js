import Head from 'next/head';
import bcrypt from 'bcryptjs';
import styles from '../styles/Login.module.css';

import { useState } from 'react';
import { useRouter } from 'next/router';
import { db } from '../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [msg, setMsg] = useState('');
  const router = useRouter();

  // Login de usuário usando Firestore e bcryptjs
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !senha) return setErro('Preencha todos os campos!');
    if (!email.match(/^\S+@\S+\.\S+$/)) return setErro('Email inválido!');
    // Busca usuário no Firestore
    const q = query(collection(db, 'usuarios'), where('email', '==', email));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return setErro('Usuário não encontrado!');
    const user = querySnapshot.docs[0].data();
    // Compara senha digitada com hash salvo usando bcryptjs
    const senhaCorreta = await bcrypt.compare(senha, user.senha);
    if (!senhaCorreta) return setErro('Senha incorreta!');
    if (user.bloqueado) return setErro('Não foi possivel efetuar o login, por favor entrar em contato com o adminstrador do site');
    localStorage.setItem('usuarioLogado', JSON.stringify(user));
    setErro('');
    setMsg('Login realizado com sucesso!');
    const redirect = localStorage.getItem('redirectAfterLogin');
    if (redirect) {
      localStorage.removeItem('redirectAfterLogin');
      router.push(redirect);
    } else {
      router.push('/');
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Login | Prata Joias</title>
      </Head>
      <div className={styles.loginBox}>
        <div className={styles.login}>
          <div className={styles.innerContainer}>
            <h1>Log in</h1>
            <form onSubmit={handleLogin} style={{ width: '100%' }}>
              <input
                type="email"
                placeholder="Email"
                className={styles.input}
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Senha"
                className={styles.input}
                value={senha}
                onChange={e => setSenha(e.target.value)}
              />
              <div className={styles.optionsRow}>
                <label className={styles.remember}><input type="checkbox" /> <span>Lembrar-me</span></label>
                <a href="#" className={styles.forgot}>Esqueceu a senha?</a>
              </div>
              <button type="submit" className={styles.loginButton}>Entrar</button>
              {erro && <div style={{ color: 'red', marginTop: 10 }}>{erro}</div>}
            </form>
            <button
              type="button"
              style={{ marginTop: 18, width: '100%', background: '#888', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 0', cursor: 'pointer' }}
              onClick={() => window.location.href = '/'}
            >
              Voltar para Página Inicial
            </button>
            <div className={styles.hrRow}><hr /><span>Ou conectar com</span><hr /></div>
            <ul className={styles.socialList}>
              <li title="Facebook"><svg width="28" height="28" fill="#bfa46b" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.733 0-1.325.592-1.325 1.326v21.348c0 .733.592 1.326 1.325 1.326h11.495v-9.294h-3.128v-3.622h3.128v-2.672c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.326v-21.349c0-.734-.593-1.326-1.324-1.326z"/></svg></li>
              <li title="Twitter"><svg width="28" height="28" fill="#bfa46b" viewBox="0 0 24 24"><path d="M24 4.557a9.83 9.83 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.555-2.005.959-3.127 1.184a4.916 4.916 0 0 0-8.38 4.482c-4.083-.205-7.697-2.164-10.125-5.144a4.822 4.822 0 0 0-.664 2.475c0 1.708.87 3.216 2.188 4.099a4.904 4.904 0 0 1-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 0 1-2.224.084c.627 1.956 2.444 3.377 4.6 3.417a9.867 9.867 0 0 1-6.102 2.104c-.397 0-.788-.023-1.175-.069a13.945 13.945 0 0 0 7.548 2.212c9.057 0 14.009-7.513 14.009-14.009 0-.213-.005-.426-.014-.637a10.012 10.012 0 0 0 2.459-2.548z"/></svg></li>
              <li title="Github"><svg width="28" height="28" fill="#bfa46b" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.084-.729.084-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.834 2.809 1.304 3.495.997.108-.776.418-1.305.762-1.605-2.665-.305-5.466-1.334-5.466-5.93 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.553 3.297-1.23 3.297-1.23.653 1.653.242 2.873.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.803 5.624-5.475 5.921.43.372.823 1.102.823 2.222v3.293c0 .322.218.694.825.576 4.765-1.589 8.2-6.085 8.2-11.386 0-6.627-5.373-12-12-12z"/></svg></li>
              <li title="LinkedIn"><svg width="28" height="28" fill="#bfa46b" viewBox="0 0 24 24"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.27c-.966 0-1.75-.79-1.75-1.76 0-.97.784-1.76 1.75-1.76s1.75.79 1.75 1.76c0 .97-.784 1.76-1.75 1.76zm13.5 11.27h-3v-5.604c0-1.337-.025-3.061-1.865-3.061-1.867 0-2.154 1.457-2.154 2.963v5.702h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.561 2.841-1.561 3.039 0 3.6 2.001 3.6 4.6v5.594z"/></svg></li>
            </ul>
            <span className={styles.copyright}>&copy;2025</span>
          </div>
        </div>
        <div className={styles.register}>
          <div className={styles.innerContainer}>
            <svg width="64" height="64" fill="#fff" viewBox="0 0 24 24"><path d="M16 11c1.654 0 3-1.346 3-3s-1.346-3-3-3-3 1.346-3 3 1.346 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5v2.5c0 .553.447 1 1 1h12c.553 0 1-.447 1-1v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
            <h2>Bem-vindo!</h2>
            <p>Cadastre-se para começar sua jornada de elegância conosco.</p>
            <button className={styles.registerButton} type="button" onClick={() => window.location.href = '/criar-usuario'}>Registrar-se</button>
          </div>
        </div>
      </div>
    </div>
  );
}
