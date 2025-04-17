import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductGrid from '../components/ProductGrid';
import styles from '../styles/Home.module.css';

export default function Loja() {
  const [produtos, setProdutos] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [carrinho, setCarrinho] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('usuarioLogado') || 'null');
    setUsuario(user);
    // Simula produtos salvos no localStorage (caso admin tenha cadastrado)
    const prods = JSON.parse(localStorage.getItem('produtos') || '[]');
    setProdutos(prods);
  }, []);

  // Salva produtos no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem('produtos', JSON.stringify(produtos));
  }, [produtos]);

  // Adiciona ao carrinho
  const adicionarCarrinho = (produto) => {
    setCarrinho([...carrinho, produto]);
  };

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
