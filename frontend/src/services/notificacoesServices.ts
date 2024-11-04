import { Api } from "../config/apiConfig"
import { ApiException } from "../config/apiException"
import { Lote } from "./entradaServices"
import { Produto } from "./produtoServices"

export interface Notificacao {
  Not_id: number
  Not_Data: Date
  Not_Tipo: string
  Prod_cod: number
  Lote_id?: number | null
  Produto: Produto
  Lote?: Lote
}

const getAllNotificacoes = async (): Promise<Notificacao[] | ApiException> => {
    try{
      const { data } = await Api().get('/notificacoes')
      console.log(data)
      return data
    } catch(error: any){
      return new ApiException(error.message || 'Erro ao consultar a API.')
    }
}

export const notificacoesServices = {
  getAllNotificacoes
}