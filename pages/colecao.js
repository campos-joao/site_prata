import Head from 'next/head';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductGrid from '../components/ProductGrid';
import styles from '../styles/Home.module.css';

import { useEffect, useState } from 'react';

export default function Colecao() {
  const [isClient, setIsClient] = useState(false);
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      try {
        const salvos = JSON.parse(localStorage.getItem('produtos') || 'null');
        if (Array.isArray(salvos) && salvos.length > 0) setProdutos(salvos);
        else setProdutos([]);
      } catch {
        setProdutos([]);
      }
    }
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Coleção Prata 2025 | Prata Joias</title>
        <meta name="description" content="Veja toda a coleção de joias Prata 2025." />
      </Head>
      <Navbar />
      <main className={styles.main}>
        <h2 className={styles.title}>Coleção Prata 2025</h2>
        <p>Explore nossa seleção exclusiva de joias em prata, inspirada nos melhores momentos da vida.</p>
        {isClient && <ProductGrid products={produtos} />}
      </main>
      <Footer />
    </div>
  );
}
