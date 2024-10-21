import { Api } from "../config/apiConfig"
import { ApiException } from "../config/apiException"

export interface Saida {
    Saida_id: number
    Saida_valorTot: string
    Saida_dataCriacao: Date
    Usuario: Usuario
    Usuarios: Usuario
    Lotes?: Lote[];
}

export interface Usuario {
  Usuario_id: number;
  Usuario_nome: string,
  Usuario_email: string;
}

export interface Lote {
  Lote_id: number;
  Lote_cod: string;
  Lote_quantidade: number;
  Lote_validade: string;
  Forn_id: number;
  Locais_Armazenamento?: LocalArmazenamento;
  Produtos?: Produto;
  Fornecedores?: Fornecedores;
}

export interface Produto {
  Prod_id: number;
  Prod_nome: string;
  Prod_custo: string;
  Fornecedores?: Fornecedores[];
}

export interface Fornecedores {
  Forn_id: number;
  Forn_nome: string;
}

interface LocalArmazenamento {
  LocAr_id: number;
  LocAr_nome: string;
}

const getAllSaidas = async (): Promise<Saida[] | ApiException> => {
    try {
      const { data } = await Api().get('/saida')
      return data
    } catch (error: any) {
      return new ApiException(error.message || 'Erro ao consultar a API.')
    }
  }

const createSaida = async (saida: any): Promise<Saida | ApiException> => {
  try {
    const { data } = await Api().post<any>('/saida', saida, {
      headers: { 'Content-Type': 'application/json' }
    })
  
    const fornecedor_criado: Saida = data
    return fornecedor_criado
  
  } catch (error: any) {
    return new ApiException(error.message || 'Erro ao criar o registro.')
  }
}

const updateSaida = async (id: number, saida: any): Promise<Saida | ApiException> => {
  try {
    const { data } = await Api().put<any>(`/saida/${id}`, saida, {
      headers: { 'Content-Type': 'application/json' }
    });

    const fornecedor_atualizado: Saida = data
    return fornecedor_atualizado

  } catch (error: any) {
    return new ApiException(error.message || 'Erro ao criar o registro.')
  }
}

const getSaidaByID = async (id: number): Promise<Saida | ApiException> => {
  try {
    const { data } = await Api().get<any>(`/saida/${id}`, {
      headers: { 'Content-Type': 'application/json' }
    })
    
    const saida: Saida = data;
    return saida

  } catch (error: any) {
    return new ApiException(error.message || 'Erro ao criar o registro.')
  }
}

const deleteSaida = async (id: number): Promise<any | ApiException> => {
  try {
    const { data } = await Api().delete<any>(`/saida/${id}`, {
      headers: { 'Content-Type': 'application/json' }
    })

    return data

  } catch (error: any) {
    return new ApiException(error.message || 'Erro ao criar o registro.')
  }
}

export const saidaServices = {
    getAllSaidas,
    createSaida,
    updateSaida,
    getSaidaByID, 
    deleteSaida,
}