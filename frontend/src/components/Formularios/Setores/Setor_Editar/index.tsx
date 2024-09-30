import { useState, useEffect, forwardRef, useImperativeHandle, Ref } from 'react';
import './style.css';
import { ApiException } from '../../../../config/apiException';
import { localServices } from '../../../../services/localServices';
import { setoresServices } from '../../../../services/setorServices';
import Input from '../../../Input';

interface Props {
    id: number  
    onSuccess: (message: string) => void
  }

const Setor_editar = forwardRef((props: Props, ref: Ref<{ submitForm: () => void }>) => {
  const [Setor_nome, setNome] = useState<string>('');
  const [Setor_status, setStatus] = useState<boolean>();
  /*const [Setor_id, setSetor] = useState<number>(-1);
  const [setores, setSetores] = useState<{ label: string; value: number }[]>([]);*/

  /*const getSetores = async () => {
    const response = await setoresServices.getAllSetores();
    if (response instanceof ApiException) {
      console.error(response.message);
    } else {
      // Mapeando os setores para o formato correto { label: string, value: any }
      const setorOptions = response.map((setor: Setor) => ({
        label: setor.Setor_nome, // Ajuste de acordo com a propriedade correta do Setor
        value: setor.Setor_id
      }))
      setSetores(setorOptions);
    }
  }*/

   // Preenche o formulário com as informações
   useEffect(() => {
    const fetchSetores = async () => {
        const result = await setoresServices.getSetorByID(props.id)
        if (result instanceof ApiException) {
          alert(result.message) 
        } else {
            setNome(result.Setor_nome)
        }
      };
  
    fetchSetores()
  }, []);



  const eventoFormulario = async () => {
    const localAtualizado = {
      Setor_nome,
    };

    // Envia o id como parâmetro e as informações atualizdas
    const response = await setoresServices.updateSetor(props.id, localAtualizado)
    if (response instanceof ApiException) {
    console.error(response.message)
    } else {
    console.log("Local atualizado com sucesso:", response)
    props.onSuccess('Local atualizado com sucesso!')
    }
  };

  // Função necessária para realizar o submit utilizando a referência
  useImperativeHandle(ref, () => ({
    submitForm() {
      eventoFormulario();
    }
  }));

  return (
    <form>
      <div className="input-item">
        <label htmlFor="nome">Nome</label>
        <input
          type="text"
          value={Setor_nome}
          onChange={(e) => setNome(e.target.value)}
        />
      </div>
    </form>
  );
});

export default Setor_editar;
