import React from "react"

import './style.css'
import { useState, useEffect, useRef } from "react";
import BtnAzul from "../../components/BtnAzul"
import InputBusca from "../../components/InputBusca"
import { IoAddCircleOutline, IoArrowBackCircleOutline } from "react-icons/io5"
import { useNavigate } from 'react-router-dom';
import Listagem from "../../components/Listagem"
import { Entrada, entradaServices } from "../../services/entradaServices"
import { ApiException } from "../../config/apiException";
import ToggleBtn from "../../components/ToggleBtn";
import EditarRemoverBtn from "../../components/EditarRemoverBtn";
import Modal from "../../components/Modal";

/* Tabela */
import { Table } from "react-bootstrap";
import { ColumnDef, createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import BtnCancelar from "../../components/BtnCancelar";
import VisualizarBtn from "../../components/VisualizarBtn";
import { resourceLimits } from "worker_threads";
import Local_Editar from "../../components/Formularios/Locais/Local_Editar";

// Const para a criação de colunas; Define a Tipagem (Interface)
const columnHelper = createColumnHelper<Entrada>();

function EntradasRegistro() {

    //Estado para controlar o modal
    const [openModalVisualizar, setOpenModalVisualizar] = useState(false)

    // Salvar informações do json
    const [entradaInfo, setEntradaInfo] = useState<Entrada | null>(null)

    //Guarda o ID da Entrada selecionada
    const [entradaSelecionada, serEntradaSelecionada] = useState<number | null>(null);

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

    // Configurações da tabela
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    //Função para evento de modais
    const handleVisualizarClick = (id: number) => {
        serEntradaSelecionada(id)
        setOpenModalVisualizar(true) // Abre o modal de edição

        async function fetchEntradaById(id: number) { //
            const response = await entradaServices.getEntradaByID(id)
            console.log(response) // VER AS INFORMAÇÕES RETORNADAS

            if (response instanceof ApiException) {
                alert(response.message)
            } else {
                setEntradaInfo(response)
            }
        }

        fetchEntradaById(id)
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
                isOpen={openModalVisualizar} // Abre o modal
                label="Visualizar entrada - " // Titulo do modal
                id={entradaSelecionada}
                buttons={
                    <>
                        <BtnAzul icon={<IoArrowBackCircleOutline />} label='VOLTAR' onClick={() => setOpenModalVisualizar(false)} />
                    </>
                }
            >
                {entradaInfo ? (
                    <div>
                        <p>Data de Criação: {new Date(entradaInfo.Ent_dataCriacao).toLocaleDateString()}</p>
                        <p>Valor Total: {entradaInfo.Ent_valortot}</p>
                        <p>Valor Total: {entradaInfo.Usuario_id}</p>
                        
                    </div> 
                ) : (
                    <p>Carregando informações da entrada...</p>
                )}
            </Modal>
        </main>
    )
}

export default EntradasRegistro