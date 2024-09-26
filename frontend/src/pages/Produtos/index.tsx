import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import './style.css';
import { FaEdit, FaTrash } from "react-icons/fa";
import { ColumnDef, createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { produtosServices } from "../../services/produtoServices";
import { Produto } from "../../services/produtoServices";
import { ApiException } from "../../config/apiException";
import ImagemProduto from "../../components/ImagemProduto/index";
import ToggleBtn from "../../components/ToggleBtn/index";

// Criar o helper para colunas
const columnHelper = createColumnHelper<Produto>();


function Produtos() {
  const [data, setData] = useState<Produto[]>([]);

  useEffect(() => {
    const fetchProdutos = async () => {
      const result = await produtosServices.getAllProdutos();
      if (result instanceof ApiException) {
        alert(result.message);
      } else {
        setData(result);
      }
    };

    fetchProdutos();
  }, []);

  // Função para atualizar o status do produto
  const handleStatusChange = (prod_cod: number, newStatus: boolean) => {
    setData(prevData =>
      prevData.map(produto =>
        produto.prod_cod === prod_cod ? { ...produto, prod_status: newStatus } : produto
      )
    )
  }

    // Definir as colunas
    const columns: ColumnDef<Produto, any>[] = [
        columnHelper.display({
            id: 'table-img',
            cell: props => <ImagemProduto prod_cod={props.row.original.prod_cod} />,
        }),
        columnHelper.accessor('prod_nome', {
            header: () => 'Nome',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('prod_categoria', {
            header: () => 'Categoria',
            cell: info => `${info.getValue()}`, // Formata o preço
        }),
        columnHelper.accessor('prod_quantidade', {
            header: () => 'Quantidade',
            cell: info => `${info.getValue()}`, // Formata o preço
        }),
        columnHelper.accessor('prod_validade', {
            header: () => 'Validade',
            cell: info => `${info.getValue()}`, // Formata o preço
        }),
        columnHelper.accessor('prod_preco', {
            header: () => 'Preço',
            cell: info => `R$ ${info.getValue()}`, // Formata o preço
        }),
        columnHelper.accessor('prod_status', {
            header: 'Status',
            cell: info => (
                <ToggleBtn
                checked={info.getValue()} 
                cod={info.row.original.prod_cod} // Passa o prod_cod
                onStatusChange={(newStatus:any) => handleStatusChange(info.row.original.prod_cod, newStatus)} // Passa o callback
                />
            ),
        }),
    ]


  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

    return (
      <Table hover responsive size="lg">
      <thead>
      {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <th key={header.id}>
                {typeof header.column.columnDef.header === 'function'
                  ? header.column.columnDef.header(header.getContext())
                  : header.column.columnDef.header}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
         {table.getRowModel().rows.map(row => (
          <React.Fragment key={row.id}>
            <tr className="table-row">
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())} 
                </td>
              ))}
            </tr>
            <tr className="vazia"></tr> 
          </React.Fragment>
        ))}
      </tbody>
    </Table>
    )
}

export default Produtos