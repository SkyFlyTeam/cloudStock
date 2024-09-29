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

import './style.css'
/* Icons */
import { IoAddCircleOutline } from "react-icons/io5"
import { AiOutlineDelete } from "react-icons/ai"

// Criar o helper para colunas
const columnHelper = createColumnHelper<Produto>()

function Produtos() {
  // Use state para armazenar uma array de Produto (interface) que será exibido na tabela
  const [data, setData] = useState<Produto[]>([])

  // Estado para controlar os modais
  const [openModalCadastro, setOpenModalCadastro] = useState(false);

  // Mensagem de sucesso das ações
  const [mensagemSucesso, setMensagemSucesso] = useState<string>('');

  // Referência ao forms para realizar o submit fora do componente do forms
  const formRef = useRef<{ submitForm: () => void }>(null);


  // Função para buscar todos os produtos
  const fetchProdutos = async () => {
    const result = await produtoServices.getAllProdutos()
    if (result instanceof ApiException) {
      console.log(result.message)
    } else {
      setData(result);
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
    columnHelper.accessor('Categoria', {
      header: () => 'Categoria',
      cell: info => `${info.getValue()}`,
    }),
    columnHelper.accessor('Prod_quantidade', {
      header: () => 'Quantidade',
      cell: info => `${info.getValue()}`,
    }),/* Comentado pois no momento não temos essa informação
        columnHelper.accessor('Prod_quantidade', {
            header: () => 'Quantidade',
            cell: info => '0', 
        }), */
    columnHelper.accessor('Prod_validade', {
      header: () => 'Validade',
      cell: info => `${info.getValue()}`,
    }),
    columnHelper.accessor('Prod_preco', {
      header: () => 'Preço',
      cell: info => `${info.getValue()}`,
    }),
    columnHelper.accessor('Prod_status', {
      header: () => <div className="th-center"> Status</div>,
      cell: info => (
        <div className="td-center">
          <ToggleBtn
            checked={info.getValue() == 1}
            cod={info.row.original.Prod_cod}
            onStatusChange={(newStatus: any) => handleStatusChange(info.row.original.Prod_cod, newStatus)}
          />
        </div>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      cell: props => <EditarRemoverBtn />
    }),
  ]

  // Cria a tabela, aqui é onde serão passados todos os possíveis parâmetros
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <main>
      <div className="page-title">
        <h1 className="title">Produtos</h1>
        <hr className="line" />
      </div>

      <div className="actions-group">
        <BtnAzul className="rfloat" icon={<IoAddCircleOutline />} label="CADASTRAR" onClick={() => setOpenModalCadastro(true)} />
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
              <tr className="table-row">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
              <tr className="vazia"></tr>
            </React.Fragment>
          ))}
        </tbody>
      </Table>


      {/* MODALS*/}
      {/* Modal de Cadastro */}
      <Modal
        isOpen={openModalCadastro} // Abre o modal
        label="Cadastrar Produto" // Titulo do modal
        setModalOpen={() => setOpenModalCadastro(false)} // Função para fechar dentro do modal
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


    </main>
  )
}

export default Produtos