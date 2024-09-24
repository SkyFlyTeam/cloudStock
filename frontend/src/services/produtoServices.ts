import { Api } from "../config/apiConfig"
import { ApiException } from "../config/apiException"

export interface Produto {
  Prod_cod: string
  Prod_nome: string
  Prod_preco: number
}

const getAllProdutos = async (): Promise<Produto[] | ApiException> => {
  try{
    const { data } = await Api().get('/produto')
    return data
  } catch(error: any){
    return new ApiException(error.message || 'Erro ao consultar a API.')
  }
}

const createProduto = async (formData: FormData): Promise<Produto | ApiException> => {
  try {
    const { data } = await Api().post<any>('/produto', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    const produto: Produto = data;
    return produto;
  } catch (error: any) {
    return new ApiException(error.message || 'Erro ao criar o registro.');
  }
}


export const produtosServices = {
  getAllProdutos,
  createProduto
}