import { Api } from "../config/apiConfig";
import { ApiException } from "../config/apiException";

export interface Categoria {
  Categoria_id: number;
  Categoria_nome: string;
  Categoria_status: boolean;
  Categoria_pai: number;
  //Categoria_pai_nome?: string; // Adicionando o campo Categoria_pai_nome
}

// GET /categoria - Buscar todas as categorias
const getAllCategoria = async (): Promise<Categoria[] | ApiException> => {
  try {
    const { data } = await Api().get('/categoria');
    return data;
  } catch (error: any) {
    return new ApiException(error.message || 'Erro ao consultar a API.');
  }
};

const createCategoria = async (categoria: Categoria, usuario_id: number): Promise<Categoria | ApiException> => {
  try {
    const { data } = await Api().post<any>('/categoria', categoria, {
      headers: { 'Content-Type': 'application/json', 
      usuario_id: usuario_id
      }
    });

    const categoriaCriada: Categoria = data;
    return categoriaCriada;
  } catch (error: any) {
    return new ApiException(error.message || 'Erro ao criar o registro.');
  }
};

const updateCategoria = async (id: number, categoria: Categoria, Usuario_id: number | undefined): Promise<Categoria | ApiException> => {
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
