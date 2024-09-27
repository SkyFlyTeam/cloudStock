import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import './style.css'
import { FaEdit, FaTrash } from "react-icons/fa";
import { ColumnDef, createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import ToggleBtn from "../../components/ToggleBtn";
import EditarRemoverBtn from "../../components/EditarRemoverBtn";

type Fornecedor = {
    forn_nome: string
    forn_cnpj: string
    forn_status: boolean
  }

const columnHelper = createColumnHelper<Fornecedor>();

const handleStatusChange = () => {
    return 0
  }

// Definir as colunas
const columns: ColumnDef<Fornecedor, any>[] = [
    columnHelper.accessor('forn_nome', {
      header: () => 'Nome',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('forn_cnpj', {
      header: () => 'CNPJ',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('forn_status', {
        header: () => 'Status',
        cell: info => (
            <div className="td-center">
              <ToggleBtn
                checked = {info.getValue() == 1} 
                cod = {1 /*info.row.original.forn_status*/ }
                onStatusChange={(newStatus:any) => handleStatusChange()} 
              />
            </div>
          ),
      }),
  ];


function Fornecedores() {
    const [data, setData] = useState<Fornecedor[]>([
        {
            forn_nome: "Placeholder",
            forn_cnpj: "11.111.111/0001-11",
            forn_status: true,
        },
      ]);

      const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
      })

      return (
        <main>
          <div className="page-title">
            <h1 className="title">Fornecedores</h1>
            <hr className="line"/>
          </div>

        <Table hover responsive size="lg" >
            <thead>
            {table.getHeaderGroups().map(headerGroup => (
                <tr className='heading' key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                    <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                        )}
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
                <td className="align-right">
                  <EditarRemoverBtn />
                </td>
                </tr>
            ))}
            </tbody>
        </Table>
      </main>
    )


}

export default Fornecedores