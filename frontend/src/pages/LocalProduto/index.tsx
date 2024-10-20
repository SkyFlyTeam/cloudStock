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

// Const para a criação de colunas; Define a Tipagem (Interface)
const columnHelper = createColumnHelper<Produto>();

function LocalProduto() {

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
    }
  }

  // Chama a função para pegar todos os fornecedores do BD ao montar o componente
  useEffect(() => {
    fetchProdutosByLocal()
  }, [])

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
        cell: info => info.getValue(),
    }),
    columnHelper.accessor('Prod_custo', {
        header: () => 'Preço Custo',
        cell: info => info.getValue(),
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
        <h1 className="title">Produtos do Local</h1>
        <hr className="line" />
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
              {lotesInfo.map(lote => (
                <tr key={lote.Lote_id} className="table-lp">
                  <td className="td-lote">{lote.Lote_cod}</td>
                  <td className="td-lote">{new Date(lote.Lote_validade).toLocaleDateString()}</td>
                  <td className="td-lote">{lote.Lote_quantidade}</td>
                </tr>
              ))}
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
