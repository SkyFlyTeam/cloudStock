import { useState, forwardRef, useImperativeHandle, Ref } from 'react';
import './style.css'
import { ApiException } from '../../../../config/apiException';
import { fornecedorServices } from '../../../../services/fornecedorServices';
import { cnpjMask } from '../../../../utils/cnpjMask';

interface Props {
    onSuccess: (message: string) => void // Função pra quando dê certo 
}

const FornecedorFormulario = forwardRef((props: Props, ref: Ref<{ submitForm: () => void }>) => {
    const [Forn_razaoSocial, setRazaoSocial] = useState<string>('')
    const [Forn_nome, setNome] = useState<string>('')
    const [Forn_cnpj, setCNPJ] = useState<string>('')
    const [Forn_status, setStatus] = useState<boolean>(true) // Quando é criado o status é ativado - true

    const eventoFormulario = async () => {
        const novoFornecedor = {
          Forn_razaoSocial,
          Forn_nome,
          Forn_cnpj,
          Forn_status
        }
    
        const response = await fornecedorServices.createFornecedor(novoFornecedor);
        if (response instanceof ApiException) {
          console.error(response.message);
        } else {
          console.log("Fornecedor criado com sucesso:", response)
          setRazaoSocial('')
          setNome('')
          setCNPJ('')
          props.onSuccess('Fornecedor criado com sucesso!') // Mensagem que será exibida na tela
        }
    }

    // Função necessária para realizar o submit utilizando a referência
    useImperativeHandle(ref, () => ({
        submitForm() {
          eventoFormulario()
        }
    }))
      
    return (
        <form>
            <div className="input-item">
                <label htmlFor="razaoSocial">Razão social</label>
                <input type="text" value={Forn_razaoSocial} onChange={(e) => setRazaoSocial(e.target.value)} required placeholder='Razão Social' />
            </div>
            <div className="input-group-forn">
                <div className="input-item">
                    <label htmlFor="nome">Nome</label>
                    <input type="text" value={Forn_nome} onChange={(e) => setNome(e.target.value)} required placeholder='Nome' />
                </div>
                <div className="input-item">
                    <label htmlFor="cnpj">CNPJ</label>
                    <input type="text" value={cnpjMask(Forn_cnpj)} onChange={(e) => setCNPJ(e.target.value)} required placeholder='CNPJ'/>
                </div>
            </div>
        </form>
    )
})

export default FornecedorFormulario