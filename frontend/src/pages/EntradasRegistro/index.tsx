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

// Const para a criação de colunas; Define a Tipagem (Interface)
const columnHelper = createColumnHelper<Entrada>();

function EntradasRegistro() {
    const [openModalVisualizar, setOpenModalVisualizar] = useState(false)
    const [entradaInfo, setEntradaInfo] = useState<Entrada | null>(null)
    const [entradaSelecionada, serEntradaSelecionada] = useState<number | null>(null);
    const navigate = useNavigate();

    const handleRedirect = () => {
        navigate('/Entradas');
    };

    const [data, setData] = useState<Entrada[]>([]);

    const fetchEntrada = async () => {
        const result = await entradaServices.getAllEntrada()
        if (result instanceof ApiException) {
            console.log(result.message)
        } else {
            setData(result);
        }
    }

    useEffect(() => {
        fetchEntrada()
    }, [])

    const columns: ColumnDef<Entrada, any>[] = [
        columnHelper.accessor('Ent_id', {
            header: () => 'Código',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('Ent_valortot', {
            header: () => 'Valor total',
            cell: info => info.getValue(),
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
            <h1 className="title">Entrada</h1>

            <div className="inputButton">
                <InputBusca />
                <BtnAzul icon={<IoAddCircleOutline />} label='CADASTRAR' onClick={handleRedirect} />
            </div>

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
>
    {entradaInfo ? (
        <div className="modal-content">
            <h3 className="modal-title">Produtos</h3>

            {entradaInfo.Lotes?.map((lote, index) => (
                <div key={index} className="lote-container">
                    <div className="produto-info">
                        <p><strong>{lote.Produtos?.Prod_nome}</strong></p>
                        <p>Quantidade: {lote.Lote_quantidade}</p>
                        <p>Custo: R${lote.Produtos?.Prod_custo}</p>
                        <p>Fornecedor: {lote.Produtos?.Fornecedor?.Forn_nome}</p>
                        <p>Lote: {lote.Lote_cod}</p>
                        <p>Validade: {lote.Lote_validade}</p>
                        <p>Local de armazenamento: {lote.Locais_Armazenamento?.LocAr_nome}</p>
                        <p>Subtotal: R${calcularSubtotal(lote.Lote_quantidade, parseFloat(lote.Produtos?.Prod_custo || '0'))}</p>
                    </div>
                </div>
            ))}

            <hr />

            <div className="detalhes-container">
                <h3>Detalhes</h3>
                <p><strong>Total: </strong>R${entradaInfo.Ent_valortot}</p>
                <p><strong>Data: </strong>{new Date(entradaInfo.Ent_dataCriacao).toLocaleDateString()} às {new Date(entradaInfo.Ent_dataCriacao).toLocaleTimeString()}</p>
                <p><strong>Realizado por: </strong>Nome do Usuário</p>
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
