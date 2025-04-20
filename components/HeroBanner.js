import Link from 'next/link';
import styles from '../styles/HeroBanner.module.css';

export default function HeroBanner() {
  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <h1>Nova Coleção Prata 2025</h1>
        <p>Joias que celebram momentos únicos. Elegância, sofisticação e exclusividade.</p>
        <Link href="/colecao" legacyBehavior>
          <a className={styles.cta}>Ver Coleção</a>
        </Link>
      </div>
    </section>
  );
}
