import { Api } from "../config/apiConfig"
import { ApiException } from "../config/apiException"

export interface DataEntrSaida {
    date: Date | string;
    entrada: number;
    saida: number;
};

export interface DataQuantidade {
    Prod_nome: string;
    CategoriaPai: string;
    Quantidade: number;
};

export interface DadosAgrupadosQuantidade  {
    CategoriaPai: string;
    Quantidade: number;
};

export interface DataValor {
    Prod_nome: string;
    CategoriaPai: string;
    ValorTot: number;
};

export interface DadosAgrupadosValor {
    CategoriaPai: string;
    ValorTot: number;
};

export interface DataLucroGastos {
    date: Date | string;
    lucro: number;
    ganhos: number;
    gastos: number;
};

export interface DataPerda {
    date: Date | string;
    perda: number;
};

export interface DataEstGeral {
  Prods_quantidade: number;
  Prods_estoqueMin: number;
  Prods_validade: number;
  Total_entrada: number;
  Total_saida: number;
  Lucro: number;
};

const getEntradaSaida = async (): Promise<DataEntrSaida[] | ApiException> => {
  try {
    const { data } = await Api().get('/estatisticas/valorEntrada-saida')
    return data
  } catch (error: any) {
    return new ApiException(error.message || 'Erro ao consultar a API.')
  }
}

const getProdEntrada = async (): Promise<DataQuantidade[] | ApiException> => {
    try {
      const { data } = await Api().get('/estatisticas/maiorEntrada')
      return data
    } catch (error: any) {
      return new ApiException(error.message || 'Erro ao consultar a API.')
    }
}

const getProdSaida = async (): Promise<DataQuantidade[] | ApiException> => {
    try {
      const { data } = await Api().get('/estatisticas/maiorSaida')
      return data
    } catch (error: any) {
      return new ApiException(error.message || 'Erro ao consultar a API.')
    }
}

const getLucroGastos = async (): Promise<DataLucroGastos[] | ApiException> => {
    try {
      const { data } = await Api().get('/estatisticas/lucro')
      return data
    } catch (error: any) {
      return new ApiException(error.message || 'Erro ao consultar a API.')
    }
}

const getProdRentabilidade = async (): Promise<DataValor[] | ApiException> => {
    try {
      const { data } = await Api().get('/estatisticas/maiorRentabilidade')
      return data
    } catch (error: any) {
      return new ApiException(error.message || 'Erro ao consultar a API.')
    }
}

const getProdCusto = async (): Promise<DataValor[] | ApiException> => {
    try {
      const { data } = await Api().get('/estatisticas/maiorCusto')
      return data
    } catch (error: any) {
      return new ApiException(error.message || 'Erro ao consultar a API.')
    }
}

const getPerdas = async (): Promise<DataPerda[] | ApiException> => {
    try {
      const { data } = await Api().get('/estatisticas/perda')
      return data
    } catch (error: any) {
      return new ApiException(error.message || 'Erro ao consultar a API.')
    }
}

const getEstGeral = async (): Promise<DataEstGeral | ApiException> => {
  try {
    const estoqueData  = await Api().get('/estatisticas/estoqueMinimo');
    const estoqueMin = estoqueData.data.totalEstoqueBaixo

    const validadeData  = await Api().get('/estatisticas/validadeProxima');
    const validadeProx = validadeData.data.totalValidadeProxima

    const prodTotalData  = await Api().get('/estatisticas/contarProdutos');
    const prodTotal = prodTotalData.data.totalProdutos
    console.log(prodTotal)

    const entSaidaLucData  = await Api().get('/estatisticas/tabelaEntradaSaidaLucro');
    const totEntrada = entSaidaLucData.data.Entradas;
    const totSaidas = entSaidaLucData.data.Saidas;
    const totLucro = entSaidaLucData.data.Lucro;

    const data:DataEstGeral = {
      Prods_quantidade: prodTotal,
      Prods_estoqueMin: estoqueMin,
      Prods_validade: validadeProx,
      Total_entrada: totEntrada,
      Total_saida: totSaidas,
      Lucro: totLucro
    }

    return data
  } catch (error: any) {
    return new ApiException(error.message || 'Erro ao consultar a API.')
  }
}

export const estatisticasServices = {
    getEntradaSaida,
    getLucroGastos,
    getPerdas,
    getProdCusto,
    getProdRentabilidade,
    getProdSaida,
    getProdEntrada,
    getEstGeral
};

