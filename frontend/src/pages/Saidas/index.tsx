import { useState, useEffect, useRef } from "react";
import { Fornecedor, fornecedorServices } from "../../services/fornecedorServices";
import { Saida, saidaServices } from "../../services/saidaServices";
import { ApiException } from "../../config/apiException";
import { useNavigate } from 'react-router-dom';

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
import VisualizarBtn from "../../components/VisualizarBtn";
/* Icons */
import { AiOutlineDelete } from "react-icons/ai"
import { IoAddCircleOutline, IoArrowBackCircleOutline } from "react-icons/io5"

// Const para a criação de colunas; Define a Tipagem (Interface)
const columnHelper = createColumnHelper<Saida>();

function Saidas() {
  // Estado para controlar os modais
  const [openModalCadastro, setOpenModalCadastro] = useState(false);
  const [openModalVisualizar, setopenModalVisualizar] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const [saidaInfo, setSaidaInfo] = useState<Saida | null>(null)

  // Guarda o ID dos fornecedores selecionados na tabela
  const [saidaSelecionada, setSaidaSelecionada] = useState<number | null>(null);

  // Mensagem de sucesso das ações
  const [mensagemSucesso, setMensagemSucesso] = useState<string>('');

  // Referência ao forms para realizar o submit fora do componente do forms
  const formRef = useRef<{ submitForm: () => void }>(null);

  // Armazena as informações puxadas na tabela
  const [data, setData] = useState<Saida[]>([]);

  // Declarar essa variável pra ajudar no botão
  const navigate = useNavigate();

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
            onEdit={() => handleVisualizarClick(props.row.original.Saida_id)}
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
  const handleVisualizarClick = (id: number) => {
    setSaidaSelecionada(id)
    setopenModalVisualizar(true) // Abre o modal de edição
    
    async function fetchSaidaById(id: number) { //
      const response = await saidaServices.getSaidaByID(id)
      console.log(response) // VER AS INFORMAÇÕES RETORNADAS
      if (response instanceof ApiException) {
          alert(`aaaaaa ${response.message}`)
      } else {
          setSaidaInfo(response)
      }
    }

    fetchSaidaById(id)
  }

  const closeEditModal = () => {
    setSaidaSelecionada(null)
    setopenModalVisualizar(false)
  }

  // Excluir
  const handleDeleteClick = (id: number) => {
    setSaidaSelecionada(id)
    setOpenDeleteModal(true)
  }

  const closeDeleteModal = () => {
    setSaidaSelecionada(null)
    setOpenDeleteModal(false)
  }

  return (
    <main>
      <div className="page-title">
        <h1 className="title">Saídas</h1>
        <hr className="line" />
      </div>

      <div className="actions-group">
        <BtnAzul icon={<IoAddCircleOutline />} label="CADASTRAR" onClick={() => navigate('/Saidas-cadastro')} />
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
      {/* Modal de Edição */}

      {saidaSelecionada && (
        <Modal
        isOpen={openModalVisualizar} // Abre o modal
        label="Visualizar saída - " // Titulo do modal
        id={saidaSelecionada}
        buttons={
            <>
                <BtnAzul icon={<IoArrowBackCircleOutline />} label='VOLTAR' onClick={() => setopenModalVisualizar(false)} />
            </>
        }
    >
        {saidaInfo ? (
            <div>
                <p>Data de Criação: {new Date(saidaInfo.Saida_dataCriacao).toLocaleDateString()}</p>
                <p>Valor Total: {saidaInfo.Saida_valorTot}</p>
                <p>Criado por: {saidaInfo.Usuarios.Usuario_email}</p>
                
            </div> 
        ) : (
            <p>Carregando informações da entrada...</p>
        )}
    </Modal>
      )}

    </main>
  );
}

export default Saidas
