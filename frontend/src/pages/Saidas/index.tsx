import { useState, useEffect, useRef } from "react";
import { Fornecedor, fornecedorServices } from "../../services/fornecedorServices";
import { Saida, saidaServices } from "../../services/saidaServices";
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
import OlhoSaida from "../../components/OlhoSaida";
import SaidaFormulario from "../../components/Formularios/Saida/Saida_Cadastrar";
import Saida_Edicao from "../../components/Formularios/Saida/Saida_Editar";

/* Icons */
import { IoAddCircleOutline } from "react-icons/io5"
import { AiOutlineDelete } from "react-icons/ai"

// Const para a criação de colunas; Define a Tipagem (Interface)
const columnHelper = createColumnHelper<Saida>();

function Saidas() {
  // Estado para controlar os modais
  const [openModalCadastro, setOpenModalCadastro] = useState(false);
  const [openModalEdicao, setOpenModalEdicao] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  // Guarda o ID dos fornecedores selecionados na tabela
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState<number | null>(null);

  // Mensagem de sucesso das ações
  const [mensagemSucesso, setMensagemSucesso] = useState<string>('');

  // Referência ao forms para realizar o submit fora do componente do forms
  const formRef = useRef<{ submitForm: () => void }>(null);

  // Armazena as informações puxadas na tabela
  const [data, setData] = useState<Saida[]>([]);

  // Função para buscar todos as Saidas

  const fetchSaidas = async () => {
    const result = await saidaServices.getAllSaidas()
    if (result instanceof ApiException) {
      console.log(result.message)
    } else {
      setData(result);
    }
  }

  // Chama a função para pegar todos os fornecedores do BD ao montar o componente
  useEffect(() => {
    fetchSaidas()
  }, [])


  // Altera o Status do componente 
  // const handleStatusChange = (forn_id: number, newStatus: boolean) => {
  //   setData(prevData =>
  //     prevData.map(produto =>
  //       produto.Forn_id === forn_id ? { ...produto, prod_status: newStatus } : produto
  //     )
  //   )
  // }

  // Define as colunas
  const columns: ColumnDef<Saida, any>[] = [
    columnHelper.accessor('Saida_id', {
      header: () => 'Código',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('Saida_valorTot', {
      header: () => 'Valor Total',
      cell: info => `R$ ${info.getValue()}`,
    }),
    columnHelper.display({
      id: 'actions',
      cell: props => (
        <div className="action-cell">
          <OlhoSaida
            id={props.row.original.Saida_id}
            onEdit={() => handleEditClick(props.row.original.Saida_id)}
          />
        </div>
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
        <h1 className="title">Saídas</h1>
        <hr className="line" />
      </div>

      <div className="actions-group">
        <BtnAzul icon={<IoAddCircleOutline />} label="CADASTRAR" onClick={() => setOpenModalCadastro(true)} />
      </div>

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
        label="Cadastrar Saída" // Titulo do modal
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
        <SaidaFormulario
          ref={formRef} /* Passa a referencia do formulario */
          onSuccess={message => {
            setMensagemSucesso(message) 
            setOpenModalCadastro(false)
            // fetchFornecedores() // Atualiza a tabela
          }}
        />
      </Modal>

      {/* Modal de Edição */}
      {fornecedorSelecionado && (
        <Modal
          isOpen={openModalEdicao}
          label="Editar Saida"
          buttons={
            <>
              <BtnCancelar onClick={closeEditModal} />
              <BtnAzul icon={<IoAddCircleOutline />} label="SALVAR" onClick={() => formRef.current?.submitForm()} />
            </>
          }
        >
          <Saida_Edicao
            ref={formRef}
            id={fornecedorSelecionado}
            onSuccess={message => {
              setMensagemSucesso(message);
              closeEditModal();
              // fetchFornecedores(); // Atualiza a tabela após edição
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
              // fetchFornecedores()
            }}
          />
        </Modal>
      )}
    </main>
  );
}

export default Saidas
