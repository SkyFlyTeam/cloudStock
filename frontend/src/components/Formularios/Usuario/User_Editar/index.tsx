import { useState, useEffect, forwardRef, useImperativeHandle, Ref } from 'react';
import { ApiException } from '../../../../config/apiException';
import { usuarioServices } from '../../../../services/usuariosServices';
import { fornecedorServices } from '../../../../services/fornecedorServices';

interface Props {
  id: number  
  onSuccess: (message: string) => void
}

const Usuario_Edicao = forwardRef((props: Props, ref: Ref<{ submitForm: () => void }>) => {
  const [Usuario_nome, setNome] = useState<string>('')
  const [Usuario_email, setEmail] = useState<string>('')

  const eventoFormulario = async () => {
    const fornecedorAtualizado = {
      Usuario_nome,
      Usuario_email
    }

    // Envia o id como parâmetro e as informações atualizdas
    const response = await usuarioServices.updateUsuario(props.id, fornecedorAtualizado)
    if (response instanceof ApiException) {
      console.error(response.message)
    } else {
      console.log("Fornecedor atualizado com sucesso:", response)
      props.onSuccess('Fornecedor atualizado com sucesso!')
    }
  }

  useImperativeHandle(ref, () => ({
    submitForm() {
      eventoFormulario()
    }
  }))

  // Preenche o formulário com as informações
  useEffect(() => {
    const fetchFornecedor = async () => {
        const result = await usuarioServices.getUsuarioById(props.id)
        if (result instanceof ApiException) {
          alert(result.message) 
        } else {
            setNome(result.Usuario_nome)
            setEmail(result.Usuario_email)
        }
      };
  
    fetchFornecedor()
  }, []);

  return (
    <form>
      <div className="input-group-forn">
        <div className="input-item">
          <label htmlFor="nome">Nome</label>
          <input type="text" value={Usuario_nome} onChange={(e) => setNome(e.target.value)} />
        </div>
        <div className="input-item">
          <label htmlFor="email">Email</label>
          <input type="text" value={Usuario_email} onChange={(e) => setEmail(e.target.value)} />
        </div>
      </div>
    </form>
  )
})

export default Usuario_Edicao;
