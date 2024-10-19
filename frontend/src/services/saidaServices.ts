import { Api } from "../config/apiConfig"
import { ApiException } from "../config/apiException"

export interface Saida {
    Saida_id: number
    Saida_valorTot: string
    Saida_dataCriacao: Date
}

const getAllSaidas = async (): Promise<Saida[] | ApiException> => {
    try {
      const { data } = await Api().get('/saida')
      return data
    } catch (error: any) {
      return new ApiException(error.message || 'Erro ao consultar a API.')
    }
  }

const createSaida = async (saida: any): Promise<Saida | ApiException> => {
  try {
    const { data } = await Api().post<any>('/saida', saida, {
      headers: { 'Content-Type': 'application/json' }
    })
  
    const fornecedor_criado: Saida = data
    return fornecedor_criado
  
  } catch (error: any) {
    return new ApiException(error.message || 'Erro ao criar o registro.')
  }
}

const updateSaida = async (id: number, saida: any): Promise<Saida | ApiException> => {
  try {
    const { data } = await Api().put<any>(`/saida/${id}`, saida, {
      headers: { 'Content-Type': 'application/json' }
    });

    const fornecedor_atualizado: Saida = data
    return fornecedor_atualizado

  } catch (error: any) {
    return new ApiException(error.message || 'Erro ao criar o registro.')
  }
}

const getSaidaByID = async (id: number): Promise<Saida | ApiException> => {
  try {
    const { data } = await Api().get<any>(`/saida/${id}`, {
      headers: { 'Content-Type': 'application/json' }
    })

    const saida: Saida = data;
    return saida

  } catch (error: any) {
    return new ApiException(error.message || 'Erro ao criar o registro.')
  }
}

const deleteSaida = async (id: number): Promise<any | ApiException> => {
  try {
    const { data } = await Api().delete<any>(`/saida/${id}`, {
      headers: { 'Content-Type': 'application/json' }
    })

    return data

  } catch (error: any) {
    return new ApiException(error.message || 'Erro ao criar o registro.')
  }
}

export const saidaServices = {
    getAllSaidas,
    createSaida,
    updateSaida,
    getSaidaByID, 
    deleteSaida,
}