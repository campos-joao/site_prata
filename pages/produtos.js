import React, { useState } from 'react';

import { useEffect } from 'react';
import { useRouter } from 'next/router';

import productsDefault from '../components/products';

export default function Produtos() {
  const [isClient, setIsClient] = useState(false);
  const [produtos, setProdutos] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const salvos = JSON.parse(localStorage.getItem('produtos') || 'null');
        if (Array.isArray(salvos) && salvos.length > 0) return salvos;
      } catch {}
    }
    // Se não há nada salvo, retorna os defaults
    return productsDefault.map(p => ({
      nome: p.name || p.nome,
      quantidade: 1,
      descricao: p.descricao,
      preco: (p.price ? p.price.replace('R$','').replace(',','.') : ''),
      categoria: p.categoria || (p.name && p.name.toLowerCase().includes('anel') ? 'Anéis' : p.name && p.name.toLowerCase().includes('colar') ? 'Colares' : p.name && p.name.toLowerCase().includes('pulseira') ? 'Pulseiras' : p.name && p.name.toLowerCase().includes('brinco') ? 'Brincos' : p.name && p.name.toLowerCase().includes('relógio') ? 'Relógios' : ''),
      foto: p.image || null,
      destaque: false,
    }));
  });
  const [nome, setNome] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [categoria, setCategoria] = useState('Colares');
  const [foto, setFoto] = useState(null);
  const [tamanho, setTamanho] = useState('');
  const [material, setMaterial] = useState('');
  const [destaque, setDestaque] = useState(false);
  const [editando, setEditando] = useState(null); // índice do produto sendo editado
  const [busca, setBusca] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('Todas');

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Salvar produtos no localStorage sempre que mudar
  useEffect(() => {
    if (typeof window !== 'undefined' && Array.isArray(produtos) && produtos.length > 0) {
      localStorage.setItem('produtos', JSON.stringify(produtos));
    }
  }, [produtos]);

  // Adicionar produto
  const adicionarProduto = (e) => {
    e.preventDefault();
    if (!nome) return;
    if (editando !== null) {
      // Edição
      if (!window.confirm('Salvar alterações deste produto?')) return;
      const novosProdutos = [...produtos];
      novosProdutos[editando] = {
        ...novosProdutos[editando],
        nome,
        quantidade: Number(quantidade),
        descricao,
        preco,
        categoria,
        foto,
        tamanho,
        material,
        destaque,
      };
      setProdutos(novosProdutos);
      setEditando(null);
      setDestaque(false);
      setTamanho('');
      setMaterial('');
    } else {
      // Cadastro
      if (!window.confirm('Tem certeza que deseja cadastrar este produto?')) return;
      const idx = produtos.findIndex(p => p.nome === nome);
      if (idx > -1) {
        // Se já existe, incrementa quantidade
        const novosProdutos = [...produtos];
        novosProdutos[idx].quantidade += Number(quantidade);
        setProdutos(novosProdutos);
      } else {
        setProdutos([
          ...produtos,
          {
            nome,
            quantidade: Number(quantidade),
            descricao,
            preco,
            categoria,
            foto,
            tamanho,
            material,
            destaque,
          },
        ]);
      }
    }
    setNome('');
    setQuantidade(1);
    setDescricao('');
    setPreco('');
    setCategoria('Colares');
    setFoto(null);
    setTamanho('');
    setMaterial('');
    setDestaque(false);
  };

  // Função para iniciar edição
  const editarProduto = (idx) => {
    const produto = produtos[idx];
    setNome(produto.nome);
    setQuantidade(produto.quantidade);
    setDescricao(produto.descricao);
    setPreco(produto.preco);
    setCategoria(produto.categoria);
    setFoto(produto.foto || null);
    setTamanho(produto.tamanho || '');
    setMaterial(produto.material || '');
    setDestaque(!!produto.destaque);
    setEditando(idx);
  };

  // Remover 1 unidade do produto
  const removerProduto = (nome) => {
    setProdutos(produtos => produtos.map(p =>
      p.nome === nome && p.quantidade > 1 ? { ...p, quantidade: p.quantidade - 1 } : p
    ));
  };

  // Excluir produto completamente
  const excluirProduto = (nome) => {
    setProdutos(produtos => produtos.filter(p => p.nome !== nome));
  };

  const router = useRouter();
  const [acessoNegado, setAcessoNegado] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = JSON.parse(localStorage.getItem('usuarioLogado') || 'null');
      if (!user) {
        router.replace('/cadastro');
      } else if (user.tipo !== 'admin') {
        setAcessoNegado(true);
      }
    }
  }, []);

  if (acessoNegado) {
    return (
      <div style={{ maxWidth: 500, margin: '40px auto', fontFamily: 'sans-serif', color: 'red', textAlign: 'center' }}>
        <h2>Acesso negado</h2>
        <p>Você precisa ser um administrador para acessar esta página.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: 20 }}>
      <button
        onClick={() => window.location.href = '/'}
        style={{ marginBottom: 20, background: '#bfa46b', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 18px', cursor: 'pointer', fontWeight: 'bold', fontSize: 16 }}
      >
        Voltar para Página Inicial
      </button>
      <h1>Gerenciar Produtos</h1>

      <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
        <input
          type="text"
          placeholder="Buscar produto por nome ou descrição..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
          style={{ flex: 2, padding: 8, borderRadius: 6, border: '1px solid #ccc', fontSize: 16 }}
        />
        <select
          value={filtroCategoria}
          onChange={e => setFiltroCategoria(e.target.value)}
          style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #ccc', fontSize: 16 }}
        >
          <option value="Todas">Todas as Categorias</option>
          <option value="Colares">Colares</option>
          <option value="Anéis">Anéis</option>
          <option value="Pulseiras">Pulseiras</option>
          <option value="Brincos">Brincos</option>
          <option value="Relógios">Relógios</option>
        </select>
      </div>

      <form onSubmit={adicionarProduto} style={{ marginBottom: 30 }}>
        <input
          type="text"
          placeholder="Nome do produto"
          value={nome}
          onChange={e => setNome(e.target.value)}
          required
          style={{ marginRight: 10, marginBottom: 10 }}
        />
        <input
          type="text"
          placeholder="Tamanho (ex: 18cm, 8, Único)"
          value={tamanho}
          onChange={e => setTamanho(e.target.value)}
          style={{ marginRight: 10, marginBottom: 10, width: 90 }}
        />
        <input
          type="text"
          placeholder="Material (ex: Prata 925)"
          value={material}
          onChange={e => setMaterial(e.target.value)}
          style={{ marginRight: 10, marginBottom: 10, width: 110 }}
        />
        <input
          type="number"
          min="1"
          value={quantidade}
          onChange={e => setQuantidade(e.target.value)}
          style={{ marginRight: 10, width: 70, marginBottom: 10 }}
        />
        <input
          type="text"
          placeholder="Descrição"
          value={descricao}
          onChange={e => setDescricao(e.target.value)}
          style={{ marginRight: 10, marginBottom: 10, width: 180 }}
        />
        <select
          value={categoria}
          onChange={e => setCategoria(e.target.value)}
          style={{ marginRight: 10, marginBottom: 10, width: 130 }}
        >
          <option value="Colares">Colares</option>
          <option value="Anéis">Anéis</option>
          <option value="Pulseiras">Pulseiras</option>
          <option value="Brincos">Brincos</option>
          <option value="Relógios">Relógios</option>
        </select>
        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="Preço (R$)"
          value={preco}
          onChange={e => setPreco(e.target.value)}
          style={{ marginRight: 10, marginBottom: 10, width: 110 }}
        />
        <div style={{ marginBottom: 10 }}>
          {foto && (
            <div style={{ marginBottom: 8 }}>
              <img src={foto} alt="Imagem do produto" style={{ width: 90, height: 90, objectFit: 'cover', borderRadius: 10, border: '1px solid #ccc', background: '#faf9f6' }} />
            </div>
          )}
          <input
            id="input-foto-produto"
            type="file"
            accept="image/*"
            onChange={e => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onloadend = () => setFoto(reader.result);
                reader.readAsDataURL(file);
              } else {
                setFoto(null);
              }
            }}
            style={{ display: 'none' }}
          />
          <button
            type="button"
            onClick={() => document.getElementById('input-foto-produto').click()}
            style={{ background: '#bfa46b', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px', cursor: 'pointer', fontWeight: 'bold', fontSize: 15 }}
          >
            Adicionar Imagem
          </button>
          {foto && (
            <span style={{ marginLeft: 10, color: '#555', fontSize: 15 }}>Imagem selecionada</span>
          )}
        </div>
        <label style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
          <input
            type="checkbox"
            checked={destaque}
            onChange={e => setDestaque(e.target.checked)}
            style={{ marginRight: 8 }}
          />
          Deixar produto em <span style={{ color: '#bfa46b', fontWeight: 600, marginLeft: 2 }}>destaque</span>
        </label>
        <button type="submit">{editando !== null ? 'Salvar' : 'Adicionar'}</button>
        {editando !== null && (
          <button
            type="button"
            style={{ marginLeft: 8, background: '#888', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 12px', cursor: 'pointer' }}
            onClick={() => {
              setNome(''); setQuantidade(1); setDescricao(''); setPreco(''); setCategoria('Colares'); setFoto(null); setEditando(null);
            }}
          >
            Cancelar
          </button>
        )}
      </form>

      {isClient && (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {(() => {
            const filtrados = produtos.filter(produto => {
              const matchCategoria = filtroCategoria === 'Todas' || produto.categoria === filtroCategoria;
              const matchBusca =
                busca === '' ||
                (produto.nome && produto.nome.toLowerCase().includes(busca.toLowerCase())) ||
                (produto.descricao && produto.descricao.toLowerCase().includes(busca.toLowerCase()));
              return matchCategoria && matchBusca;
            });
            if (filtrados.length === 0) {
              return <li>Nenhum produto encontrado.</li>;
            }
            return filtrados.map((produto, idx) => (
              <li key={produto.nome} style={{ marginBottom: 16, display: 'flex', alignItems: 'center' }}>
                {produto.foto && (
                  <img src={produto.foto} alt={produto.nome} style={{ width: 60, height: 60, objectFit: 'cover', marginRight: 12, borderRadius: 8 }} />
                )}
                <div style={{ flex: 1 }}>
                  <strong>{produto.nome}</strong> {produto.destaque && <span style={{ color: '#bfa46b', fontWeight: 700, fontSize: 15, marginLeft: 6 }}>[DESTAQUE]</span>} (Qtd: {produto.quantidade})<br />
                  <span style={{ color: produto.destaque ? '#bfa46b' : '#888', fontSize: 13, fontWeight: produto.destaque ? 600 : 400 }}>
                    Em destaque: {produto.destaque ? 'Sim' : 'Não'}
                  </span><br />
                  <span style={{ color: '#888', fontSize: 13 }}>Categoria: {produto.categoria}</span><br />
                  <span style={{ color: '#888', fontSize: 13 }}>Tamanho: {produto.tamanho || '-'}</span><br />
                  <span style={{ color: '#888', fontSize: 13 }}>Material: {produto.material || '-'}</span><br />
                  <span style={{ color: '#555', fontSize: 14 }}>{produto.descricao}</span><br />
                  <span style={{ color: '#bfa46b', fontWeight: 600 }}>Preço: R$ {Number(produto.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <button onClick={() => editarProduto(idx)} style={{ marginRight: 8, background: '#bfa46b', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 10px', cursor: 'pointer' }}>Editar</button>
                <button onClick={() => removerProduto(produto.nome)} style={{ marginRight: 8 }}>Remover 1</button>
                <button onClick={() => excluirProduto(produto.nome)} style={{ background: '#e74c3c', color: '#fff' }}>Excluir</button>
              </li>
            ));
          })()}
        </ul>
      )}
    </div>
  );
}
