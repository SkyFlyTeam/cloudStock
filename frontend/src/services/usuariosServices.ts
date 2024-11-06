import { Api } from "../config/apiConfig"
import { ApiException } from "../config/apiException"

export interface Usuario {
  Usuario_id: number
  Usuario_nome: string
  Usuario_email: string
  Usuario_senha: string
  Usuario_dataCriacao: Date
  Cargo_id: number
  Usuario_status: boolean 
}

const checkLogin = async (credenciais: any): Promise<any | ApiException> => {
    try{
        const { data } = await Api().post<any>('/auth', credenciais, {
            headers: { 'Content-Type': 'application/json' }
        });
        return data
    } catch(error: any){
        return new ApiException(error.message || 'Erro ao consultar a API.')
    }
}

const createUsuario = async (usuario: any): Promise<any | ApiException> => {
  try{
      const { data } = await Api().post<any>('/usuario', usuario, {
          headers: { 'Content-Type': 'application/json' }
      });
      const usuario_criado: Usuario = data
      return usuario_criado
  
    } catch (error: any) {
      return new ApiException(error.message || 'Erro ao criar o registro.')
    }
}

const updateUsuario = async (id: number, usuario: any): Promise<Usuario | ApiException> => {
  try {
    const { data } = await Api().put<any>(`/usuario/${id}`, usuario, {
      headers: { 'Content-Type': 'application/json' }
    });

    const usuario_atualizado: Usuario = data
    return usuario_atualizado

  } catch (error: any) {
    return new ApiException(error.message || 'Erro ao criar o registro.')
  }
}

const getUsuarioById = async (id: number): Promise<Usuario | ApiException> => {
    try {
      const { data } = await Api().get<any>(`/usuario/${id}`, {
        headers: { 'Content-Type': 'application/json' }
      })
  
      const usuario: Usuario = data;
      return usuario
  
    } catch (error: any) {
      return new ApiException(error.message || 'Erro ao criar o registro.')
    }
}

const getAllUsuarios = async (): Promise<Usuario[] | ApiException> => {
  try{
    const { data } = await Api().get('/usuario')
    return data
  } catch(error: any){
    return new ApiException(error.message || 'Erro ao consultar a API.')
  }
}

const updateUsuarioCargo = async (id: number): Promise<Usuario | ApiException> => {
  try {
    const { data } = await Api().put<any>(`/fornecedor/${id}`,{
      headers: { 'Content-Type': 'application/json' }
    });

    const usuario_atualizado: Usuario = data
    return usuario_atualizado

  } catch (error: any) {
    return new ApiException(error.message || 'Erro ao criar o registro.')
  }
}
  

export const usuarioServices = {
    checkLogin,
    getUsuarioById,
    getAllUsuarios,
    updateUsuarioCargo,
    createUsuario,
    updateUsuario
}