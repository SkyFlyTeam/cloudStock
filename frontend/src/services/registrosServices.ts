import { Api } from "../config/apiConfig"
import { ApiException } from "../config/apiException"

export interface Registro {
  Registro_id: number
  Registro_Mensagem: string
  Registro_Data: Date
  Registro_Responsavel: string
  Registro_Tipo: string
}

const getAllRegistros = async (): Promise<Registro[] | ApiException> => {
    try{
      const { data } = await Api().get('/registros')
      return data
    } catch(error: any){
      return new ApiException(error.message || 'Erro ao consultar a API.')
    }
}

  
export const registrosServices = {
    getAllRegistros,
}//mudar para o modelo, colocar nos campos == ao BD