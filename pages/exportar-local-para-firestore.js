import React, { useState } from 'react';
import bcrypt from 'bcryptjs';
import { useRouter } from 'next/router';
import { db } from '../firebaseConfig';
import { collection, addDoc, setDoc, doc, getDocs, deleteDoc } from 'firebase/firestore';

export default function ExportarLocalParaFirestore() {
  const [mensagem, setMensagem] = useState('');
  const [exportando, setExportando] = useState(false);
  const [isAdmin, setIsAdmin] = useState(null); // null: carregando, false: não admin, true: admin

  const router = useRouter();
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = JSON.parse(localStorage.getItem('usuarioLogado') || 'null');
      if (!user || user.tipo !== 'admin') {
        setIsAdmin(false);
        setTimeout(() => {
          router.replace('/');
        }, 1500);
      } else {
        setIsAdmin(true);
      }
    }
  }, [router]);

  // Função para exportar usuários do localStorage para Firestore
  const exportarUsuarios = async () => {
    setExportando(true);
    const usuariosLocal = JSON.parse(localStorage.getItem('usuarios') || '[]');
    let count = 0;
    for (const usuario of usuariosLocal) {
      // Gera hash de senha se não estiver em hash (simples checagem de tamanho)
      let senhaHash = usuario.senha;
      if (!senhaHash || senhaHash.length < 30) {
        senhaHash = await bcrypt.hash(usuario.senha, 10);
      }
      await addDoc(collection(db, 'usuarios'), {
        nome: usuario.nome,
        email: usuario.email,
        senha: senhaHash,
        tipo: usuario.tipo || 'usuario',
        bloqueado: usuario.bloqueado || false
      });
      count++;
    }
    setMensagem(`${count} usuários exportados para o Firestore!`);
    setExportando(false);
  };

  // Função para exportar produtos do localStorage para Firestore
  const exportarProdutos = async () => {
    setExportando(true);
    const produtosLocal = JSON.parse(localStorage.getItem('produtos') || '[]');
    let count = 0;
    for (const produto of produtosLocal) {
      await addDoc(collection(db, 'produtos'), {
        nome: produto.nome,
        preco: produto.preco,
        descricao: produto.descricao || '',
        imagem: produto.imagem || '',
        destaque: produto.destaque || false,
        estoque: produto.estoque || 0
      });
      count++;
    }
    setMensagem(`${count} produtos exportados para o Firestore!`);
    setExportando(false);
  };

  // Função para exportar carrinhos do localStorage para Firestore
  const exportarCarrinhos = async () => {
    setExportando(true);
    const carrinhosLocal = JSON.parse(localStorage.getItem('carrinhos') || '[]');
    let count = 0;
    for (const carrinho of carrinhosLocal) {
      if (!carrinho.email || !carrinho.itens) continue;
      await setDoc(doc(db, 'carrinhos', carrinho.email), {
        itens: carrinho.itens
      });
      count++;
    }
    setMensagem(`${count} carrinhos exportados para o Firestore!`);
    setExportando(false);
  };

  // Função para exportar um carrinho de teste para Firestore
  const exportarCarrinhoTeste = async () => {
    setExportando(true);
    const emailTeste = 'teste@exemplo.com';
    const itensTeste = [
      {
        nome: 'Anel de Prata',
        quantidade: 2,
        preco: 120.5,
        foto: 'https://exemplo.com/anel.jpg'
      },
      {
        nome: 'Pulseira de Prata',
        quantidade: 1,
        preco: 89.9,
        foto: 'https://exemplo.com/pulseira.jpg'
      }
    ];
    try {
      await setDoc(doc(db, 'carrinhos', emailTeste), {
        itens: itensTeste
      });
      setMensagem('Carrinho de teste exportado para o Firestore!');
    } catch (err) {
      setMensagem('Erro ao exportar carrinho de teste: ' + err.message);
    }
    setExportando(false);
  };

  // Função para exportar pedidos do localStorage para Firestore
  const exportarPedidos = async () => {
    setExportando(true);
    const pedidosLocal = JSON.parse(localStorage.getItem('pedidos') || '[]');
    let count = 0;
    for (const pedido of pedidosLocal) {
      await addDoc(collection(db, 'pedidos'), pedido);
      count++;
    }
    setMensagem(`${count} pedidos exportados para o Firestore!`);
    setExportando(false);
  };

  // Função para migrar usuários antigos para ID=email
  const migrarUsuariosParaEmailComoID = async () => {
    setExportando(true);
    setMensagem('Migrando usuários antigos...');
    try {
      const usuariosSnap = await getDocs(collection(db, 'usuarios'));
      let migrados = 0, pulados = 0;
      for (const docSnap of usuariosSnap.docs) {
        const dados = docSnap.data();
        const idAtual = docSnap.id;
        if (!dados.email) { pulados++; continue; }
        if (idAtual === dados.email) { pulados++; continue; }
        // Cria novo doc com ID = email
        await setDoc(doc(db, 'usuarios', dados.email), { ...dados });
        // Remove doc antigo
        await deleteDoc(doc(db, 'usuarios', idAtual));
        migrados++;
      }
      setMensagem(`${migrados} usuários migrados, ${pulados} já estavam corretos ou sem email.`);
    } catch (err) {
      setMensagem('Erro ao migrar usuários: ' + err.message);
    }
    setExportando(false);
  };

  // Função para exportar todos os dados
  const exportarTudo = async () => {
    setMensagem('Exportando usuários, produtos, carrinhos e pedidos...');
    await exportarUsuarios();
    await exportarProdutos();
    await exportarCarrinhos();
    await exportarPedidos();
    setMensagem('Exportação concluída!');
  };

  if (isAdmin === null) {
    return <div style={{ textAlign: 'center', marginTop: 60 }}>Carregando...</div>;
  }
  if (isAdmin === false) {
    return (
      <div style={{ maxWidth: 400, margin: '40px auto', fontFamily: 'sans-serif', textAlign: 'center', color: 'red' }}>
        <h2>Acesso negado</h2>
        <p>Você precisa ser um administrador para acessar esta página.</p>
      </div>
    );
  }
  return (
    <div style={{ maxWidth: 400, margin: '40px auto', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h2>Exportar LocalStorage para Firestore</h2>
      <button onClick={exportarUsuarios} disabled={exportando} style={{ margin: 8 }}>Exportar Usuários</button>
      <button onClick={migrarUsuariosParaEmailComoID} disabled={exportando} style={{ margin: 8, background: '#f2c94c' }}>Migrar Usuários antigos (ID=email)</button>
      <button onClick={exportarProdutos} disabled={exportando} style={{ margin: 8 }}>Exportar Produtos</button>
      <button onClick={exportarCarrinhos} disabled={exportando} style={{ margin: 8 }}>Exportar Carrinhos</button>
      <button onClick={exportarPedidos} disabled={exportando} style={{ margin: 8 }}>Exportar Pedidos</button>
      <button onClick={exportarCarrinhoTeste} disabled={exportando} style={{ margin: 8, background: '#e0e0e0' }}>Exportar Carrinho de Teste</button>
      <button onClick={exportarTudo} disabled={exportando} style={{ margin: 8, fontWeight: 'bold' }}>Exportar Tudo</button>
      <div style={{ marginTop: 24, color: 'green' }}>{mensagem}</div>
      <p style={{ marginTop: 30, color: '#888', fontSize: 13 }}>Após exportar, confira os dados no painel do Firebase.</p>
    </div>
  );
}
