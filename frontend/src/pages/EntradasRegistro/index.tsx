import React from "react"
import './style.css'
import { useState, useEffect } from "react";
import BtnAzul from "../../components/BtnAzul"
import InputBusca from "../../components/InputBusca"
import { IoAddCircleOutline, IoArrowBackCircleOutline } from "react-icons/io5"
import { useNavigate } from 'react-router-dom';
import { Entrada, entradaServices } from "../../services/entradaServices"
import { ApiException } from "../../config/apiException";
import Modal from "../../components/Modal";

/* Tabela */
import { Table } from "react-bootstrap";
import { ColumnDef, createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import BtnCancelar from "../../components/BtnCancelar";
import VisualizarBtn from "../../components/VisualizarBtn";
import { Fornecedor, fornecedorServices } from "../../services/fornecedorServices";
import { Produto, produtoServices } from "../../services/produtoServices";
import { BsFilter } from "react-icons/bs";
import { Saida } from "../../services/saidaServices";

// Const para a criação de colunas; Define a Tipagem (Interface)
const columnHelper = createColumnHelper<Entrada>();

function EntradasRegistro() {
    const [entradas, setEntradas] = useState<Entrada[]>([])
    // State para mostrar campo de status
    const [showFiltros, setShowFiltros] = useState(false)
    const [filtroKey, setFiltroKey] = useState(0)
    // Fornecedores
    const [fornecedores, setFornecedores] = useState<Fornecedor[]>([])
    const [fornecedorFiltrado, setFornecedorFiltrado] = useState<Fornecedor | null>(null)
    // Produtos
    const [produtos, setProdutos] = useState<Produto[]>([])
    const [produtoFiltrado, setProdutoFiltrado] = useState<Produto | null>(null)
    // Valor
    const [valorMin, setValorMin] = useState<number | null>(null)
    const [valorMax, setValorMax] = useState<number | null>(null)

    const [openModalVisualizar, setOpenModalVisualizar] = useState(false)
    const [entradaInfo, setEntradaInfo] = useState<Entrada | null>(null)
    const [entradaSelecionada, serEntradaSelecionada] = useState<number | null>(null);
    const navigate = useNavigate();

    const handleRedirect = () => {
        navigate('/Entrada');
    };

    const [data, setData] = useState<Entrada[]>([]);

    const fetchEntrada = async () => {
        const result = await entradaServices.getAllEntrada()
        if (result instanceof ApiException) {
            console.log(result.message)
        } else {
            setData(result);
            setEntradas(result)
        }
    }
    // Função para pegar todos fornecedores
    const fetchFornecedores = async () => {
        const result = await fornecedorServices.getAllFornecedores()
        if(result instanceof ApiException){
        console.log(result.message)
        } else {
        setFornecedores(result)
        }
    }
    // Função para pegar todos produtos
    const fetchProdutos = async () => {
        const result = await produtoServices.getAllProdutos()
        if(result instanceof ApiException){
        console.log(result.message)
        } else {
        setProdutos(result)
        }
    }

    useEffect(() => {
        fetchEntrada()
        fetchFornecedores()
        fetchProdutos()
    }, [])

// FILTROS 
  // Mostrar campo de filtro
  const handleShowFiltros  = () => {
    setShowFiltros((prev) => prev ? false : true)
  }

  const handleFornecedorChange = (id: number) => {
    const fornecedorSelected = fornecedores.find((f) => f.Forn_id === id)
    if(!fornecedorSelected) return
    setFornecedorFiltrado(fornecedorSelected)
  }

  const handleLimparFiltros = () => {
    setData(entradas)
    setFornecedorFiltrado(null)
    setProdutoFiltrado(null)
    setFiltroKey((prevKey) => prevKey + 1)
  }

  const handleProdutoChange = (id: number) => {
    const produtoFiltrado = produtos.find((p) => p.Prod_cod === id)
    if(!produtoFiltrado) return
    setProdutoFiltrado(produtoFiltrado)
  }

    useEffect(() => {
        // Função para aplicar os filtros automaticamente
        const filtrarAutomaticamente = () => {
        let entradasFiltradas = entradas;
    
        if (fornecedorFiltrado?.Forn_id !== undefined) {
            entradasFiltradas = entradasFiltradas.filter((s) =>
            s.Lotes?.some((l) => l.Forn_id === fornecedorFiltrado.Forn_id)
            );
        }
        if (produtoFiltrado !== null) {
            entradasFiltradas = entradasFiltradas.filter((s) => 
            s.Lotes?.some((l) => l.Prod_cod === produtoFiltrado.Prod_cod)
            )
        }
        if (valorMin !== null) {
            entradasFiltradas = entradasFiltradas.filter((e) => 
                e.Ent_valortot >= valorMin
            )
        }
        if (valorMax !== null) {
            entradasFiltradas = entradasFiltradas.filter((e) => 
                e.Ent_valortot <= valorMax
            )
        }

        setData(entradasFiltradas);
        };
    
        filtrarAutomaticamente();
    }, [
        fornecedorFiltrado, 
        produtoFiltrado, 
        entradas, 
        valorMin, 
        valorMax
    ]);


    const columns: ColumnDef<Entrada, any>[] = [
        columnHelper.accessor('Ent_id', {
            header: () => 'Código',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('Ent_valortot', {
            header: () => 'Valor total',
            cell: info => 'R$ ' + Number(info.getValue()).toLocaleString('pt-BR', { minimumFractionDigits: 2 }),
        }),
        columnHelper.display({
            id: 'actions',
            cell: props => (
                <VisualizarBtn
                    id={props.row.original.Ent_id}
                    onView={() => handleVisualizarClick(props.row.original.Ent_id)}
                />
            ),
        }),
    ];

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const handleVisualizarClick = (id: number) => {
        serEntradaSelecionada(id)
        setOpenModalVisualizar(true)

        async function fetchEntradaById(id: number) {
            const response = await entradaServices.getEntradaByID(id)
            console.log(response)
            if (response instanceof ApiException) {
                alert(response.message)
            } else {
                setEntradaInfo(response)
            }
        }
        fetchEntradaById(id)
        
    }

    const calcularSubtotal = (quantidade: number, custo: number) => {
        return (quantidade * custo).toFixed(2);
    }

    return (
        <main>
            <div className="page-title">
                <h1 className="title">Entradas</h1>
                <hr className="line" />
            </div>

            <div className="actions-group">
                <div className="btnFiltrar" onClick={handleShowFiltros}>
                    <BsFilter size={24} style={{ color: '#61BDE0'}} />
                    <span>Filtrar por</span>
                </div>
                <BtnAzul icon={<IoAddCircleOutline />} label='CADASTRAR' onClick={handleRedirect} />
            </div>

            {showFiltros && (
                <>
                <div className="entrada-container-filtros" key={filtroKey}>
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
                    <div className="fornecedor-container">
                        <label htmlFor="inProduto">Produto</label>
                        <select 
                            id="inProduto"
                            className="form-select-custom"
                            onChange={(e) => handleProdutoChange(+e.target.value)}
                        >
                            <option selected >Buscar...</option>
                            {produtos.map((f) => (
                            <option key={f.Prod_cod} value={f.Prod_cod}>
                                {f.Prod_nome}
                            </option>
                            ))}
                        </select>
                    </div>
                    <div className="quantidade-container">
                        <label htmlFor="inValor">Valor:</label>
                        <div>
                            <input 
                            type="number" 
                            id="inValor" 
                            onChange={(e) => setValorMin(e.target.value ? +e.target.value : null)}
                            placeholder="Min"
                            />
                            <input 
                            type="number" 
                            id="inValor" 
                            onChange={(e) => setValorMax(e.target.value ? +e.target.value : null)}
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
                isOpen={openModalVisualizar}
                label={`Visualizar Entrada - ID ${entradaSelecionada}`}
                buttons={
                    <BtnAzul icon={<IoArrowBackCircleOutline />} label='VOLTAR' onClick={() => setOpenModalVisualizar(false)} />
                }
                className="modal-content-visualizar"
            >
                {entradaInfo ? (
                    <div>
                        {/* PRODUTOS */}
                        <div className="grid-container">
                            <h3 className="modal-title">Produtos</h3>
                            <hr />
                        </div>

                        <div className="lotes-visualizar">
                        {entradaInfo.Lotes?.map((lote, index) => (
                            <div key={index} className="lote-container">
                                <div className="produto-info">
                                    <h5><strong>{lote.Produtos?.Prod_nome}</strong></h5>
                                    <div className="info-row">
                                        <div className="info-item">
                                            <span>Quantidade</span>
                                            <span>{lote.Lote_Entrada?.Ent_quantidade!}</span>
                                        </div>
                                        <div className="info-item">
                                            <span>Custo</span>
                                            <span>R${Number(lote.Produtos?.Prod_custo).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                        </div>
                                        <div className="info-item">
                                            <span>Fornecedor</span>
                                            <span>{lote.Fornecedores?.Forn_nome ?? 'Fornecedor não informado'}</span>
                                        </div>
                                        <div className="info-item">
                                            <span>Lote</span>
                                            <span>{lote.Lote_cod}</span>
                                        </div>
                                        <div className="info-item">
                                            <span>Validade</span>
                                            <span>{new Date(lote.Lote_validade).toLocaleDateString('pt-BR')}</span> {/* Transforma a data em dd/mm/aaaa */}
                                        </div>
                                        <div className="info-item">
                                            <span>Local de armazenamento</span>
                                            <span>{lote.Locais_Armazenamento?.LocAr_nome}</span>
                                        </div>
                                        <div className="info-item">
                                            <span>Subtotal</span>
                                            <span>R${Number(calcularSubtotal(lote.Lote_Entrada?.Ent_quantidade!, parseFloat(lote.Produtos?.Prod_custo || '0'))).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        ))}
                        </div>

                        {/*DETALHES */}

                        <div className="grid-container">
                            <h3 className="modal-title">Detalhes</h3>
                            <hr />
                        </div>

                        <div className="detalhes-container">
                            <p><strong>Total: </strong>R${Number(entradaInfo.Ent_valortot).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                            <p><strong>Data: </strong>{new Date(entradaInfo.Ent_dataCriacao).toLocaleDateString()}</p>
                            <p><strong>Realizado por: </strong>{entradaInfo.Usuario?.Usuario_nome}</p>
                        </div>
                    </div>
                ) : (
                    <p>Carregando informações da entrada...</p>
                )}
            </Modal>

        </main>
    )
}

export default EntradasRegistro;
