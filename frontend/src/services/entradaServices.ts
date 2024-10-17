import { Api } from "../config/apiConfig"
import { ApiException } from "../config/apiException"
 
export interface Entrada {
    Ent_id: number
    Ent_valortot: number
    Ent_dataCriacao: Date
    Usuario_id: number
}
 
const getAllEntrada = async (): Promise<Entrada[] | ApiException> => {
  try{
    const { data } = await Api().get('/entrada')
    return data
  } catch(error: any){
    return new ApiException(error.message || 'Erro ao consultar a API.')
  }
}
 
const createEntrada = async (entrada: any): Promise<Entrada | ApiException> => {
  try {
    const { data } = await Api().post<any>('/entrada', entrada, {
      headers: { 'Content-Type': 'application/json' }
    })
 
    const entrada_criado: Entrada = data
    return entrada_criado
 
  } catch (error: any) {
    return new ApiException(error.message || 'Erro ao criar o registro.')
  }
}
 
const updateEntrada = async (id: number, entrada: any): Promise<Entrada | ApiException> => {
  try {
    const { data } = await Api().put<any>(`/entrada/${id}`, entrada, {
      headers: { 'Content-Type': 'application/json' }
    });
 
    const fornecedor_atualizado: Entrada = data
    return fornecedor_atualizado
 
  } catch (error: any) {
    return new ApiException(error.message || 'Erro ao criar o registro.')
  }
}
 
const getEntradaByID = async (id: number): Promise<Entrada | ApiException> => {
  try {
    const { data } = await Api().get<any>(`/entrada/${id}`, {
      headers: { 'Content-Type': 'application/json' }
    })
 
    const entrada: Entrada = data;
    return entrada
 
  } catch (error: any) {
    return new ApiException(error.message || 'Erro ao criar o registro.')
  }
}
 
const deleteEntrada = async (id: number): Promise<any | ApiException> => {
  try {
    const { data } = await Api().delete<any>(`/entrada/${id}`, {
      headers: { 'Content-Type': 'application/json' }
    })
 
    return data
 
  } catch (error: any) {
    return new ApiException(error.message || 'Erro ao criar o registro.')
  }
}
 
 
export const entradaServices = {
  getAllEntrada,
  createEntrada,
  getEntradaByID,
  updateEntrada,
  deleteEntrada
}