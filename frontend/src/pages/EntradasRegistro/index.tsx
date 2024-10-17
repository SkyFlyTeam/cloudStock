import React from "react"

import './style.css'
import { useState, useEffect, useRef } from "react";
import BtnAzul from "../../components/BtnAzul"
import InputBusca from "../../components/InputBusca"
import { IoAddCircleOutline } from "react-icons/io5"
import { useNavigate } from 'react-router-dom';
import Listagem from "../../components/Listagem"
import { Entrada, entradaServices } from "../../services/entradaServices"
import { ApiException } from "../../config/apiException";
import ToggleBtn from "../../components/ToggleBtn";
import EditarRemoverBtn from "../../components/EditarRemoverBtn";

/* Tabela */
import { Table } from "react-bootstrap";
import { ColumnDef, createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

// Const para a criação de colunas; Define a Tipagem (Interface)
const columnHelper = createColumnHelper<Entrada>();



function EntradasRegistro() {

    const navigate = useNavigate();

    const handleRedirect = () => {
        navigate('/Entradas');
    };

    // Armazena as informações puxadas na tabela
    const [data, setData] = useState<Entrada[]>([]);

    // Função para buscar todos as entradas
    const fetchEntrada = async () => {
        const result = await entradaServices.getAllEntrada()
        if (result instanceof ApiException) {
            console.log(result.message)
        } else {
            setData(result);
        }
    }

    // Chama a função para pegar todos as entradas do BD ao montar o componente
    useEffect(() => {
        fetchEntrada()
    }, [])

    // Altera o Status do componente 
    const handleStatusChange = (ent_id: number, newStatus: boolean) => {
        setData(prevData =>
            prevData.map(produto =>
                produto.Ent_id === ent_id ? { ...produto, prod_status: newStatus } : produto
            )
        )
    }

    // Define as colunas
    const columns: ColumnDef<Entrada, any>[] = [
        columnHelper.accessor('Ent_id', {
            header: () => 'Código',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('Ent_valortot', {
            header: () => 'Valor total',
            cell: info => info.getValue(),
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

        </main>
    )
}

export default EntradasRegistro