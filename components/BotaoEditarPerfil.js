import { useRouter } from "next/router";

export default function BotaoEditarPerfil() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/editar-perfil")}
      style={{
        background: "none",
        border: "none",
        padding: 0,
        cursor: "pointer"
      }}
      aria-label="Editar perfil"
    >
      <svg width="22" height="22" fill="#bfa46b" viewBox="0 0 24 24">
        <path d="M12 12c2.7 0 8 1.34 8 4v2H4v-2c0-2.66 5.3-4 8-4zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"></path>
      </svg>
    </button>
  );
}
