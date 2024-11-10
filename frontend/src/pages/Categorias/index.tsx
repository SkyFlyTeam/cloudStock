import React, { useState, useEffect, useRef } from "react";
import { Categoria, categoriaServices } from "../../services/categoriaServices";
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
import CategoriaFormulario from "../../components/Formularios/Categorias/Cat_Cadastrar"
import CategoriaEdicao from "../../components/Formularios/Categorias/Cat_Editar"

/* Icons */
import { IoAddCircleOutline } from "react-icons/io5";
import { AiOutlineDelete } from "react-icons/ai";
import { hostname } from "../../config/apiConfig";

import { useAuth } from "../../context/AuthProvider";
import SearchBar from "../../components/SearchBar/SearchBar";
import Pagination from "../../components/Pagination";


// Const para a criação de colunas; Define a Tipagem (Interface)
const columnHelper = createColumnHelper<Categoria>();

function Categorias() {
  // Estado para controlar os modais
  const [openModalCadastro, setOpenModalCadastro] = useState(false);
  const [openModalEdicao, setOpenModalEdicao] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const { currentUser } = useAuth();

  const [categoriaSelecionada, setCategoriaSelecionada] = useState<number | null>(null);
  const [mensagemSucesso, setMensagemSucesso] = useState<string>('');
  const formRef = useRef<{ submitForm: () => void }>(null);
  const [data, setData] = useState<Categoria[]>([]);
  const [filteredData, setFilteredData] = useState<Categoria[]>([]);
  const [categoriasPais, setCategoriasPais] = useState<Categoria[]>([]); // Estado para categorias pais

  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 10; // Number of items per page

  // Função para buscar todas as categorias
  const fetchCategorias = async () => {
    const result = await categoriaServices.getAllCategoria();
    if (result instanceof ApiException) {
      console.log(result.message);
    } else {
      const categoriasComPai = result.map((categoria) => {
        if (categoria.Categoria_pai) {
          const categoriaPai = result.find(c => c.Categoria_id === categoria.Categoria_pai);
          return { ...categoria, Categoria_pai_nome: categoriaPai ? categoriaPai.Categoria_nome : "-" };
        } else {
          return { ...categoria, Categoria_pai_nome: "-" };
        }
      });
      setData(categoriasComPai);
      setFilteredData(categoriasComPai);
    }
  };

  const fetchCategoriasPais = async () => {
    const result = await categoriaServices.getAllCategoria();
    if (result instanceof ApiException) {
      console.error(result.message);
    } else {
      setCategoriasPais(result); // Atualiza categorias pais
    }
  };

  useEffect(() => {
    fetchCategorias();
    fetchCategoriasPais(); // Chama para carregar categorias pais
  }, []);

  const handleSearch = (query: string) => {
    const filtered = data.filter((categoria) =>
      categoria.Categoria_nome.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleStatusChange = (categoria_id: number, newStatus: boolean) => {
    setData(prevData =>
      prevData.map(categoria =>
        categoria.Categoria_id === categoria_id ? { ...categoria, Categoria_status: newStatus } : categoria
      )
    );
  };

  const columns: ColumnDef<Categoria, any>[] = [
    columnHelper.accessor('Categoria_nome', {
      header: () => 'Nome',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('Categoria_pai', {
      header: () => 'Hierarquia',
      cell: ({ row }) => {
        const categoria = row.original;
    
        // Verifique se a categoria pai existe antes de tentar exibi-la
        const categoriaPai = categoriasPais.find(c => c.Categoria_id === categoria.Categoria_pai);
    
        return (
          <span>
            {categoriaPai ? categoriaPai.Categoria_nome : '-'}
          </span>
        );
      }
    }),
    columnHelper.accessor('Categoria_status', {
      header: () => <div className="td-center"> Status </div>,
      cell: info => (
        <div className="td-center">
          <ToggleBtn
            checked={info.getValue() == 1}
            cod={info.row.original.Categoria_id}
            rota={`${hostname}categoria`}
            onStatusChange={(newStatus: any) => handleStatusChange(info.row.original.Categoria_id, newStatus)}
          />
        </div>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      cell: props => (
        <EditarRemoverBtn
          id={props.row.original.Categoria_id}
          onEdit={() => handleEditClick(props.row.original.Categoria_id)}
          onDelete={() => handleDeleteClick(props.row.original.Categoria_id)}
        />
      )
    }),
  ];

  const table = useReactTable({
    data: filteredData,
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

  const handleEditClick = (id: number) => {
    setCategoriaSelecionada(id);
    setOpenModalEdicao(true);
  };

  const closeEditModal = () => {
    setCategoriaSelecionada(null);
    setOpenModalEdicao(false);
  };

  const handleDeleteClick = (id: number) => {
    setCategoriaSelecionada(id);
    setOpenDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setCategoriaSelecionada(null);
    setOpenDeleteModal(false);
  };

  return (
    <main>
      <div className="page-title">
        <h1 className="title">Categorias</h1>
        <hr className="line" />
      </div>

      <div className="actions-group">
        <div className="search-bar-container">
          <SearchBar onSearch={handleSearch} />
        </div>

        <div className="cadastro">
          <BtnAzul icon={<IoAddCircleOutline />} label="CADASTRAR" onClick={() => setOpenModalCadastro(true)} />
        </div>
      </div>

      <Table hover responsive size="lg">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr className="heading" key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
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

      {/* MODALS */}
      <Modal
        isOpen={openModalCadastro}
        label="Cadastrar Categoria"
        buttons={
          <>
            <BtnCancelar onClick={() => setOpenModalCadastro(false)} />
            <BtnAzul icon={<IoAddCircleOutline />} label="CADASTRAR" onClick={() => formRef.current?.submitForm()} />
          </>
        }
      >
        <CategoriaFormulario
          ref={formRef}
          onSuccess={message => {
            setMensagemSucesso(message);
            setOpenModalCadastro(false);
            fetchCategorias();
            fetchCategoriasPais(); 
          }}
        />
      </Modal>

      {categoriaSelecionada && (
        <Modal
          isOpen={openModalEdicao}
          label="Editar Categoria"
          buttons={
            <>
              <BtnCancelar onClick={closeEditModal} />
              <BtnAzul icon={<IoAddCircleOutline />} label="SALVAR" onClick={() => formRef.current?.submitForm()} />
            </>
          }
        >
          <CategoriaEdicao
            ref={formRef}
            id={categoriaSelecionada}
            onSuccess={message => {
              setMensagemSucesso(message);
              closeEditModal();
              fetchCategorias();
              fetchCategoriasPais();
            }}
          />
        </Modal>
      )}

    </main>
  );
}

export default Categorias;
