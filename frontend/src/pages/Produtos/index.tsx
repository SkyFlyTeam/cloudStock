import React, { useState, useEffect, useRef } from "react"

import { Table } from "react-bootstrap"
import { ColumnDef, createColumnHelper, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table'

import { produtoServices, Produto, Lote } from "../../services/produtoServices"
import { fornecedorServices } from "../../services/fornecedorServices"
import { ApiException } from "../../config/apiException"

import ImagemProduto from "../../components/ImagemProduto/index"
import ToggleBtn from "../../components/ToggleBtn/index"
import EditarRemoverBtn from "../../components/EditarRemoverBtn"

import BtnAzul from "../../components/BtnAzul";
import Modal from "../../components/Modal";
import BtnCancelar from "../../components/BtnCancelar";

import ProdutoFormulario from "../../components/Formularios/Produtos/Form_Cadastrar";
import ProdutoExcluir from "../../components/Formularios/Produtos/Form_Excluir";
import ProdutoEditar from "../../components/Formularios/Produtos/Form_Editar";
import SearchBar from "../../components/SearchBar/SearchBar"

import './style.css'
/* Icons */
import { IoAddCircleOutline, IoArrowBackCircleOutline } from "react-icons/io5"
import { AiOutlineDelete } from "react-icons/ai"
import { hostname } from "../../config/apiConfig"
import { Fornecedor } from "../../services/fornecedorServices"
import { BsFilter } from "react-icons/bs"
import VisualizarBtn from "../../components/VisualizarBtn";

import { useAuth } from "../../context/AuthProvider"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { LoadingDots } from "./LoadingDots"
import Pagination from "../../components/Pagination"
import { SvgSemDados } from "../../components/svgSemDados/svgSemDados"

// Criar o helper para colunas
const columnHelper = createColumnHelper<Produto>()

function Produtos() {

  // Use state para armazenar e alterar a página de exibição dos produtos
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 10; // Number of items per page

  const navigate = useNavigate();

  // Registro geral
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([])
  const [produtos, setProdutos] = useState<Produto[]>([])
  // useSatate para armazenar os estados dos filtros que queremos
  const [data, setData] = useState<Produto[]>([]) // Use state para armazenar uma array de Produto (filtrado ou não) (interface) que será exibido na tabela
  const [status, setStatus] = useState<boolean | null>(null) // useStates do filtro ativo ou inativo
  const [fornecedorFiltrado, setFornecedorFiltrado] = useState<Fornecedor | null>() // useState para guardar fornecedor selecionado
  const [quantidadeMax, setQuantidadeMax] = useState<number | null>(null)
  const [quantidadeMin, setQuantidadeMin] = useState<number | null>(null)
  const [vendaMax, setVendaMax] = useState<number | null>(null)
  const [vendaMin, setVendaMin] = useState<number | null>(null)
  const [custoMax, setCustoMax] = useState<number | null>(null)
  const [custoMin, setCustoMin] = useState<number | null>(null)
  const [dataMax, setDataMax] = useState<string | null>(null)
  const [dataMin, setDataMin] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState<string | null>(null)
  // renderizar o componente de filtro
  const [filtroKey, setFiltroKey] = useState(0)
  // useState para controlar os modais

  // Estado para armazenar os produtos filtrados

  const [filteredData, setFilteredData] = useState<Produto[]>([]);
  // Estado para controlar os modais
  const [openModalCadastro, setOpenModalCadastro] = useState(false);
  //Estado para controlar o modal
	const [openModalVisualizar, setOpenModalVisualizar] = useState(false)
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  // Mensagem de sucesso das ações
  const [mensagemSucesso, setMensagemSucesso] = useState<string>('');

  //Verificação dos Cargos
  const {currentUser} = useAuth();


  // State para mostrar campo de status
  const [showFiltros, setShowFiltros] = useState(false)

  // Referência ao forms para realizar o submit fora do componente do forms
  const formRef = useRef<{ submitForm: () => void }>(null);
  // Guarda o ID dos fornecedores selecionados na tabela
  const [produtoSelecionado, setProdutoSelecionado] = useState<number | null>(null);
  const [lotesInfo, setLotesInfo] = useState<Lote[] | null>(null)
  // Guarda o ID de local recebido na rota e converte para int
  const { id } = useParams();
  const idInt = id ? parseInt(id, 10) : null


  // Função para buscar todos os produtos
  const fetchProdutos = async () => {
    const result = await produtoServices.getAllProdutos()
    if (result instanceof ApiException) {
      console.log(result.message)
    } else {
      setData(result);
      setProdutos(result)
    }
    console.log(result)
  }

  const fetchFornecedores = async () => {
    const result = await fornecedorServices.getAllFornecedores()
    if(result instanceof ApiException){
      console.log(result.message)
    } else {
      setFornecedores(result)
    }
  }

  // Chama a função para pegar todos os produtos do BD ao montar o componente
  useEffect(() => {
    fetchProdutos()
    fetchFornecedores()
  }, [])

  const handleVisualizarClick = (Produto_id: number) => {
    setProdutoSelecionado(Produto_id)
    setOpenModalVisualizar(true) // Abre o modal de edição
    async function fetchLotes() { //
        const response = await produtoServices.getProdutoLotesProduto(Produto_id)
        console.log('lotes',response) // VER AS INFORMAÇÕES RETORNADAS
        if (response instanceof ApiException) {
            alert(response.message)
        } else {
            setLotesInfo(response)
        }
    }
    fetchLotes()
}

  // FILTROS 
  // Mostrar campo de filtro
  const handleShowFiltros  = () => {
    setShowFiltros((prev) => prev ? false : true)
  }

  const handleAtivos = () =>  setStatus(true) 
  const handleInativos = () => setStatus(false)
  const handleFornecedorChange = (id: number) => {
    const fornecedorSelected = fornecedores.find((f) => f.Forn_id === id)
    setFornecedorFiltrado(fornecedorSelected)
  }

useEffect(() => {
  // Função para aplicar os filtros automaticamente
  const filtrarAutomaticamente = () => {
    let produtosFiltrados = produtos;

    if (status !== null) {
      produtosFiltrados = produtosFiltrados.filter((p) => p.Prod_status === status);
    }
    if (searchQuery !== null) {
      produtosFiltrados = produtosFiltrados.filter((p) => p.Prod_nome.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (fornecedorFiltrado?.Forn_id !== undefined) {
      produtosFiltrados = produtosFiltrados.filter((p) =>
        p.Lotes?.some((l) => l.Forn_id === fornecedorFiltrado.Forn_id)
      );
    }
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
    if (dataMin !== null) {
      produtosFiltrados = produtosFiltrados.filter((p) =>
        p.Prod_quantidade > 0 && p.Lotes?.some((l) => new Date(l.Lote_validade) >= new Date(dataMin))
      );
    }
    if (dataMax !== null) {
      produtosFiltrados = produtosFiltrados.filter((p) =>
        p.Prod_quantidade > 0 && p.Lotes?.some((l) => new Date(l.Lote_validade) <= new Date(dataMax))
      );
    }

    setData(produtosFiltrados);
  };

  filtrarAutomaticamente();
}, [
  status,
  searchQuery,
  fornecedorFiltrado,
  quantidadeMin,
  quantidadeMax,
  vendaMin,
  vendaMax,
  custoMin,
  custoMax,
  dataMin,
  dataMax,
  produtos
]);

// limpar os filtros
const handleLimparFiltros = () => {
  setData(produtos)
  setFornecedorFiltrado(null)
  setStatus(null)
  setQuantidadeMin(null)
  setQuantidadeMax(null)
  setCustoMax(null)
  setCustoMin(null)
  setVendaMax(null)
  setVendaMin(null)
  setDataMin(null)
  setDataMax(null)
  setFiltroKey((prevKey) => prevKey + 1)
}

  // Função para atualizar o status do produto usando o toggle button !aqui é apenas para atualizar localmente (o useState) !
  const handleStatusChange = (prod_cod: number, newStatus: boolean) => {
    setData(prevData =>
      prevData.map(produto =>
        produto.Prod_cod === prod_cod ? { ...produto, prod_status: newStatus } : produto
      )
    )
  }


  // Colunas da tabela
  const columns: ColumnDef<Produto, any>[] = [
    columnHelper.display({
      id: 'table-img',
      cell: props => <ImagemProduto prod_cod={props.row.original.Prod_cod} />,
    }),
    columnHelper.accessor('Prod_nome', {
      header: () => 'Nome',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('Categoria.Categoria_nome', {
      header: () => <div className="th-center">Categoria</div>,
      cell: info => <div className="td-center"> {info.getValue() === null || info.getValue() === undefined ? `${info.getValue()}` : info.getValue()} </div>,
    }),
    columnHelper.accessor('Prod_quantidade', {
      header: () => <div className="th-right">Quantidade</div>,
      cell: info => <div className="td-right"> {info.getValue()} </div>,
    }),
    columnHelper.accessor('Prod_preco', {
      header: () => <div className="th-right">Preço Venda</div>,
      cell: info => {
        const valor = info.getValue();
        const valorFormatado = Number(valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
        return <div className="td-right"> R$ {valorFormatado} </div>;
      },
    }),
    columnHelper.accessor('Prod_custo', {
        header: () => <div className="th-right">Preço Custo</div>,
        cell: info => {
          const valor = info.getValue();
          const valorFormatado = Number(valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
          return <div className="td-right"> R$ {valorFormatado} </div>;
        },
    }),
    // columnHelper.accessor('Lotes', {
    //   header: () => 'Lote ID',
    //   cell: info => info.getValue()?.[0]?.Lote_cod || 'N/A',
    // }),
    
    columnHelper.accessor('Prod_status', {
      header: () => <div className="th-center"> Status</div>,
      cell: info => (
        <div className="td-center">
          <ToggleBtn
            checked={info.getValue() == 1}
            cod={info.row.original.Prod_cod}
            rota={`${hostname}produto`}
            onStatusChange={(newStatus: any) => handleStatusChange(info.row.original.Prod_cod, newStatus)}
          />
        </div>
      ),
      
    }),
    columnHelper.display({
      id: 'actions',
      cell: props => (
        <EditarRemoverBtn
          id={props.row.original.Prod_cod}
          onEdit={() => handleEditClick(props.row.original.Prod_cod)}
          // onDelete={() => handleDeleteClick(props.row.original.Prod_cod)}
        />
      ),
    }),
    columnHelper.display({
			id: 'actions1',
			cell: props => (
					<VisualizarBtn
							id={props.row.original.Prod_cod}
							onView={() => handleVisualizarClick(props.row.original.Prod_cod)}
					/>
			),
		}),
  ]


  // Cria a tabela, aqui é onde serão passados todos os possíveis parâmetros
  const table = useReactTable({
    data: data, //utiliza o filteredData
    columns,
    state: { pagination: { pageIndex, pageSize } }, // Set pagination in the state
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(), // Add this to enable pagination
    onPaginationChange: (updater) => {
      const newPagination = typeof updater === "function" ? updater({ pageIndex, pageSize }) : updater;
      setPageIndex(newPagination.pageIndex);
  },
})

// Calculate the total number of pages
const pageCount = Math.ceil(data.length / pageSize);


  // FUNÇÕES PARA EVENTO DE MODALS
  // Edição
  const handleEditClick = (id: number) => {
    setProdutoSelecionado(id)
    setOpenEditModal(true) // Abre o modal de edição
  }

  const closeEditModal = () => {
    setProdutoSelecionado(null)
    setOpenEditModal(false)
  }
  // Excluir
  // const handleDeleteClick = (id: number) => {
  //   setProdutoSelecionado(id)
  //   setOpenDeleteModal(true)
  // }

  const closeDeleteModal = () => {
    setProdutoSelecionado(null)
    setOpenDeleteModal(false)
  }

  return (
    <main>
      <div className="page-title">
        <h1 className="title">Produtos</h1>
        <hr className="line" />
      </div>

      <div className="actions-group">
        <SearchBar onSearch={setSearchQuery} />
        <div className="action-end">
          <div className="btnFiltrar" onClick={handleShowFiltros}>
            <BsFilter size={24} style={{ color: '#61BDE0'}} />
            <span>Filtrar por</span>
          </div>
          {currentUser?.Cargo_id === 1 && (
            <BtnAzul className="rfloat" icon={<IoAddCircleOutline />} label="CADASTRAR" onClick={() => setOpenModalCadastro(true)} />
          )}
        </div>
      </div>

      {showFiltros && (
        <>
          <div className="container-filtros" key={filtroKey}>
            <div className="registro-primeira-coluna">
              <div className="status-filtro">
                <label htmlFor="inStatus">Status</label>
                <div>
                  <label htmlFor="inAtivo">Ativo</label>
                  <input type="radio" name="inStatus" id="inAtivo" value="ativo" onClick={handleAtivos} />
                </div>
                <div>
                  <label htmlFor="inInativo">Inativo</label>
                  <input type="radio" name="inStatus" id="inInativo" value="inativo" onClick={handleInativos} />
                </div>
              </div>
              <div className="fornecedor-container">
                <label htmlFor="inFornecedor">Fornecedor</label>
                <select 
                  id="inFornecedor"
                  className="form-select-custom"
                  onChange={(e) => handleFornecedorChange(+e.target.value)}
                >
                  <option selected>Buscar...</option>
                  {fornecedores.map((f) => (
                    <option key={f.Forn_id} value={f.Forn_id}>
                      {f.Forn_razaoSocial}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="registro-segunda-coluna">
              <div className="preco-container">
                <div className="custo-container">
                    <label htmlFor="inCusto">Preço de custo:</label>
                    <div>
                      <input 
                        type="number" 
                        id="inCusto" 
                        onChange={(e) => setCustoMin(e.target.value ? +e.target.value : null)}
                        placeholder="Min"
                      />
                      <input 
                        type="number" 
                        id="inCusto" 
                        onChange={(e) => setCustoMax(e.target.value ? +e.target.value : null)}
                        placeholder="Máx"
                      />
                    </div>
                  </div>
                <div className="venda-container">
                  <label htmlFor="inVenda">Preço de venda:</label>
                  <div>
                    <input 
                      type="number" 
                      id="inVenda" 
                      onChange={(e) => setVendaMin(e.target.value ? +e.target.value : null)}
                      placeholder="Min"
                    />
                    <input 
                      type="number" 
                      id="inVenda" 
                      onChange={(e) => setVendaMax(e.target.value ? +e.target.value : null)}
                      placeholder="Máx"
                    />
                  </div>
                </div>
              </div>

              <div className="quantidade-validade-container">
                <div className="quantidade-container">
                  <label htmlFor="inQuantidade">Quantidade:</label>
                  <div>
                    <input 
                      type="number" 
                      id="inQuantidade" 
                      onChange={(e) => setQuantidadeMin(e.target.value ? +e.target.value : null)}
                      placeholder="Min"
                    />
                    <input 
                      type="number" 
                      id="inQuantidade" 
                      onChange={(e) => setQuantidadeMax(e.target.value ? +e.target.value : null)}
                      placeholder="Máx"
                    />
                  </div>
                </div>
                <div className="validade-container">
                  <label htmlFor="inValidade">Validade:</label>
                  <div>
                    <input 
                      type="date" 
                      id="inValidade" 
                      onChange={(e) => setDataMin(e.target.value ? e.target.value : null)}
                      placeholder="Min"
                    />
                    <input 
                      type="date" 
                      id="inValidade" 
                      onChange={(e) => setDataMax(e.target.value ? e.target.value : null)}
                      placeholder="Máx"
                    />
                  </div>
                </div>
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
          {table.getHeaderGroups().map(headerGroup => ( // Mapeia o cabeçalho (th) de cada coluna
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id}>
                  {typeof header.column.columnDef.header === 'function'
                    ? header.column.columnDef.header(header.getContext())
                    : header.column.columnDef.header}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => ( // Mapeia as linhas e células de cada coluna
            <React.Fragment key={row.id}>
              <tr className="table-row table-rounded">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="table-rounded"> 
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
              <tr className="vazia"></tr>
            </React.Fragment>
          ))}
        </tbody>
      </Table>

      <SvgSemDados data={data}/>

      <Pagination className={""} thisPage={pageIndex} lastPage={pageCount} func={setPageIndex} />


      {/* MODALS*/}
      {/* Modal de Cadastro */}
      <Modal
        isOpen={openModalCadastro} // Abre o modal
        label="Cadastrar Produto" // Titulo do modal
        buttons={
          <>
            <BtnCancelar onClick={() => setOpenModalCadastro(false)} /> {/*Fechar o modal */}
            <BtnAzul
              icon={<IoAddCircleOutline />}
              label="CADASTRAR"
              onClick={() => formRef.current?.submitForm()} /* Passa a função da referencia do formulario para poder enviar o submit */
            />
          </>
        }
      >
        <ProdutoFormulario
          ref={formRef} /* Passa a referencia do formulario */
          onSuccess={message => {
            setMensagemSucesso(message)
            setOpenModalCadastro(false)
            fetchProdutos() // Atualiza a tabela
          }}
        />
      </Modal>
      {/* Modal de Edição */}
      {produtoSelecionado && (
        <Modal
          isOpen={openEditModal}
          label="Editar Produto"
          buttons={
            <>
              <BtnCancelar onClick={closeEditModal} />
              <BtnAzul icon={<IoAddCircleOutline />} label="SALVAR" onClick={() => formRef.current?.submitForm()} />
            </>
          }
          className="modal-prod"
        >
          <ProdutoEditar
            ref={formRef}
            id={produtoSelecionado}
            onSuccess={message => {
              setMensagemSucesso(message);
              closeEditModal();
              fetchProdutos(); // Atualiza a tabela após edição
              window.location.reload();
            }}
          />
        </Modal>
      )}
      {/* Modal de Exclusão */}
      {produtoSelecionado && (
        <Modal
          isOpen={openDeleteModal}
          label="Excluir Produto"
          buttons={
            <>
              <BtnCancelar onClick={closeDeleteModal} />
              <BtnAzul icon={<AiOutlineDelete />} label="Deletar" onClick={() => formRef.current?.submitForm()} />
            </>
          }
        >
          <ProdutoExcluir
            ref={formRef}
            id={produtoSelecionado}
            onSuccess={message => {
              setMensagemSucesso(message)
              closeDeleteModal()
              fetchProdutos()
            }}
          />
        </Modal>

        
      )}

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
          lotesInfo.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th className="th-lote">Código</th>
                  <th className="th-lote">Validade</th>
                  <th className="th-lote th-center">Quantidade</th>
                </tr>
              </thead>
              <tbody className="table-lp">
                {lotesInfo.filter(lote => lote.Lote_quantidade > 0).map(lote => (
                  <tr key={lote.Lote_cod} className="table-lp">
                    <td className="td-lote">{lote.Lote_cod}</td>
                    <td className="td-lote">{lote.Lote_validade == null ? "-" : new Date(lote.Lote_validade).toLocaleDateString()}</td>
                    <td className="td-lote td-center">{lote.Lote_quantidade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Não há lotes para este produto.</p>
          )
        ) : (
          <p>Carregando informações dos lotes...</p>
        )}
		</Modal>

    </main>
  )
}

export default Produtos


