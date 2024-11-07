import { Api } from "../config/apiConfig";
import { ApiException } from "../config/apiException";

export interface Categoria {
  Categoria_id: number;
  Categoria_nome: string;
  Categoria_status: boolean;
  Categoria_pai?: number; // Campo opcional, pois pode ser null
  Produtos?: Produto[];   // Associações podem ser carregadas opcionalmente
}

export interface Produto {
  // Defina a interface Produto com base na estrutura de dados que você está esperando
  Produto_id: number;
  Produto_nome: string;
  // Outros campos de Produto conforme necessário
}

const getAllCategoria = async (): Promise<Categoria[] | ApiException> => {
  try {
    const { data } = await Api().get('/categoria');
    return data;
  } catch (error: any) {
    return new ApiException(error.message || 'Erro ao consultar a API.');
  }
};

const createCategoria = async (categoria: Categoria): Promise<Categoria | ApiException> => {
  try {
    const { data } = await Api().post<Categoria>('/categoria', categoria, {
      headers: { 'Content-Type': 'application/json' }
    });

    const categoriaCriada: Categoria = data;
    return categoriaCriada;
  } catch (error: any) {
    return new ApiException(error.message || 'Erro ao criar o registro.');
  }
};

const updateCategoria = async (id: number, categoria: Categoria): Promise<Categoria | ApiException> => {
  try {
    const { data } = await Api().put<Categoria>(`/categoria/${id}`, categoria, {
      headers: { 'Content-Type': 'application/json' }
    });

    const categoriaAtualizada: Categoria = data;
    return categoriaAtualizada;
  } catch (error: any) {
    return new ApiException(error.message || 'Erro ao atualizar o registro.');
  }
};

const getCategoriaByID = async (id: number): Promise<Categoria | ApiException> => {
  try {
    const { data } = await Api().get<Categoria>(`/categoria/${id}`, {
      headers: { 'Content-Type': 'application/json' }
    });

    const categoria: Categoria = data;
    return categoria;
  } catch (error: any) {
    return new ApiException(error.message || 'Erro ao consultar o registro.');
  }
};

const deleteCategoria = async (id: number): Promise<any | ApiException> => {
  try {
    const { data } = await Api().delete<any>(`/categoria/${id}`, {
      headers: { 'Content-Type': 'application/json' }
    });

    return data;
  } catch (error: any) {
    return new ApiException(error.message || 'Erro ao excluir o registro.');
  }
};

export const categoriaServices = {
  getAllCategoria,
  createCategoria,
  getCategoriaByID,
  updateCategoria,
  deleteCategoria
};
