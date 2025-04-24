import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { db } from '../firebaseConfig';
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc
} from 'firebase/firestore';

// productsDefault pode ser usado como fallback inicial, mas não será salvo em localStorage
import productsDefault from '../components/products';

export default function Produtos() {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const [acessoNegado, setAcessoNegado] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = JSON.parse(localStorage.getItem('usuarioLogado') || 'null');
      if (!user || user.tipo !== 'admin') {
        setAcessoNegado(true);
        router.replace('/');
      }
    }
  }, []);
  // Lista de produtos vinda do Firestore
  const [produtos, setProdutos] = useState([]);

  // Carrega produtos do Firestore ao montar
  useEffect(() => {
    async function fetchProdutos() {
      const querySnapshot = await getDocs(collection(db, 'produtos'));
      setProdutos(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }
    fetchProdutos();
  }, []);
  const [nome, setNome] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [categoria, setCategoria] = useState('Colares');
  const [imagem, setImagem] = useState(null);
  const [tamanho, setTamanho] = useState('');
  const [material, setMaterial] = useState('');
  const [destaque, setDestaque] = useState(false);
  const [editando, setEditando] = useState(null); // índice do produto sendo editado
  const [busca, setBusca] = useState('');
  const [buscaInput, setBuscaInput] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('Todas');
  const [filtroDestaque, setFiltroDestaque] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);


  // Adicionar ou editar produto no Firestore
  const adicionarProduto = async (e) => {
    e.preventDefault();
    if (!nome) return;
    if (editando !== null) {
      // Edição
      if (!window.confirm('Salvar alterações deste produto?')) return;
      const produtoEdit = produtos[editando];
      await updateDoc(doc(db, 'produtos', produtoEdit.id), {
        nome: nome || '',
        quantidade: Number(quantidade) || 0,
        descricao: descricao || '',
        preco: preco || '',
        categoria: categoria || 'Colares',
        imagem: imagem || '',
        tamanho: tamanho || '',
        material: material || '',
        destaque: destaque || false,
      });
      // Atualiza lista
      const snap = await getDocs(collection(db, 'produtos'));
      setProdutos(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setEditando(null);
      setDestaque(false);
      setTamanho('');
      setMaterial('');
    } else {
      // Cadastro
      if (!window.confirm('Tem certeza que deseja cadastrar este produto?')) return;
      // Verifica se já existe produto com mesmo nome
      const exists = produtos.find(p => p.nome === nome);
      if (exists) {
        // Se já existe, incrementa quantidade
        await updateDoc(doc(db, 'produtos', exists.id), {
          ...exists,
          quantidade: Number(exists.quantidade) + Number(quantidade)
        });
      } else {
        await addDoc(collection(db, 'produtos'), {
          nome,
          quantidade: Number(quantidade),
          descricao,
          preco,
          categoria,
          imagem,
          tamanho,
          material,
          destaque,
        });
      }
      // Atualiza lista
      const snap = await getDocs(collection(db, 'produtos'));
      setProdutos(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }
    setNome('');
    setQuantidade(1);
    setDescricao('');
    setPreco('');
    setCategoria('Colares');
    setImagem(null);
    setTamanho('');
    setMaterial('');
    setDestaque(false);
  };

  // Função para iniciar edição de produto (preenche campos do formulário)
  const editarProduto = (idx) => {
    const p = produtos[idx];
    setNome(p.nome);
    setQuantidade(p.quantidade);
    setDescricao(p.descricao);
    setPreco(p.preco);
    setCategoria(p.categoria);
    setImagem(p.imagem);
    setTamanho(p.tamanho);
    setMaterial(p.material);
    setDestaque(p.destaque);
    // Corrigido: usar 'p' ao invés de 'produto'
setDestaque(!!p.destaque);
    setEditando(idx);
  };

  // Remover 1 unidade do produto no Firestore
  const removerProduto = async (nome) => {
    const produto = produtos.find(p => p.nome === nome);
    if (produto && produto.quantidade > 1) {
      await updateDoc(doc(db, 'produtos', produto.id), {
        ...produto,
        quantidade: produto.quantidade - 1
      });
      const snap = await getDocs(collection(db, 'produtos'));
      setProdutos(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }
  };

  // Excluir produto completamente do Firestore
  const excluirProduto = async (nome) => {
    const produto = produtos.find(p => p.nome === nome);
    if (produto) {
      await deleteDoc(doc(db, 'produtos', produto.id));
      const snap = await getDocs(collection(db, 'produtos'));
      setProdutos(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }
  };



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
          value={buscaInput}
          onChange={e => setBuscaInput(e.target.value)}
          style={{ flex: 2, padding: 8, borderRadius: 6, border: '1px solid #ccc', fontSize: 16 }}
        />
        <button
          type="button"
          onClick={() => setBusca(buscaInput)}
          style={{ padding: 8, borderRadius: 6, border: '1px solid #bfa46b', background: '#bfa46b', color: '#fff', fontWeight: 'bold', fontSize: 16, cursor: 'pointer' }}
        >
          Aplicar busca
        </button>
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
          {imagem && (
            <div style={{ marginBottom: 8 }}>
              <img src={imagem} alt="Imagem do produto" style={{ width: 90, height: 90, objectFit: 'cover', borderRadius: 10, border: '1px solid #ccc', background: '#faf9f6' }} />
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
                reader.onloadend = () => setImagem(reader.result);
                reader.readAsDataURL(file);
              } else {
                setImagem(null);
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
          {imagem && (
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
              setNome(''); setQuantidade(1); setDescricao(''); setPreco(''); setCategoria('Colares'); setImagem(null); setEditando(null);
            }}
          >
            Cancelar
          </button>
        )}
      </form>

    {/* Filtro de destaque e lista de produtos */}
    {isClient && (
      <>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 15 }}>
            <input
              type="checkbox"
              checked={filtroDestaque}
              onChange={e => setFiltroDestaque(e.target.checked)}
              style={{ marginRight: 8 }}
            />
            Mostrar apenas produtos em destaque
          </label>
        </div>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {(() => {
            const filtrados = produtos.filter(produto => {
              const matchCategoria = filtroCategoria === 'Todas' || produto.categoria === filtroCategoria;
              const matchBusca =
                busca === '' ||
                (produto.nome && produto.nome.toLowerCase().includes(busca.toLowerCase())) ||
                (produto.descricao && produto.descricao.toLowerCase().includes(busca.toLowerCase()));
              const matchDestaque = !filtroDestaque || produto.destaque === true;
              return matchCategoria && matchBusca && matchDestaque;
            });
            if (filtrados.length === 0) {
              return <li>Nenhum produto encontrado.</li>;
            }
            return filtrados.map((produto, idx) => (
              <li key={produto.nome} style={{ marginBottom: 16, display: 'flex', alignItems: 'center' }}>
                {produto.imagem && (
                  <img src={produto.imagem} alt={produto.nome} style={{ width: 60, height: 60, objectFit: 'cover', marginRight: 12, borderRadius: 8 }} />
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
      </>
    )}
  </div>
  );
}
