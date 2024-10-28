import React, { useState, useEffect, useRef } from "react";
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
import { IoAddCircleOutline } from "react-icons/io5"
import { AiOutlineDelete } from "react-icons/ai"
import { hostname } from "../../config/apiConfig";


import { useAuth } from "../../context/AuthProvider";


// Const para a criação de colunas; Define a Tipagem (Interface)
const columnHelper = createColumnHelper<Fornecedor>();

function Fornecedores() {
  // Estado para controlar os modais
  const [openModalCadastro, setOpenModalCadastro] = useState(false);
  const [openModalEdicao, setOpenModalEdicao] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);


  //Verificação dos Cargos
  const {currentUser} = useAuth();

  // Guarda o ID dos fornecedores selecionados na tabela
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState<number | null>(null);

  // Mensagem de sucesso das ações
  const [mensagemSucesso, setMensagemSucesso] = useState<string>('');

  // Referência ao forms para realizar o submit fora do componente do forms
  const formRef = useRef<{ submitForm: () => void }>(null);

  // Armazena as informações puxadas na tabela
  const [data, setData] = useState<Fornecedor[]>([]);

  // Função para buscar todos os fornecedores 
  const fetchFornecedores = async () => {
    const result = await fornecedorServices.getAllFornecedores()
    if (result instanceof ApiException) {
      console.log(result.message)
    } else {
      setData(result);
    }
  }

  // Chama a função para pegar todos os fornecedores do BD ao montar o componente
  useEffect(() => {
    fetchFornecedores()
  }, [])


  // Altera o Status do componente 
  const handleStatusChange = (forn_id: number, newStatus: boolean) => {
    setData(prevData =>
      prevData.map(produto =>
        produto.Forn_id === forn_id ? { ...produto, prod_status: newStatus } : produto
      )
    )
  }

  // Define as colunas
  const columns: ColumnDef<Fornecedor, any>[] = [
    columnHelper.accessor('Forn_nome', {
      header: () => 'Nome',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('Forn_cnpj', {
      header: () => 'CNPJ',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('Forn_status', {
      header: () => 'Status',
      cell: info => (
        <div className="td-center">
      {currentUser?.Cargo_id === 2 ? (
          <ToggleBtn
            checked={info.getValue() == 1}
            cod={info.row.original.Forn_id}
            rota={`${hostname}fornecedor`}
            onStatusChange={(newStatus: any) => handleStatusChange(info.row.original.Forn_id, newStatus)}
          />
      ) : (
        <span className= {info.getValue() == 1 ? 'status-ativo1' : 'status-inativo1'}>
          {info.getValue() == 1 ? 'Ativo' : 'Inativo'}
        </span>
      )}
      </div>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      cell: props => (
        currentUser?.Cargo_id === 2 && (
        <EditarRemoverBtn
          id={props.row.original.Forn_id}
          onEdit={() => handleEditClick(props.row.original.Forn_id)}
          onDelete={() => handleDeleteClick(props.row.original.Forn_id)}
        />
        )
      ),
    }),
  ];

  // Configurações da tabela
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // FUNÇÕES PARA EVENTO DE MODALS
  // Edição
  const handleEditClick = (id: number) => {
    setFornecedorSelecionado(id)
    setOpenModalEdicao(true) // Abre o modal de edição
  }

  const closeEditModal = () => {
    setFornecedorSelecionado(null)
    setOpenModalEdicao(false)
  }

  // Excluir
  const handleDeleteClick = (id: number) => {
    setFornecedorSelecionado(id)
    setOpenDeleteModal(true)
  }

  const closeDeleteModal = () => {
    setFornecedorSelecionado(null)
    setOpenDeleteModal(false)
  }

  return (
    <main>
      <div className="page-title">
        <h1 className="title">Fornecedores</h1>
        <hr className="line" />
      </div>

    {currentUser?.Cargo_id === 2 && (
      <div className="actions-group">
        <BtnAzul icon={<IoAddCircleOutline />} label="CADASTRAR" onClick={() => setOpenModalCadastro(true)} />
      </div>
    )}
      {/* Implementação para o futuro, precisa adicionar tempo e + coisas {mensagemSucesso && <div className="success-message">{mensagemSucesso}</div>} */}

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

      {/* MODALS*/}
      {/* Modal de Cadastro */}
      <Modal
        isOpen={openModalCadastro} // Abre o modal
        label="Cadastrar Fornecedor" // Titulo do modal
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
        <FornecedorFormulario
          ref={formRef} /* Passa a referencia do formulario */
          onSuccess={message => {
            setMensagemSucesso(message) 
            setOpenModalCadastro(false)
            fetchFornecedores() // Atualiza a tabela
          }}
        />
      </Modal>

      {/* Modal de Edição */}
      {fornecedorSelecionado && (
        <Modal
          isOpen={openModalEdicao}
          label="Editar Fornecedor"
          buttons={
            <>
              <BtnCancelar onClick={closeEditModal} />
              <BtnAzul icon={<IoAddCircleOutline />} label="SALVAR" onClick={() => formRef.current?.submitForm()} />
            </>
          }
        >
          <Forn_Edicao
            ref={formRef}
            id={fornecedorSelecionado}
            onSuccess={message => {
              setMensagemSucesso(message);
              closeEditModal();
              fetchFornecedores(); // Atualiza a tabela após edição
            }}
          />
        </Modal>
      )}

      {/* Modal de Exclusão */}
      {fornecedorSelecionado && (
        <Modal
          isOpen={openDeleteModal}
          label="Excluir Fornecedor"
          buttons={
            <>
              <BtnCancelar onClick={closeDeleteModal} />
              <BtnAzul icon={<AiOutlineDelete />} label="Deletar" onClick={() => formRef.current?.submitForm()} />
            </>
          }
        >
          <Forn_Excluir
            ref={formRef}
            id={fornecedorSelecionado}
            onSuccess={message => {
              setMensagemSucesso(message)
              closeDeleteModal()
              fetchFornecedores()
            }}
          />
        </Modal>
      )}
    </main>
  );
}

export default Fornecedores
