import { Api } from "../config/apiConfig"
import { ApiException } from "../config/apiException"
import { Lote } from "./entradaServices"
import { Produto } from "./produtoServices"

export interface Notificacao {
  Not_id: number
  Not_data: Date
  Not_tipo: string
  Not_mensagem: string
  Prod_cod: number
  Lote_id?: number | null
  Produto: Produto
  Lote?: Lote
}

const getAllNotificacoes = async (): Promise<Notificacao[] | ApiException> => {
  try {
      const { data } = await Api().get('/notificacoes');
      const notificacoes = await Promise.all(
          data.map(async (notificacao: Notificacao) => {
              let mensagem = ''
              
              if (notificacao.Not_tipo === 'Estoque') {
                  const { data: quantidade } = await Api().get<any>(`/lote/quantidade/${notificacao.Prod_cod}`)
                  mensagem = `${quantidade} unidades restantes`
              } else {
                  const validade = new Date(notificacao.Lote?.Lote_validade!)
                  const dataAtual = new Date()

                  dataAtual.setHours(0, 0, 0, 0)
                  validade.setHours(0, 0, 0, 0)

                  const restante = Math.floor((validade.getTime() - dataAtual.getTime()) / (24 * 60 * 60 * 1000))
                  mensagem = `${restante} dias restantes para o vencimento`
              }

              return {
                  ...notificacao,
                  Not_mensagem: mensagem
              }
          })
      )

      return notificacoes
  } catch (error: any) {
      return new ApiException(error.message || 'Erro ao consultar a API.');
  }
};


export const notificacoesServices = {
  getAllNotificacoes
}