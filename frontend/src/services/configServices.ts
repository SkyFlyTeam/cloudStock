import { Api } from "../config/apiConfig"
import { ApiException } from "../config/apiException"

export interface Configuracoes {
    Config_avisoValidade: number 
}

const updateConfig = async (avisoValidade: any, usuario_id: number): Promise<Configuracoes | ApiException> => {
    try {
        const { data } = await Api().put<any>(`/configsistema/`, avisoValidade, {
            headers: { 'Content-Type': 'application/json', usuario_id: usuario_id }
        });

        const config_atualizado: Configuracoes = data
        return config_atualizado

    } catch (error: any) {
        return new ApiException(error.message || 'Erro ao criar o registro.')
    }
}
  
  const getAvisoValidade = async (): Promise<number | ApiException> => {
    try {
      const { data } = await Api().get<any>(`/configsistema/validade`, {
        headers: { 'Content-Type': 'application/json' }
      })
  
      return data
  
    } catch (error: any) {
      return new ApiException(error.message || 'Erro ao criar o registro.')
    }
  }
  
export const configServices = {
    updateConfig, 
    getAvisoValidade
}
