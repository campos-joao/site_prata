import styles from '../styles/Navbar.module.css';
import Link from 'next/link';

import { useEffect, useState } from 'react';

export default function Navbar() {
  return (
    <nav style={{ width: '100%', background: '#fff', borderBottom: '1px solid #eee', padding: 0, marginBottom: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 1400, margin: '0 auto', padding: '0 24px', height: 56 }}>
        {/* Esquerda */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 13, color: '#444', display: 'flex', alignItems: 'center', gap: 4 }}>
            <svg width="15" height="15" fill="#bfa46b" viewBox="0 0 24 24" style={{ marginRight: 2 }}><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
            <a href="#" style={{ color: '#444', textDecoration: 'underline', fontSize: 13 }}>Informar meu CEP</a>
          </span>
        </div>
        {/* Centro: Logo */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Link href="/" style={{ textDecoration: 'none', color: '#222' }} legacyBehavior>
            <a style={{ textDecoration: 'none', color: '#222' }}>
              <span style={{ fontFamily: 'serif', fontSize: 38, letterSpacing: 3, fontWeight: 400, color: '#222', cursor: 'pointer', transition: 'opacity 0.2s' }} onMouseOver={e => e.currentTarget.style.opacity = 0.7} onMouseOut={e => e.currentTarget.style.opacity = 1}>PRATA JOIAS</span>
            </a>
          </Link>
        </div>
        {/* Direita: Banner e ícones */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginRight: 8 }}>
            <span style={{ fontSize: 11, color: '#888', marginBottom: 2 }}>Visite também</span>
            <a href="#"><img src="/banner-life.jpg" alt="Life Prata" style={{ width: 80, height: 28, objectFit: 'contain', borderRadius: 4, background: '#f8ece6' }} /></a>
          </div>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} aria-label="Buscar">
            <svg width="22" height="22" fill="#bfa46b" viewBox="0 0 24 24"><path d="M21.71 20.29l-3.4-3.39A8,8,0,1,0,18,19.59l3.39,3.4a1,1,0,0,0,1.42-1.42ZM5,11A6,6,0,1,1,11,17,6,6,0,0,1,5,11Z"/></svg>
          </button>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} aria-label="Usuário">
            <svg width="22" height="22" fill="#bfa46b" viewBox="0 0 24 24"><path d="M12 12c2.7 0 8 1.34 8 4v2H4v-2c0-2.66 5.3-4 8-4zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg>
          </button>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, position: 'relative' }} aria-label="Sacola">
            <svg width="22" height="22" fill="#bfa46b" viewBox="0 0 24 24"><path d="M7 18c0 .55.45 1 1 1h8c.55 0 1-.45 1-1V8H7v10zM19 6h-2.18C16.4 4.84 15.3 4 14 4s-2.4.84-2.82 2H9c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7 2V6c0-1.1.9-2 2-2s2 .9 2 2v2h-4z"/></svg>
            <span style={{ position: 'absolute', top: -6, right: -6, background: '#e74c3c', color: '#fff', borderRadius: '50%', fontSize: 11, width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>0</span>
          </button>
        </div>
      </div>
      {/* Menu principal */}
      <div style={{ width: '100%', borderBottom: '1px solid #eee', background: '#fff' }}>
        <ul style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 40, margin: 0, padding: 0, height: 38, listStyle: 'none' }}>
          <li style={{ fontWeight: 500, color: '#222', fontSize: 15, cursor: 'pointer', fontFamily: 'serif', letterSpacing: 1 }}>JOIAS <span style={{ fontSize: 13, marginLeft: 2 }}>▼</span></li>
          <li style={{ fontWeight: 500, color: '#222', fontSize: 15, cursor: 'pointer', fontFamily: 'serif', letterSpacing: 1 }}>CASAMENTO <span style={{ fontSize: 13, marginLeft: 2 }}>▼</span></li>
          <li style={{ fontWeight: 500, color: '#222', fontSize: 15, cursor: 'pointer', fontFamily: 'serif', letterSpacing: 1 }}>RELÓGIOS <span style={{ fontSize: 13, marginLeft: 2 }}>▼</span></li>
          <li style={{ fontWeight: 500, color: '#222', fontSize: 15, cursor: 'pointer', fontFamily: 'serif', letterSpacing: 1 }}>ACESSÓRIOS <span style={{ fontSize: 13, marginLeft: 2 }}>▼</span></li>
          <li style={{ fontWeight: 500, color: '#222', fontSize: 15, cursor: 'pointer', fontFamily: 'serif', letterSpacing: 1 }}>MASCULINO <span style={{ fontSize: 13, marginLeft: 2 }}>▼</span></li>
          <li style={{ fontWeight: 500, color: '#222', fontSize: 15, cursor: 'pointer', fontFamily: 'serif', letterSpacing: 1 }}>PRESENTES <span style={{ fontSize: 13, marginLeft: 2 }}>▼</span></li>
        </ul>
      </div>
    </nav>
  );
}
