import { useState, useEffect, forwardRef, useImperativeHandle, Ref } from 'react';
import { ApiException } from '../../../../config/apiException';
import { fornecedorServices } from '../../../../services/fornecedorServices';

interface Props {
  id: number  
  onSuccess: (message: string) => void
}

const Forn_Edicao = forwardRef((props: Props, ref: Ref<{ submitForm: () => void }>) => {
  const [Forn_razaoSocial, setRazaoSocial] = useState<string>('')
  const [Forn_nome, setNome] = useState<string>('')
  const [Forn_cnpj, setCNPJ] = useState<string>('')

  const eventoFormulario = async () => {
    const fornecedorAtualizado = {
      Forn_razaoSocial,
      Forn_nome,
      Forn_cnpj
    }

    // Envia o id como parâmetro e as informações atualizdas
    const response = await fornecedorServices.updateFornecedor(props.id, fornecedorAtualizado)
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
        const result = await fornecedorServices.getFornecedorByID(props.id)
        if (result instanceof ApiException) {
          alert(result.message) 
        } else {
            setRazaoSocial(result.Forn_razaoSocial)
            setNome(result.Forn_nome)
            setCNPJ(result.Forn_cnpj)
        }
      };
  
    fetchFornecedor()
  }, []);

  return (
    <form>
      <div className="input-item">
        <label htmlFor="razaoSocial">Razão social</label>
        <input type="text" value={Forn_razaoSocial} onChange={(e) => setRazaoSocial(e.target.value)} />
      </div>
      <div className="input-group-forn">
        <div className="input-item">
          <label htmlFor="nome">Nome</label>
          <input type="text" value={Forn_nome} onChange={(e) => setNome(e.target.value)} />
        </div>
        <div className="input-item">
          <label htmlFor="cnpj">CNPJ</label>
          <input type="text" value={Forn_cnpj} onChange={(e) => setCNPJ(e.target.value)} />
        </div>
      </div>
    </form>
  )
})

export default Forn_Edicao;
