import { Api } from "../config/apiConfig"
import { ApiException } from "../config/apiException"

export interface Entrada {
  Ent_id: number;
  Ent_valortot: number;
  Ent_dataCriacao: Date;
  Usuario: Usuario; 
  Lotes?: Lote[];
}

export interface Usuario {
  Usuario_id: number;
  Usuario_email: string;
  Usuario_nome: string;
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

const getAllEntrada = async (): Promise<Entrada[] | ApiException> => {
  try {
    const { data } = await Api().get('/entrada')
    return data
  } catch (error: any) {
    return new ApiException(error.message || 'Erro ao consultar a API.')
  }
}

const getEntradaByID = async (id: number): Promise<Entrada | ApiException> => {
  try {
    const { data } = await Api().get<any>(`/entrada/${id}`, {
      headers: { 'Content-Type': 'application/json' }
    })
    console.log(data)
    return data;
  } catch (error: any) {
    return new ApiException(error.message || 'Erro ao buscar o registro.')
  }
}

export const getFornecedorByID = async (id: number): Promise<Fornecedores | ApiException> => {
  try {
    const { data } = await Api().get<any>(`/fornecedor/${id}`, {
      headers: { 'Content-Type': 'application/json' }
    })
    return data;
  } catch (error: any) {
    return new ApiException(error.message || 'Erro ao buscar o registro.')
  }
}

export const entradaServices = {
  getAllEntrada,
  getEntradaByID,
  getFornecedorByID
};

