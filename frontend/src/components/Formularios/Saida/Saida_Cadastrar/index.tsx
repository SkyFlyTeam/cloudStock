import { useState, forwardRef, useImperativeHandle, Ref } from 'react';
import './style.css'
import { ApiException } from '../../../../config/apiException';
import { saidaServices } from '../../../../services/saidaServices';
import { cnpjMask } from '../../../../utils/cnpjMask';

interface Props {
    onSuccess: (message: string) => void // Função pra quando dê certo 
}

const SaidaFormulario = forwardRef((props: Props, ref: Ref<{ submitForm: () => void }>) => {
    const [Saida_valorTot, setvalorTot] = useState<string>('')
    const [Saida_dataCriacao, setdataCriacao] = useState<string>('')
    const [Usuario_id, setId] = useState<string>('')

    const eventoFormulario = async () => {
        const novoFornecedor = {
            Saida_valorTot,
            Saida_dataCriacao,
            Usuario_id,
        }
    
        const response = await saidaServices.createSaida(novoFornecedor);
        if (response instanceof ApiException) {
          console.error(response.message);
        } else {
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
                <label htmlFor="razaoSocial">Valor Total</label>
                <input type="text" value={Saida_valorTot} onChange={(e) => setvalorTot(e.target.value)} required placeholder='Valor Total' />
            </div>
            <div className="input-group">
                <div className="input-item">
                    <label htmlFor="nome">Data Criação</label>
                    <input type="date" value={Saida_dataCriacao} onChange={(e) => setdataCriacao(e.target.value)} required placeholder='Data Criação' />
                </div>
                <div className="input-item">
                    <label htmlFor="cnpj">User ID</label>
                    <input type="text" value={Usuario_id} onChange={(e) => setId(e.target.value)} required placeholder='User ID'/>
                </div>
            </div>
        </form>
    )
})

export default SaidaFormulario