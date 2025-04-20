import styles from '../styles/Footer.module.css';
import UserMenu from './UserMenu';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div>
        <strong>Prata Joias</strong> &copy; {new Date().getFullYear()}<br />
        Inspirado em Vivara. Todos os direitos reservados.
      </div>
      <div>
        <a href="#">Contato</a> | <a href="#">Política de Privacidade</a>
      </div>
      <div>
        <UserMenu />
      </div>
    </footer>
  );
}
