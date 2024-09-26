import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import './style.css';
import { FaEdit, FaTrash } from "react-icons/fa";
import { ColumnDef, createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

type Produto = {
  prod_cod: number
  prod_nome: string
  prod_preco: number
}

// Criar o helper para colunas
const columnHelper = createColumnHelper<Produto>();

// Definir as colunas
const columns: ColumnDef<Produto, any>[] = [
  columnHelper.accessor('prod_cod', {
    header: () => 'Código',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('prod_nome', {
    header: () => 'Nome',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('prod_preco', {
    header: () => 'Preço',
    cell: info => `R$ ${info.getValue().toFixed(2)}`, // Formata o preço
  }),
];

function Produtos() {
  const [data, setData] = useState<Produto[]>([
    {
      prod_cod: 453,
      prod_nome: 'aaaa',
      prod_preco: 45.00,
    },
  ]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

    return (
      <Table hover responsive size="lg" style={{marginTop:'100px'}}>
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
          </tr>
        ))}
      </tbody>
    </Table>
    )
}

export default Produtos