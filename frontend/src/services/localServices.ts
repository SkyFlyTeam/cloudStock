import { Api } from "../config/apiConfig"
import { ApiException } from "../config/apiException"

export interface Local_Armazenamento {
  LocAr_id: number
  LocAr_nome: string
  Setor_id: number 
  LocAr_status: boolean 
}

const getAllLocais = async (): Promise<Local_Armazenamento[] | ApiException> => {
    try{
      const { data } = await Api().get('/localarmazenamento')
      return data
    } catch(error: any){
      return new ApiException(error.message || 'Erro ao consultar a API.')
    }
}

const createLocal = async (local: any, usuario_id: number): Promise<Local_Armazenamento | ApiException> => {
    try {
      const { data } = await Api().post<any>('/localarmazenamento', local, {
        headers: { 'Content-Type': 'application/json', usuario_id: usuario_id  }
      });
  
      const local_criado: Local_Armazenamento = data
      return local_criado
    } catch (error: any) {
      return new ApiException(error.message || 'Erro ao criar o registro.');
    }
  }

  const updateLocal = async (id: number, local: any, usuario_id: number): Promise<Local_Armazenamento | ApiException> => {
    try {
      const { data } = await Api().put<any>(`/localarmazenamento/${id}`, local, {
        headers: { 'Content-Type': 'application/json', usuario_id: usuario_id  }
      });
  
      const local_atualizado: Local_Armazenamento = data
      return local_atualizado
  
    } catch (error: any) {
      return new ApiException(error.message || 'Erro ao criar o registro.')
    }
  }
  
  const getLocalByID = async (id: number): Promise<Local_Armazenamento | ApiException> => {
    try {
      const { data } = await Api().get<any>(`/localarmazenamento/${id}`, {
        headers: { 'Content-Type': 'application/json' }
      })
  
      const local: Local_Armazenamento = data;
      return local
  
    } catch (error: any) {
      return new ApiException(error.message || 'Erro ao criar o registro.')
    }
  }
  
  const deleteLocal = async (id: number): Promise<any | ApiException> => {
    try {
      const { data } = await Api().delete<any>(`/localarmazenamento/${id}`, {
        headers: { 'Content-Type': 'application/json' }
      })
  
      return data
  
    } catch (error: any) {
      return new ApiException(error.message || 'Erro ao deletar o registro.')
    }
  }

  const getLocaisBySetor = async (id: number): Promise<Local_Armazenamento[] | ApiException> => {
    try {
      const { data } = await Api().get<any>(`/localarmazenamento/setor/${id}`, {
        headers: { 'Content-Type': 'application/json' }
      })
  
      return data
  
    } catch (error: any) {
      return new ApiException(error.message || 'Erro ao buscar locais pelo ID.')
    }
  }
  
export const localServices = {
    getAllLocais,
    createLocal,
    updateLocal,
    getLocalByID,
    deleteLocal,
    getLocaisBySetor
}
