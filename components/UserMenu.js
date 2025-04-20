import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";

export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLogged, setIsLogged] = useState(true);
  const menuRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    // Checa se o usuário está logado e se é admin
    function checkAuth() {
      if (typeof window !== 'undefined') {
        try {
          const user = JSON.parse(localStorage.getItem('usuarioLogado') || 'null');
          setIsLogged(!!user);
          setIsAdmin(user && user.tipo === 'admin');
        } catch {
          setIsLogged(false);
          setIsAdmin(false);
        }
      }
    }
    checkAuth();
    window.addEventListener('storage', checkAuth);
    window.addEventListener('focus', checkAuth);
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('focus', checkAuth);
    };
  }, []);

  if (!isLogged) return null;
  return (
    <div ref={menuRef} style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{ background: "none", border: "none", cursor: "pointer" }}
        aria-label="Abrir menu do usuário"
      >
        <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 12c2.7 0 8 1.34 8 4v2H4v-2c0-2.66 5.3-4 8-4zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"></path>
        </svg>
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            marginTop: 8,
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: 4,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            zIndex: 100,
          }}
        >
          <button
            onClick={() => router.push("/perfil")}
            style={{
              padding: "8px 16px",
              background: "none",
              border: "none",
              width: "100%",
              textAlign: "left",
              cursor: "pointer",
            }}
          >
            Perfil
          </button>
          <button
            onClick={() => router.push("/pedidos")}
            style={{
              padding: "8px 16px",
              background: "none",
              border: "none",
              width: "100%",
              textAlign: "left",
              cursor: "pointer",
              borderTop: '1px solid #eee'
            }}
          >
            Meus Pedidos
          </button>
          {isAdmin && (
            <button
              onClick={() => router.push("/criar-usuario")}
              style={{
                padding: "8px 16px",
                background: "none",
                border: "none",
                width: "100%",
                textAlign: "left",
                cursor: "pointer",
                color: '#bfa46b',
                borderTop: '1px solid #eee',
              }}
            >
              Cadastrar Usuário
            </button>
          )}
          <button
            onClick={() => {
              if (window.confirm('Tem certeza que deseja sair do perfil?')) {
                localStorage.removeItem('usuarioLogado');
                setIsLogged(false);
                router.push('/');
              }
            }}
            style={{
              padding: "8px 16px",
              background: "none",
              border: "none",
              width: "100%",
              textAlign: "left",
              cursor: "pointer",
              color: '#e74c3c',
              borderTop: '1px solid #eee'
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
