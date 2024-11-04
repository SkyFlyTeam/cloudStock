import React, { useState, useEffect, useRef } from "react"

import { Table } from "react-bootstrap"
import { ColumnDef, createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'

import { produtoServices, Produto } from "../../services/produtoServices"
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
import SearchBar from "./SearchBar"

import './style.css'
/* Icons */
import { IoAddCircleOutline } from "react-icons/io5"
import { AiOutlineDelete } from "react-icons/ai"
import { hostname } from "../../config/apiConfig"

import { useAuth } from "../../context/AuthProvider"
import { useNavigate, useParams } from "react-router-dom"
import { LoadingDots } from "./LoadingDots"

// Criar o helper para colunas
const columnHelper = createColumnHelper<Produto>()

function Produtos() {
  // Use state para armazenar e alterar a página de exibição dos produtos
  let pags = 1
  let {pag} = useParams();
  if (pag === undefined){ pags = 1 }
  else { pags = Number(pag) }

  console.log(pags);

  const navigate = useNavigate();

  // Use state para armazenar uma array de Produto (interface) que será exibido na tabela
  const [data, setData] = useState<Produto[]>([])

  // Estado para armazenar os produtos filtrados

  const [filteredData, setFilteredData] = useState<Produto[]>([]);
  // Estado para controlar os modais
  const [openModalCadastro, setOpenModalCadastro] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  // Mensagem de sucesso das ações
  const [mensagemSucesso, setMensagemSucesso] = useState<string>('');

  //Verificação dos Cargos
  const {currentUser} = useAuth();

  // Referência ao forms para realizar o submit fora do componente do forms
  const formRef = useRef<{ submitForm: () => void }>(null);

  // Guarda o ID dos fornecedores selecionados na tabela
  const [produtoSelecionado, setProdutoSelecionado] = useState<number | null>(null);

  // Função para buscar todos os produtos
  const fetchProdutos = async () => {
    const result = await produtoServices.getAllProdutos()
    if (result instanceof ApiException) {
      console.log(result.message)
    } else {
      console.log('ssss')
      setData(result);
      setFilteredData(result.slice(pags * 10 - 10, pags * 10)); //Inicializa o filteredData com todos os produtos
    }
  }

  // Função para filtrar produtos pelo nome
  const handleSearch = (query: string) => {
    const filtered = data.filter((produto) =>
      produto.Prod_nome.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredData(filtered.slice(pags * 10 - 10, pags * 10));
  };

  const handleChangePage = (newPag: number) => { 
    if (newPag < 1){
      navigate(`/Produtos/${1}`); window.location.reload(); 
    }
    else if (newPag > data.length / 10 + 1){
      navigate(`/Produtos/${parseInt(`${data.length / 10 + 1}`)}`); window.location.reload(); 
    }
    else{
    navigate(`/Produtos/${newPag}`); window.location.reload();
     } 
    }

  // Chama a função para pegar todos os produtos do BD ao montar o componente
  useEffect(() => {
    fetchProdutos()
  }, [])


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
    /*columnHelper.accessor('Categoria_id', {
      header: () => 'Categoria',
      cell: info => `${info.getValue()}`,
    }),*/
    columnHelper.accessor('Prod_quantidade', {
      header: () => 'Quantidade',
      cell: info => `${info.getValue()}`,
    }),
    columnHelper.accessor('Prod_preco', {
      header: () => 'Preço Venda',
      cell: info => {
        const valor = info.getValue();
        const valorFormatado = Number(valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
        return `R$ ${valorFormatado}`;
      },
    }),
    columnHelper.accessor('Prod_custo', {
        header: () => 'Preco Custo',
        cell: info => {
          const valor = info.getValue();
          const valorFormatado = Number(valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
          return `R$ ${valorFormatado}`;
        },
    }),
    columnHelper.accessor('Prod_status', {
      header: () => <div className="th-center"> Status</div>,
      cell: info => (
        <div className="td-center">
        <ToggleBtn
          checked={info.getValue() == 1}
          cod={info.row.original.Prod_cod}
          rota={`${hostname}produto`}
          onStatusChange={(newStatus) => handleStatusChange(info.row.original.Prod_cod, newStatus)}
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
  ]


  // Cria a tabela, aqui é onde serão passados todos os possíveis parâmetros
  const table = useReactTable({
    data: filteredData, //utiliza o filteredData
    columns,
    getCoreRowModel: getCoreRowModel(),
  })


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
        <div className="search-bar-container">
          <SearchBar onSearch={handleSearch} />
        </div>
    
        <div className="cadastro">
          {currentUser?.Cargo_id === 1 && (
            <BtnAzul className="rfloat" icon={<IoAddCircleOutline />} label="CADASTRAR" onClick={() => setOpenModalCadastro(true)} />
          )}
        </div>
      </div>

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

      <LoadingDots data={data} />

      <button onClick={() => handleChangePage(pags + 1)}>next</button>
      <button onClick={() => handleChangePage(pags - 1)}>prev</button>


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

    </main>
  )
}

export default Produtos