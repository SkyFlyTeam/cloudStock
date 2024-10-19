import { Api } from "../config/apiConfig"
import { ApiException } from "../config/apiException"

export interface Registro {
  Registro_id: number
  Registro_Mensagem: string
  Registro_Data: Date
  Registro_Repsonsavel: string 
  Registro_Tipo: string
  Registro_Chave: number
  Registro_Usuario: string
}

export interface Usuario {
  Usuario_id: number;
  Usuario_nome: string;
}

const getAllRegistros = async (): Promise<Registro[] | ApiException> => {
    try{
      const { data } = await Api().get('/registros')
      console.log(data)
      return data
    } catch(error: any){
      return new ApiException(error.message || 'Erro ao consultar a API.')
    }
}

export const registrosServices = {
    getAllRegistros,
}