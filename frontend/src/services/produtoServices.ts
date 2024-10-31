import { Api } from "../config/apiConfig"
import { ApiException } from "../config/apiException"

export interface Produto {
  Prod_cod: number
  Prod_nome: string
  Prod_descricao: string
  Prod_preco: number
  Prod_custo: number
  Prod_peso: number
  Prod_altura: number
  Prod_largura: number
  Prod_comprimento: number
  Prod_marca: string
  Prod_modelo: string
  Prod_validade: boolean
  Prod_quantidade: number
  Prod_status: boolean
  Categoria_id: any
  UnidadeMedida_id: any
  Prod_imagem: File | null
  Lotes: Lote[]
}


const getAllProdutos = async (): Promise<Produto[] | ApiException> => {
  try {
    const { data } = await Api().get('/produto');
    const produtos = await Promise.all(
      data.map(async (produto: Produto) => {
        const { data: quantidade } = await Api().get<any>(`/lote/quantidade/${produto.Prod_cod}`);

        // Certifique-se de que quantidade não seja undefined
        return {
          ...produto,
          Prod_quantidade: quantidade || 0 // Se quantidade for undefined, retorna 0
        };
      })
    );

    return produtos;

  } catch (error: any) {
    return new ApiException(error.message || 'Erro ao consultar a API.');
  }
}


const createProduto = async (produto: any): Promise<Produto | ApiException> => {
  try {
    const { data } = await Api().post<any>('/produto', produto, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    const produto_criado: Produto = data;
    return produto_criado;
  } catch (error: any) {
    return new ApiException(error.message || 'Erro ao criar o registro.');
  }
}

const updateProduto = async (id: number, produto: any): Promise<Produto | ApiException> => {
  try {
    console.log(produto)
    const { data } = await Api().put<any>(`/produto/${id}`, produto, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    console.log("data: OK")

    const produto_atualizado: Produto = data
    console.log("produto_atualizado: OK")
    return produto_atualizado

  } catch (error: any) {
    return new ApiException(error.message || 'Erro ao criar o registro.')
  }
}

const getProdutoByID = async (id: number): Promise<Produto | ApiException> => {
  try {
    const { data } = await Api().get<any>(`/produto/${id}`, {
      headers: { 'Content-Type': 'application/json' }
    })

    const produto: Produto = data;
    return produto

  } catch (error: any) {
    return new ApiException(error.message || 'Erro ao criar o registro.')
  }
}

const deleteProduto = async (id: number): Promise<any | ApiException> => {

  try {
    const { data } = await Api().delete<any>(`/produto/${id}`, {
      headers: { 'Content-Type': 'application/json' }
    })

    return data

  } catch (error: any) {
    return new ApiException(error.message || 'Erro ao criar o registro.')
  }
}

const getProdutosByLocal = async (id: number): Promise<Produto[] | ApiException> => {
  try {
    const { data } = await Api().get<any>(`/lote/local/${id}`, {
      headers: { 'Content-Type': 'application/json' }
    })
    console.log('local', data)

    // Filtra os produtos para garantir que não haja duplicatas (baseado em Prod_cod)
    const uniqueProducts = data.filter(
      (produto: Produto, index: number, self: Produto[]) =>
        index === self.findIndex((p) => p.Prod_cod === produto.Prod_cod)
    )

    // Faz outra chamada assíncrona para obter a quantidade para cada produto
    const produtos = await Promise.all(
      uniqueProducts.map(async (produto: Produto) => {
        // Faz a requisição para pegar a quantidade do produto por Prod_cod
        const { data: quantidade } = await Api().get<any>(`/lote/quantidade/${produto.Prod_cod}`);

        // Retorna o produto com a quantidade adicionada
        return {
          ...produto, // Inclui os dados atuais do produto
          Prod_quantidade: quantidade // Adiciona a quantidade retornada da segunda chamada
        };
      })
    )

    return produtos

  } catch (error: any) {
    return new ApiException(error.message || 'Erro ao buscar locais pelo ID.')
  }
}

export interface Lote {
  Lote_id: number
  Lote_validade: Date
  Lote_quantidade: number
  Lote_cod: string
  Prod_cod: number
  LocAr_id: number
  Forn_id: number
}

const getProdutoLotes = async (Produto_id: number, Local_id: number): Promise<Lote[] | ApiException> => {
  try {
    const { data } = await Api().get<any>(`/lote/produto/${Produto_id}/${Local_id}`, {
      headers: { 'Content-Type': 'application/json' }
    })

    return data

  } catch (error: any) {
    return new ApiException(error.message || 'Erro ao listar lotes.')
  }
}

export const produtoServices = {
  getAllProdutos,
  createProduto,
  getProdutoByID,
  deleteProduto,
  updateProduto,
  getProdutosByLocal,
  getProdutoLotes
}