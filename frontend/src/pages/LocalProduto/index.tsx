import { useState, useEffect, useRef } from "react";
import { Fornecedor, fornecedorServices } from "../../services/fornecedorServices";
import { ApiException } from "../../config/apiException";

import './style.css';

/* Tabela */
import { Table } from "react-bootstrap";
import { ColumnDef, createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

/* Componentes */
import ToggleBtn from "../../components/ToggleBtn";
import EditarRemoverBtn from "../../components/EditarRemoverBtn";
import BtnAzul from "../../components/BtnAzul";
import Modal from "../../components/Modal";
import BtnCancelar from "../../components/BtnCancelar";
import FornecedorFormulario from "../../components/Formularios/Fornecedor/Forn_Cadastrar.tsx";
import Forn_Edicao from "../../components/Formularios/Fornecedor/Forn_Editar";
import Forn_Excluir from "../../components/Formularios/Fornecedor/Forn_Excluir";

/* Icons */
import { IoAddCircleOutline, IoArrowBackCircleOutline } from "react-icons/io5"
import { AiOutlineDelete } from "react-icons/ai"
import { hostname } from "../../config/apiConfig";
import { Lote, Produto, produtoServices } from "../../services/produtoServices";
import { useParams } from "react-router-dom";
import VisualizarBtn from "../../components/VisualizarBtn";
import { BsFilter } from "react-icons/bs";

// Const para a criação de colunas; Define a Tipagem (Interface)
const columnHelper = createColumnHelper<Produto>();

function LocalProduto() {

  const [showFiltros, setShowFiltros] = useState<boolean>(false)
  const [custoMin, setCustoMin] = useState<number | null>(null)
  const [custoMax, setCustoMax] = useState<number | null>(null)
  const [vendaMin, setVendaMin] = useState<number | null>(null)
  const [vendaMax, setVendaMax] = useState<number | null>(null)
  const [quantidadeMin, setQuantidadeMin] = useState<number | null>(null)
  const [quantidadeMax, setQuantidadeMax] = useState<number | null>(null)
  // chave para limpar filtro e renderizar novo campo
  const [filtroKey, setFiltroKey] = useState(0)


  // Guarda o ID dos fornecedores selecionados na tabela
  const [produtoSelecionado, setProdutoSelecionado] = useState<number | null>(null);

	// Salvar informações do json
	const [lotesInfo, setLotesInfo] = useState<Lote[] | null>(null)

	//Estado para controlar o modal
	const [openModalVisualizar, setOpenModalVisualizar] = useState(false)

	// Mensagem de sucesso das ações
	const [mensagemSucesso, setMensagemSucesso] = useState<string>('');

  // Armazena as informações puxadas na tabela
  const [data, setData] = useState<Produto[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([])
  
  // Guarda o ID de local recebido na rota e converte para int
  const { id } = useParams();
  const idInt = id ? parseInt(id, 10) : null

  // Função para buscar todos os fornecedores 
  const fetchProdutosByLocal = async () => {
    const result = await produtoServices.getProdutosByLocal(idInt!)
    if (result instanceof ApiException) {
      console.log(result.message)
    } else {
      setData(result);
      setProdutos(result)
    }
  }

  // Chama a função para pegar todos os fornecedores do BD ao montar o componente
  useEffect(() => {
    fetchProdutosByLocal()
  }, [])

  useEffect(() => {
    const FiltrarAutomaticamente = () => {
      let produtosFiltrados = produtos
      if (quantidadeMin !== null) {
        produtosFiltrados = produtosFiltrados.filter((p) => p.Prod_quantidade >= quantidadeMin);
      }
      if (quantidadeMax !== null) {
        produtosFiltrados = produtosFiltrados.filter((p) => p.Prod_quantidade <= quantidadeMax);
      }
      if (custoMin !== null) {
        produtosFiltrados = produtosFiltrados.filter((p) => p.Prod_custo >= custoMin);
      }
      if (custoMax !== null) {
        produtosFiltrados = produtosFiltrados.filter((p) => p.Prod_custo <= custoMax);
      }
      if (vendaMin !== null) {
        produtosFiltrados = produtosFiltrados.filter((p) => p.Prod_preco >= vendaMin);
      }
      if (vendaMax !== null) {
        produtosFiltrados = produtosFiltrados.filter((p) => p.Prod_preco <= vendaMax);
      }

      setData(produtosFiltrados);
    }

    FiltrarAutomaticamente()
  },[
    quantidadeMin,
    quantidadeMax,
    vendaMin,
    vendaMax,
    custoMin,
    custoMax,
  ])

  // limpar os filtros
const handleLimparFiltros = () => {
  setData(produtos)
  setQuantidadeMin(null)
  setQuantidadeMax(null)
  setCustoMax(null)
  setCustoMin(null)
  setVendaMax(null)
  setVendaMin(null)
  setFiltroKey((prevKey) => prevKey + 1)
}

  const handleVisualizarClick = (Produto_id: number, Local_Id: number) => {
        setProdutoSelecionado(Produto_id)
        setOpenModalVisualizar(true) // Abre o modal de edição
        async function fetchLotes() { //
            const response = await produtoServices.getProdutoLotes(Produto_id, Local_Id)
            console.log('lotes',response) // VER AS INFORMAÇÕES RETORNADAS
            if (response instanceof ApiException) {
                alert(response.message)
            } else {
                setLotesInfo(response)
            }
        }
        fetchLotes()
    }


  // Define as colunas
  const columns: ColumnDef<Produto, any>[] = [
    columnHelper.accessor('Prod_nome', {
      header: () => 'Nome',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('Prod_quantidade', {
      header: () => 'Quantidade',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('Prod_preco', {
        header: () => 'Preço Venda',
        cell: info => `R$ ${Number(info.getValue()).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
    }),
    columnHelper.accessor('Prod_custo', {
        header: () => 'Preço Custo',
        cell: info => `R$ ${Number(info.getValue()).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
    }),
    columnHelper.display({
			id: 'actions',
			cell: props => (
					<VisualizarBtn
							id={props.row.original.Prod_cod}
							onView={() => handleVisualizarClick(props.row.original.Prod_cod, idInt!)}
					/>
			),
		}),
  ];

  // Configurações da tabela
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <main>
      <div className="page-title">
        <div className="produto-local-header">
          <h1 className="title">Produtos do Local</h1>
          <div className="btnFiltrar" 
          onClick={() => setShowFiltros(!showFiltros)}
          >
            <BsFilter size={24} style={{ color: '#61BDE0'}} />
            <span>Filtrar por</span>
          </div>
        </div>
        <hr className="line" />
      </div>

      {/* Implementação para o futuro, precisa adicionar tempo e + coisas {mensagemSucesso && <div className="success-message">{mensagemSucesso}</div>} */}

      {showFiltros && (
        <>
          <div className="produtos-local-filtros" key={filtroKey}>
          <div className="custo-container item">
            <label htmlFor="inCusto">Preço de custo:</label>
            <div>
              <input 
                type="number" 
                id="inCusto"
                value={custoMin ?? ""} 
                onChange={(e) => setCustoMin(e.target.value ? +e.target.value : null)}
                placeholder="Min"
              />
              <input 
                type="number" 
                id="inCusto" 
                value={custoMax ?? ""} 
                onChange={(e) => setCustoMax(e.target.value ? +e.target.value : null)}
                placeholder="Máx"
              />
            </div>
          </div>
          <div className="venda-container item">
            <label htmlFor="inVenda">Preço de venda:</label>
            <div>
              <input 
                type="number" 
                id="inVenda" 
                value={vendaMin ?? ""}
                onChange={(e) => setVendaMin(e.target.value ? +e.target.value : null)}
                placeholder="Min"
              />
              <input 
                type="number" 
                id="inVenda" 
                value={vendaMax ?? ""}
                onChange={(e) => setVendaMax(e.target.value ? +e.target.value : null)}
                placeholder="Máx"
              />
            </div>
          </div>
          <div className="quantidade-container item">
            <label htmlFor="inQuantidade">Quantidade:</label>
            <div>
              <input 
                type="number" 
                id="inQuantidade" 
                value={quantidadeMin ?? ""}
                onChange={(e) => setQuantidadeMin(e.target.value ? +e.target.value : null)}
                placeholder="Min"
              />
              <input 
                type="number" 
                id="inQuantidade" 
                value={quantidadeMax ?? ""}
                onChange={(e) => setQuantidadeMax(e.target.value ? +e.target.value : null)}
                placeholder="Máx"
              />
            </div>
          </div>
        </div>
        <div className="filtros-btn">
          <button className="rfloat btnLimpar" onClick={handleLimparFiltros}>LIMPAR</button>
        </div>
        </>
      )}

      <Table hover responsive size="lg">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr className="heading" key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr className="table-row" key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal de visualizar */}
			<Modal
				isOpen={openModalVisualizar} // Abre o modal
				label="Lotes" // Titulo do modal
				buttons={
						<>
								<BtnAzul icon={<IoArrowBackCircleOutline />} label='VOLTAR' onClick={() => setOpenModalVisualizar(false)} />
						</>
				}
		>
				{lotesInfo ? (
						<table>
              <thead>
                <tr>
                  <th className="th-lote">Código</th>
                  <th className="th-lote">Validade</th>
                  <th className="th-lote">Quantidade</th>
                </tr>
              </thead>
              <tbody className="table-lp">
              {lotesInfo.filter(lote => lote.Lote_quantidade > 0).map(lote => (
                  <tr key={lote.Lote_id} className="table-lp">
                    <td className="td-lote">{lote.Lote_cod}</td>
                    <td className="td-lote">{new Date(lote.Lote_validade).toLocaleDateString()}</td>
                    <td className="td-lote">{lote.Lote_quantidade}</td>
                  </tr>
                ))
              }
              </tbody>
            </table>
				) : (
						<p>Carregando informações dos lotes...</p>
				)}
		</Modal>
    </main>
  );
}

export default LocalProduto
