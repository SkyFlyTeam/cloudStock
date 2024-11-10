import React, { useState, useEffect, useRef } from "react";
import { Fornecedor, fornecedorServices } from "../../services/fornecedorServices";
import { ApiException } from "../../config/apiException";

import './style.css';

/* Tabela */
import { Table } from "react-bootstrap";
import { ColumnDef, createColumnHelper, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';

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

import { Usuario, usuarioServices } from "../../services/usuariosServices";
import ToggleBtnCargo from "../../components/ToggleBtnCargo";
import UsuarioFormulario from "../../components/Formularios/Usuario/User_Cadastrar.tsx";
import Usuario_Edicao from "../../components/Formularios/Usuario/User_Editar";
import SearchBar from "../../components/SearchBar/SearchBar";
import Pagination from "../../components/Pagination";


// Const para a criação de colunas; Define a Tipagem (Interface)
const columnHelper = createColumnHelper<Usuario>();

function Usuarios() {
  // Estado para controlar os modais
  const [openModalCadastro, setOpenModalCadastro] = useState(false);
  const [openModalEdicao, setOpenModalEdicao] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  //Verificação dos Cargos
  const {currentUser} = useAuth();

  // Guarda o ID dos usuarios selecionados na tabela
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<number | null>(null);

  // Mensagem de sucesso das ações
  const [mensagemSucesso, setMensagemSucesso] = useState<string>('');

  // Referência ao forms para realizar o submit fora do componente do forms
  const formRef = useRef<{ submitForm: () => void }>(null);

  // Armazena as informações puxadas na tabela
  const [data, setData] = useState<Usuario[]>([]);

  // Estado para armazenar os usuarios filtrados
  const [filteredData, setFilteredData] = useState<Usuario[]>([]);

  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 10; // Number of items per page

  // Função para buscar todos os usuarios 
  const fetchUsuarios = async () => {
    const result = await usuarioServices.getAllUsuarios()
    if (result instanceof ApiException) {
      console.log(result.message)
    } else {
      setData(result);
      setFilteredData(result)
    }
  }

  //Função para filtrar fornecedores pelo nome
  const handleSearch = (query: string) => {
    const filtered = data.filter((Usuario) =>
      Usuario.Usuario_nome.toLowerCase().includes(query.toLowerCase())
  );
  setFilteredData(filtered);
  };


  // Chama a função para pegar todos os fornecedores do BD ao montar o componente
  useEffect(() => {
    fetchUsuarios()
  }, [])


  // Altera o Status do componente 
  const handleStatusChange = (usuario_id: number, newStatus: boolean) => {
    setData(prevData =>
      prevData.map(usuario =>
        usuario.Usuario_id === usuario_id ? { ...usuario, Usuario_status: newStatus } : usuario
      )
    )
  };

  // Altera o Status do componente 
  const handleCargoChange = async (usuario_id: number) => {
    const result = await usuarioServices.updateUsuarioCargo(usuario_id)
  };

  // Define as colunas
  const columns: ColumnDef<Usuario, any>[] = [
    columnHelper.accessor('Usuario_nome', {
      header: () => 'Nome',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('Cargo_id', {
      header: () => 'Tipo',
      cell: info => {
          return (
              <div>
                {info.getValue() === 1 ? 'Funcionário':(
                  info.getValue() === 2 ? 'Gerente' : (
                    info.getValue() ===3 ? 'Administrador' : 'Cargo não conhecido'
                  )
                )}
              </div>
          );
      },
    }),
    columnHelper.accessor('Usuario_status', {
      header: () => 'Status',
      cell: info => (
        <div className="td-center">
          <ToggleBtn
            checked={info.getValue() == 1}
            cod={info.row.original.Usuario_id}
            rota={`${hostname}usuario`}
            onStatusChange={(newStatus: any) => handleStatusChange(info.row.original.Usuario_id, newStatus)}
          />
      </div>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      cell: props => (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <EditarRemoverBtn
          id={props.row.original.Usuario_id
          }
          onEdit={() => handleEditClick(props.row.original.Usuario_id)}
          onDelete={() => handleDeleteClick(props.row.original.Usuario_id)}
        />
        </div>
        
      ),
    }),
  ];

  // Configurações da tabela
  const table = useReactTable({
    data: filteredData, //utilizando filteredData
    columns,
    state: { pagination: { pageIndex, pageSize } }, // Set pagination in the state
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(), // Add this to enable pagination
    onPaginationChange: (updater) => {
      const newPagination = typeof updater === "function" ? updater({ pageIndex, pageSize }) : updater;
      setPageIndex(newPagination.pageIndex);
  },
  });

      // Calculate the total number of pages
      const pageCount = Math.ceil(data.length / pageSize);

  // FUNÇÕES PARA EVENTO DE MODALS
  // Edição
  const handleEditClick = (id: number) => {
    setUsuarioSelecionado(id)
    setOpenModalEdicao(true) // Abre o modal de edição
  }

  const closeEditModal = () => {
    setUsuarioSelecionado(null)
    setOpenModalEdicao(false)
  }

  // Excluir
  const handleDeleteClick = (id: number) => {
    setUsuarioSelecionado(id)
    setOpenDeleteModal(true)
  }

  const closeDeleteModal = () => {
    setUsuarioSelecionado(null)
    setOpenDeleteModal(false)
  }

  return (
    <main>
      <div className="page-title">
        <h1 className="title">Usuários</h1>
        <hr className="line" />
      </div>

      <div className="actions-group">
        <div className="search-bar-container">
          <SearchBar onSearch={handleSearch} />
        </div>
        
        <div className="cadastro">
          {currentUser?.Cargo_id === 3 && (
            <BtnAzul icon={<IoAddCircleOutline />} label="CADASTRAR" onClick={() => setOpenModalCadastro(true)} />
          )}
      </div>
    </div>
      {/* Implementação para o futuro, precisa adicionar tempo e + coisas {mensagemSucesso && <div className="success-message">{mensagemSucesso}</div>} */}

      <Table hover responsive size="lg">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr className="heading" key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} colSpan={header.colSpan} className={header.id === 'Usuario_status' ? 'th-align-center' : (
                  ''
                )}>
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

      <Pagination className={""} thisPage={pageIndex} lastPage={pageCount} func={setPageIndex} />

      {/* MODALS*/}
      {/* Modal de Cadastro */}
      <Modal
        isOpen={openModalCadastro} // Abre o modal
        label="Cadastrar Usuário" // Titulo do modal
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
        <UsuarioFormulario
          ref={formRef} /* Passa a referencia do formulario */
          onSuccess={(message) => {
            setMensagemSucesso(message) 
            setOpenModalCadastro(false)
            fetchUsuarios() // Atualiza a tabela
          }}
        />
      </Modal>

      {/* Modal de Edição */}
      {usuarioSelecionado && (
        <Modal
          isOpen={openModalEdicao}
          label="Editar Usuário"
          buttons={
            <>
              <BtnCancelar onClick={closeEditModal} />
              <BtnAzul icon={<IoAddCircleOutline />} label="SALVAR" onClick={() => formRef.current?.submitForm()} />
            </>
          }
        >
          <Usuario_Edicao
            ref={formRef}
            id={usuarioSelecionado}
            onSuccess={message => {
              setMensagemSucesso(message);
              closeEditModal();
              fetchUsuarios(); // Atualiza a tabela após edição
            }}
          />
        </Modal>
      )}

      {/* Modal de Exclusão */}
      {usuarioSelecionado && (
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
            id={usuarioSelecionado}
            onSuccess={message => {
              setMensagemSucesso(message)
              closeDeleteModal()
              fetchUsuarios()
            }}
          />
        </Modal>
      )}
    </main>
  );
}

export default Usuarios