import React, { useState, useEffect } from "react"

import { Table } from "react-bootstrap"
import { ColumnDef, createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'

import { produtosServices } from "../../services/produtoServices"
import { Produto } from "../../services/produtoServices"
import { ApiException } from "../../config/apiException"

import ImagemProduto from "../../components/ImagemProduto/index"
import ToggleBtn from "../../components/ToggleBtn/index"
import EditarRemoverBtn from "../../components/EditarRemoverBtn"

import './style.css'


// Criar o helper para colunas
const columnHelper = createColumnHelper<Produto>()

function Produtos() {
  // Use state para armazenar uma array de Produto (interface) que será exibido na tabela
  const [data, setData] = useState<Produto[]>([])

  // Chama a função para pegar todos os produtos do BD
  useEffect(() => {
    const fetchProdutos = async () => {
      const result = await produtosServices.getAllProdutos()
      if (result instanceof ApiException) {
        alert(result.message) //caso der erro, exibe a mensagem de erro num alert
      } else {
        setData(result) // caso der certo, armazena os dados no useState data
      }
    };

    fetchProdutos()
  }, [])

  // Função para atualizar o status do produto usando o toggle button !aqui é apenas para atualizar localmente (o useState) !
  const handleStatusChange = (prod_cod: number, newStatus: boolean) => {
    setData(prevData =>
      prevData.map(produto =>
        produto.prod_cod === prod_cod ? { ...produto, prod_status: newStatus } : produto
      )
    )
  }

    // Colunas da tabela
    const columns: ColumnDef<Produto, any>[] = [
        columnHelper.display({
            id: 'table-img',
            cell: props => <ImagemProduto prod_cod={props.row.original.prod_cod} />,
        }),
        columnHelper.accessor('prod_nome', {
            header: () => 'Nome',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('categoria', {
            header: () => 'Categoria',
            cell: info => `${info.getValue()}`, 
        }),
        // columnHelper.accessor('prod_quantidade', {
        //     header: () => 'Quantidade',
        //     cell: info => `${info.getValue()}`, 
        // }), Comentado pois no momento não temos essa informação
        columnHelper.accessor('prod_quantidade', {
            header: () => 'Quantidade',
            cell: info => '0', 
        }), 
        columnHelper.accessor('prod_validade', {
            header: () => 'Validade',
            cell: info => `${info.getValue()}`, 
        }),
        columnHelper.accessor('prod_preco', {
            header: () => 'Preço',
            cell: info => `${info.getValue()}`, 
        }),
        columnHelper.accessor('prod_status', {
            header: () => <div className="th-center"> Status</div>,
            cell: info => (
              <div className="td-center">
                <ToggleBtn
                  checked={info.getValue() == 1} 
                  cod={info.row.original.prod_cod}
                  onStatusChange={(newStatus:any) => handleStatusChange(info.row.original.prod_cod, newStatus)} 
                />
              </div>
            ),
        }),
        columnHelper.display({
          id: 'actions',
          cell: props => <EditarRemoverBtn />
      }),
    ]

  // Cria a tabela, aqui é onde serão passados todos os possíveis parâmetros
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

    return (
      <main>
        <div className="page-title">
          <h1 className="title">Produtos</h1>
          <hr className="line"/>
        </div>

        <Table hover responsive size="lg">
        <thead>
        {table.getHeaderGroups().map(headerGroup => ( // Mapeia o cabeçalho (th) de cada coluna
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
          {table.getRowModel().rows.map(row => ( // Mapeia as linhas e células de cada coluna
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
    </main>
    )
}

export default Produtos