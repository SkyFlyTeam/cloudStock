import { Api } from "../config/apiConfig"
import { ApiException } from "../config/apiException"

export interface Registro {
  Setor_nome: string
  Setor_id: number
  Setor_status: boolean 
}

const getAllRegistros = async (): Promise<Registro[] | ApiException> => {
    try{
      const { data } = await Api().get('/setor')
      return data
    } catch(error: any){
      return new ApiException(error.message || 'Erro ao consultar a API.')
    }
}

  
export const registrosServices = {
    getAllRegistros,
}//mudar para o modelo, colocar nos campos == ao BD