import Head from 'next/head';
import Navbar from '../components/Navbar';
import HeroBanner from '../components/HeroBanner';
import styles from '../styles/Home.module.css';
import ProductGrid from '../components/ProductGrid';
import Footer from '../components/Footer';

import { useEffect, useState } from 'react';

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Prata Joias - Inspirado na Vivara</title>
        <meta name="description" content="Joias exclusivas, anéis, colares, brincos e mais. Inspirado na Vivara." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <HeroBanner />
      <main className={styles.main}>
        <h1 style={{ textAlign: 'center', fontFamily: 'serif', letterSpacing: 2, fontWeight: 400, marginBottom: 0 }}>PRATA JOIAS</h1>
        <div style={{ textAlign: 'center', color: '#888', letterSpacing: 2, fontSize: 13, marginBottom: 32, marginTop: 2 }}>ESCOLHA POR CATEGORIAS</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 28, flexWrap: 'wrap', marginBottom: 40 }}>
          <a href="/loja?categoria=Anéis" style={{ textDecoration: 'none', color: '#222', textAlign: 'center', width: 160 }}>
            <div style={{ background: '#fafafa', borderRadius: 8, boxShadow: '0 2px 10px #0001', padding: 10 }}>
              <img src="/categorias/aneis.jpg" alt="Anéis e Alianças" style={{ width: '100%', height: 130, objectFit: 'cover', borderRadius: 4, marginBottom: 10 }} />
              <div style={{ fontFamily: 'serif', fontSize: 16 }}>Anéis e Alianças</div>
            </div>
          </a>
          <a href="/loja?categoria=Brincos" style={{ textDecoration: 'none', color: '#222', textAlign: 'center', width: 160 }}>
            <div style={{ background: '#fafafa', borderRadius: 8, boxShadow: '0 2px 10px #0001', padding: 10 }}>
              <img src="/categorias/brincos.jpg" alt="Brincos" style={{ width: '100%', height: 130, objectFit: 'cover', borderRadius: 4, marginBottom: 10 }} />
              <div style={{ fontFamily: 'serif', fontSize: 16 }}>Brincos</div>
            </div>
          </a>
          <a href="/loja?categoria=Colares" style={{ textDecoration: 'none', color: '#222', textAlign: 'center', width: 160 }}>
            <div style={{ background: '#fafafa', borderRadius: 8, boxShadow: '0 2px 10px #0001', padding: 10 }}>
              <img src="/categorias/colares.jpg" alt="Colares" style={{ width: '100%', height: 130, objectFit: 'cover', borderRadius: 4, marginBottom: 10 }} />
              <div style={{ fontFamily: 'serif', fontSize: 16 }}>Colares</div>
            </div>
          </a>
          <a href="/loja?categoria=Pingentes" style={{ textDecoration: 'none', color: '#222', textAlign: 'center', width: 160 }}>
            <div style={{ background: '#fafafa', borderRadius: 8, boxShadow: '0 2px 10px #0001', padding: 10 }}>
              <img src="/categorias/pingentes.jpg" alt="Pingentes" style={{ width: '100%', height: 130, objectFit: 'cover', borderRadius: 4, marginBottom: 10 }} />
              <div style={{ fontFamily: 'serif', fontSize: 16 }}>Pingentes</div>
            </div>
          </a>
          <a href="/loja?categoria=Pulseiras" style={{ textDecoration: 'none', color: '#222', textAlign: 'center', width: 160 }}>
            <div style={{ background: '#fafafa', borderRadius: 8, boxShadow: '0 2px 10px #0001', padding: 10 }}>
              <img src="/categorias/pulseiras.jpg" alt="Pulseiras" style={{ width: '100%', height: 130, objectFit: 'cover', borderRadius: 4, marginBottom: 10 }} />
              <div style={{ fontFamily: 'serif', fontSize: 16 }}>Pulseiras</div>
            </div>
          </a>
          <a href="/loja?categoria=Relógios" style={{ textDecoration: 'none', color: '#222', textAlign: 'center', width: 160 }}>
            <div style={{ background: '#fafafa', borderRadius: 8, boxShadow: '0 2px 10px #0001', padding: 10 }}>
              <img src="/categorias/relogios.jpg" alt="Relógios" style={{ width: '100%', height: 130, objectFit: 'cover', borderRadius: 4, marginBottom: 10 }} />
              <div style={{ fontFamily: 'serif', fontSize: 16 }}>Relógios</div>
            </div>
          </a>
        </div>
        {/* FIM GRID DE CATEGORIAS */}
        <h2 className={styles.title}>Destaques</h2>
        {/* Destaques reais: apenas produtos marcados como destaque */}
        {isClient && (() => {
          let produtos = [];
          try {
            produtos = JSON.parse(localStorage.getItem('produtos') || '[]');
          } catch {}
          const destaques = produtos.filter(p => p.destaque === true);
          if (destaques.length === 0) {
            return <div style={{marginTop: 24, color: '#bfa46b'}}>Nenhum produto em destaque no momento.</div>;
          }
          return (
            <div className={styles.grid} style={{ marginTop: 24 }}>
              {destaques.map((produto, idx) => (
                <div key={produto.nome+idx} className={styles.card}>
                  {produto.foto && (
                    <img src={produto.foto} alt={produto.nome} className={styles.image} style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 8, marginBottom: 8 }} />
                  )}
                  <div><strong>{produto.nome}</strong></div>
                  <div style={{ color: '#555', fontSize: 14 }}>{produto.descricao}</div>
                  <div>Qtd disponível: {produto.quantidade}</div>
                </div>
              ))}
            </div>
          );
        })()}


      </main>
      <Footer />
    </div>
  );
}
