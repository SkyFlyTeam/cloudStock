import { Api } from "../config/apiConfig"
import { ApiException } from "../config/apiException"

export interface Setor {
  Setor_nome: string
  Setor_id: number
  Setor_status: boolean 
}

const getAllSetores = async (): Promise<Setor[] | ApiException> => {
    try{
      const { data } = await Api().get('/setor')
      return data
    } catch(error: any){
      return new ApiException(error.message || 'Erro ao consultar a API.')
    }
}

const createSetor = async (setor: any): Promise<Setor | ApiException> => {
    try {
      const { data } = await Api().post<any>('/setor', setor, {
        headers: { 'Content-Type': 'application/json' }
      });
  
      const setor_criado: Setor = data
      return setor_criado
    } catch (error: any) {
      return new ApiException(error.message || 'Erro ao criar o registro.');
    }
  }


const updateSetor = async (id: number, setor: any): Promise<Setor | ApiException> => {
    try {
      const { data } = await Api().put<any>(`/setor/${id}`, setor, {
        headers: { 'Content-Type': 'application/json' }
      });
      const setor_atualizado: Setor = data
      return setor_atualizado
    } catch (error: any) {
      return new ApiException(error.message || 'Erro ao criar o registro.')
    }
  }


const getSetorByID = async (id: number): Promise<Setor | ApiException> => {
    try {
      const { data } = await Api().get<any>(`/setor/${id}`, {
        headers: { 'Content-Type': 'application/json' }
      })
      const setor: Setor = data;
      return setor
    } catch (error: any) {
      return new ApiException(error.message || 'Erro ao criar o registro.')
    }
  }


const deleteSetor = async (id: number): Promise<any | ApiException> => {
    try {
      const { data } = await Api().delete<any>(`/setor/${id}`, {
        headers: { 'Content-Type': 'application/json' }
      })
      return data
    } catch (error: any) {
      return new ApiException(error.message || 'Erro ao criar o registro.')
    }
  }

  
export const setoresServices = {
    getAllSetores,
    createSetor,
    getSetorByID,
    updateSetor,
    deleteSetor
}