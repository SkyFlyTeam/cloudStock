import { Api } from "../config/apiConfig"
import { ApiException } from "../config/apiException"

export interface Unidade_Medida {
    UnidadeMedida_id: number
    UnidadeMedida_nome: string
}

const getAllUnidadeMedida = async (): Promise<Unidade_Medida[] | ApiException> => {
    try {
            const { data } = await Api().get('/unidadeMedida')
            return data
        } catch (error: any) {
            return new ApiException(error.message || 'Erro ao consultar a API.')
        }
}

export const unidadeService = {
    getAllUnidadeMedida
}