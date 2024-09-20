import { Api } from "../config/apiConfig"
import { ApiException } from "../config/apiException"

export interface Produto {
  prod_cod: string
  prod_nome: string
  prod_preco: number
}


const getAllProdutos = async (): Promise<Produto[] | ApiException> => {
  try{
    const { data } = await Api().get('/produto')
    return data
  } catch(error: any){
    return new ApiException(error.message || 'Erro ao consultar a API.')
  }
}

const createProduto = async (produto: Produto): Promise<Produto | ApiException> => {
  try {
    console.log(produto)
    const { data } = await Api().post<any>('/produto', produto);
    return data;
  } catch (error: any) {
    return new ApiException(error.message || 'Erro ao criar o registro.');
  }
}


export const produtosServices = {
  getAllProdutos,
  createProduto
}