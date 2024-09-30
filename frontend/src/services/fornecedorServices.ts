import { Api } from "../config/apiConfig"
import { ApiException } from "../config/apiException"

export interface Fornecedor {
    Forn_id: number
    Forn_razaoSocial: string
    Forn_nome: string
    Forn_cnpj: string
    Forn_status: boolean
}

const getAllFornecedores = async (): Promise<Fornecedor[] | ApiException> => {
  try{
    const { data } = await Api().get('/fornecedor')
    return data
  } catch(error: any){
    return new ApiException(error.message || 'Erro ao consultar a API.')
  }
}

const createFornecedor = async (fornecedor: any): Promise<Fornecedor | ApiException> => {
  try {
    const { data } = await Api().post<any>('/fornecedor', fornecedor, {
      headers: { 'Content-Type': 'application/json' }
    })

    const fornecedor_criado: Fornecedor = data
    return fornecedor_criado

  } catch (error: any) {
    return new ApiException(error.message || 'Erro ao criar o registro.')
  }
}

const updateFornecedor = async (id: number, fornecedor: any): Promise<Fornecedor | ApiException> => {
  try {
    const { data } = await Api().put<any>(`/fornecedor/${id}`, fornecedor, {
      headers: { 'Content-Type': 'application/json' }
    });

    const fornecedor_atualizado: Fornecedor = data
    return fornecedor_atualizado

  } catch (error: any) {
    return new ApiException(error.message || 'Erro ao criar o registro.')
  }
}

const getFornecedorByID = async (id: number): Promise<Fornecedor | ApiException> => {
  try {
    const { data } = await Api().get<any>(`/fornecedor/${id}`, {
      headers: { 'Content-Type': 'application/json' }
    })

    const fornecedor: Fornecedor = data;
    return fornecedor

  } catch (error: any) {
    return new ApiException(error.message || 'Erro ao criar o registro.')
  }
}

const deleteFornecedor = async (id: number): Promise<any | ApiException> => {
  try {
    const { data } = await Api().delete<any>(`/fornecedor/${id}`, {
      headers: { 'Content-Type': 'application/json' }
    })

    return data

  } catch (error: any) {
    return new ApiException(error.message || 'Erro ao criar o registro.')
  }
}


export const fornecedorServices = {
  getAllFornecedores,
  createFornecedor,
  getFornecedorByID,
  updateFornecedor,
  deleteFornecedor
}