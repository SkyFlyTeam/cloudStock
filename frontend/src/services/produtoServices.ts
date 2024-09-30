import { Api } from "../config/apiConfig"
import { ApiException } from "../config/apiException"

export interface Produto {
  Prod_cod: number
  Prod_nome: string
  Prod_descricao: string
  Prod_preco: number
  Prod_custo: number
  Prod_peso: number
  Prod_altura: number
  Prod_largura: number
  Prod_comprimento: number
  Prod_marca: string
  Prod_modelo: string
  Prod_validade: boolean
  Prod_quantidade: number
  Prod_status: boolean
  Categoria_id: any
  UnidadeMedida_id: any
  Prod_imagem: File | null
}


const getAllProdutos = async (): Promise<Produto[] | ApiException> => {
  try {
    const { data } = await Api().get('/produto')
    return data
  } catch (error: any) {
    return new ApiException(error.message || 'Erro ao consultar a API.')
  }
}

const createProduto = async (produto: any): Promise<Produto | ApiException> => {
  try {
    console.log("Batata")
    console.log(produto)
    const { data } = await Api().post<any>('/produto', produto, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    console.log("Quente")
    const produto_criado: Produto = data;
    return produto_criado;
  } catch (error: any) {
    return new ApiException(error.message || 'Erro ao criar o registro.');
  }
}

const updateProduto = async (id: number, produto: any): Promise<Produto | ApiException> => {
  console.log("updateProduto: OK")
  try {
    console.log("Try: OK")
    
    console.log("Pre-data:")
    console.log(id)
    console.log(produto)
    const { data } = await Api().put<any>(`/produto/${id}`, produto, {
      headers: { 'Content-Type': 'application/json' }
    });
    console.log("data: OK")

    const produto_atualizado: Produto = data
    console.log("produto_atualizado: OK")
    return produto_atualizado

  } catch (error: any) {
    return new ApiException(error.message || 'Erro ao criar o registro.')
  }
}

const getProdutoByID = async (id: number): Promise<Produto | ApiException> => {
  try {
    const { data } = await Api().get<any>(`/produto/${id}`, {
      headers: { 'Content-Type': 'application/json' }
    })

    const produto: Produto = data;
    return produto

  } catch (error: any) {
    return new ApiException(error.message || 'Erro ao criar o registro.')
  }
}

const deleteProduto = async (id: number): Promise<any | ApiException> => {

  try {
    const { data } = await Api().delete<any>(`/produto/${id}`, {
      headers: { 'Content-Type': 'application/json' }
    })

    return data

  } catch (error: any) {
    return new ApiException(error.message || 'Erro ao criar o registro.')
  }
}

export const produtoServices = {
  getAllProdutos,
  createProduto,
  getProdutoByID,
  deleteProduto,
  updateProduto
}