import styles from '../styles/ProductGrid.module.css';
import productsDefault from './products';

import { useState } from 'react';

export default function ProductGrid({ products = productsDefault }) {
  const [expandedIdx, setExpandedIdx] = useState(null);

  const handleExpand = (idx) => {
    setExpandedIdx(expandedIdx === idx ? null : idx);
  };

  return (
    <div className={styles.grid} onClick={() => setExpandedIdx(null)}>
      {products.map((product, idx) => (
        <div
          className={expandedIdx === idx ? `${styles.card} ${styles.expanded}` : styles.card}
          key={idx}
          onClick={e => { e.stopPropagation(); handleExpand(idx); }}
          tabIndex={0}
          style={{ cursor: 'pointer' }}
        >
          <img
            src={product.foto || product.image}
            alt={product.nome || product.name}
            className={expandedIdx === idx ? `${styles.image} ${styles.imageExpanded}` : styles.image}
          />
          <h3>{product.name}</h3>
          <p className={styles.price}>{product.price}</p>
          {expandedIdx === idx && (
            <>
              <div className={styles.details}>
                <p><strong>Descrição:</strong> {product.descricao}</p>
                <p><strong>Material:</strong> {product.material}</p>
                <p><strong>Tamanho:</strong> {product.tamanho}</p>
              </div>
              <button
                style={{
                  marginTop: 12,
                  width: '100%',
                  background: '#bfa46b',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  padding: '10px 0',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: 15
                }}
                onClick={e => {
                  e.stopPropagation();
                  const carrinho = JSON.parse(localStorage.getItem('carrinho') || '[]');
                  // Verifica se já existe o produto no carrinho
                  const nome = product.nome || product.name;
                  const idxExistente = carrinho.findIndex(p => (p.nome || p.name) === nome);
                  if (idxExistente !== -1) {
                    carrinho[idxExistente].quantidade = (carrinho[idxExistente].quantidade || 1) + 1;
                  } else {
                    carrinho.push({ ...product, quantidade: 1 });
                  }
                  localStorage.setItem('carrinho', JSON.stringify(carrinho));
                  alert('Produto adicionado ao carrinho!');
                }}
              >
                Adicionar ao Carrinho
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
