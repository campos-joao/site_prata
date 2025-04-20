import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductGrid from '../components/ProductGrid';
import styles from '../styles/Home.module.css';
import { db } from '../firebaseConfig';
import { collection, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';

export default function Loja() {
  // Estado para armazenar os produtos vindos do Firestore
  const [produtos, setProdutos] = useState([]);
  // Estado para armazenar o usuário logado
  const [usuario, setUsuario] = useState(null);
  // Estado para armazenar o carrinho atual
  const [carrinho, setCarrinho] = useState([]);

  // useEffect para buscar produtos e usuário ao montar o componente
  useEffect(() => {
    // Busca usuário logado do localStorage
    const user = JSON.parse(localStorage.getItem('usuarioLogado') || 'null');
    setUsuario(user);
    // Função assíncrona para buscar produtos do Firestore
    async function fetchProdutos() {
      // Busca todos os produtos da coleção 'produtos' no Firestore
      const querySnapshot = await getDocs(collection(db, 'produtos'));
      // Atualiza o estado com a lista de produtos
      setProdutos(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }
    fetchProdutos();
  }, []);

  // Função para adicionar um produto ao carrinho no Firestore
  // Função para adicionar um produto ao carrinho
const adicionarCarrinho = async (produto) => {
  // Busca o usuário logado
  const user = JSON.parse(localStorage.getItem('usuarioLogado') || 'null');
  if (!user) {
    // Se não estiver logado, salva o carrinho no localStorage (carrinho anônimo)
    let anonCarrinho = JSON.parse(localStorage.getItem('carrinhoAnonimo') || '[]');
    const idx = anonCarrinho.findIndex(item => item.nome === produto.nome);
    if (idx > -1) {
      anonCarrinho[idx].quantidade = (anonCarrinho[idx].quantidade || 1) + 1;
    } else {
      anonCarrinho.push({ ...produto, quantidade: 1 });
    }
    localStorage.setItem('carrinhoAnonimo', JSON.stringify(anonCarrinho));
    setCarrinho(anonCarrinho);
    alert('Produto adicionado ao carrinho! Faça login para salvar seu carrinho.');
    return;
  }
  // Se estiver logado, busca o carrinho do Firestore
  const carrinhoDoc = await getDoc(doc(db, 'carrinhos', user.email));
  let itens = [];
  if (carrinhoDoc.exists()) {
    itens = carrinhoDoc.data().itens || [];
  }
  // Verifica se o produto já está no carrinho
  const idx = itens.findIndex(item => item.nome === produto.nome);
  if (idx > -1) {
    itens[idx].quantidade = (itens[idx].quantidade || 1) + 1;
  } else {
    itens.push({ ...produto, quantidade: 1 });
  }
  // Atualiza o documento do carrinho no Firestore
  await setDoc(doc(db, 'carrinhos', user.email), { itens });
  setCarrinho(itens);
};

// useEffect para sincronizar carrinho anônimo ao logar
useEffect(() => {
  const user = JSON.parse(localStorage.getItem('usuarioLogado') || 'null');
  setUsuario(user);
  async function fetchProdutos() {
    const querySnapshot = await getDocs(collection(db, 'produtos'));
    setProdutos(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }
  fetchProdutos();

  // Se logou e existe carrinho anônimo, faz o merge
  async function mergeCarrinhoAnonimo() {
    if (user) {
      const anonCarrinho = JSON.parse(localStorage.getItem('carrinhoAnonimo') || '[]');
      if (anonCarrinho.length > 0) {
        // Busca carrinho do Firestore
        const carrinhoDoc = await getDoc(doc(db, 'carrinhos', user.email));
        let itens = [];
        if (carrinhoDoc.exists()) {
          itens = carrinhoDoc.data().itens || [];
        }
        // Faz merge: soma quantidades dos produtos iguais
        anonCarrinho.forEach(anonItem => {
          const idx = itens.findIndex(item => item.nome === anonItem.nome);
          if (idx > -1) {
            itens[idx].quantidade += anonItem.quantidade;
          } else {
            itens.push(anonItem);
          }
        });
        // Salva merge no Firestore
        await setDoc(doc(db, 'carrinhos', user.email), { itens });
        setCarrinho(itens);
        // Limpa carrinho anônimo
        localStorage.removeItem('carrinhoAnonimo');
      } else {
        // Se não há carrinho anônimo, busca do Firestore normalmente
        const carrinhoDoc = await getDoc(doc(db, 'carrinhos', user.email));
        if (carrinhoDoc.exists()) {
          setCarrinho(carrinhoDoc.data().itens || []);
        } else {
          setCarrinho([]);
        }
      }
    } else {
      // Se não logado, mostra carrinho anônimo
      const anonCarrinho = JSON.parse(localStorage.getItem('carrinhoAnonimo') || '[]');
      setCarrinho(anonCarrinho);
    }
  }
  mergeCarrinhoAnonimo();
}, []);


  return (
    <div className={styles.container}>
      <Head>
        <title>Loja | Prata Joias</title>
        <meta name="description" content="Veja e compre itens da coleção Prata 2025." />
      </Head>
      <Navbar />
      <main className={styles.main}>
        <h2 className={styles.title}>Loja - Coleção Prata 2025</h2>
        {usuario && <div style={{ marginBottom: 20 }}>Bem-vindo, {usuario.nome}!</div>}
        <ProductGrid />
        <h2 style={{ marginTop: 40 }}>Carrinho</h2>
        <ul>
          {carrinho.length === 0 && <li>Carrinho vazio.</li>}
          {carrinho.map((item, idx) => (
            <li key={idx}>{item.nome} ({item.quantidade})</li>
          ))}
        </ul>
      </main>
      <Footer />
    </div>
  );
}
