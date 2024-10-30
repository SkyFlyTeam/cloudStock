import { Api } from "../config/apiConfig"
import { ApiException } from "../config/apiException"

export interface Notificacao {

}

const getAllNotificacoes = async (): Promise<Notificacao[] | ApiException> => {
    try{
      const { data } = await Api().get('/notificacoes')
      return data
    } catch(error: any){
      return new ApiException(error.message || 'Erro ao consultar a API.')
    }
}

export const notificacoesServices = {
    getAllNotificacoes
}