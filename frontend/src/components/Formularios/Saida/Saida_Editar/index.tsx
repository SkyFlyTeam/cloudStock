import { useState, useEffect, forwardRef, useImperativeHandle, Ref } from 'react';
import { ApiException } from '../../../../config/apiException';
import { saidaServices } from '../../../../services/saidaServices';

interface Props {
  id: number  
  onSuccess: (message: string) => void
}

const Saida_Edicao = forwardRef((props: Props, ref: Ref<{ submitForm: () => void }>) => {
  const [Saida_dataCriacao, setSaida_dataCriacao] = useState<Date | null>(null) // Alterado para aceitar null
  const [Saida_valorTot, setSaida_valorTot] = useState<string>('')

  const eventoFormulario = async () => {
    const saidaAtualizado = {
      Saida_dataCriacao,
      Saida_valorTot,
    }

    // Envia o id como parâmetro e as informações atualizadas
    const response = await saidaServices.updateSaida(props.id, saidaAtualizado)
    if (response instanceof ApiException) {
      console.error(response.message)
    } else {
      console.log("Saída atualizada com sucesso:", response)
      props.onSuccess('Saída atualizado com sucesso!')
    }
  }

  useImperativeHandle(ref, () => ({
    submitForm() {
      eventoFormulario()
    }
  }))

  // Preenche o formulário com as informações
  useEffect(() => {
    const fetchSaidas = async () => {
        const result = await saidaServices.getSaidaByID(props.id)
        if (result instanceof ApiException) {
          alert(result.message) 
        } else {
          setSaida_dataCriacao(new Date(result.Saida_dataCriacao)) // Converte string para Date
          setSaida_valorTot(result.Saida_valorTot)
        }
      };
  
    fetchSaidas()
  }, [props.id]);

  return (
    <form>
      <div className="input-item">
        <label htmlFor="Saida_dataCriacao">Data de Criação</label>
        <input 
          type="date" 
          value={Saida_dataCriacao ? Saida_dataCriacao.toISOString().split('T')[0] : ''} // Formata para yyyy-mm-dd
          onChange={(e) => setSaida_dataCriacao(new Date(e.target.value))}
        />
      </div>
      <div className="input-group">
        <div className="input-item">
          <label htmlFor="nome">Valor Total</label>
          <input 
            type="text" 
            value={Saida_valorTot} 
            onChange={(e) => setSaida_valorTot(e.target.value)} 
          />
        </div>
      </div>
    </form>
  )
})

export default Saida_Edicao;
