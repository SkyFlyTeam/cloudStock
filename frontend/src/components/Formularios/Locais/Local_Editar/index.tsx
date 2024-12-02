import { useState, useEffect, forwardRef, useImperativeHandle, Ref } from 'react';
import './style.css';
import { ApiException } from '../../../../config/apiException';
import { localServices } from '../../../../services/localServices';
import { setoresServices } from '../../../../services/setorServices';
import { Setor } from '../../../../services/setorServices';
import Input from '../../../Input';
import { useAuth } from '../../../../context/AuthProvider';

interface Props {
    id: number  
    onSuccess: (message: string) => void
  }

const Local_Editar = forwardRef((props: Props, ref: Ref<{ submitForm: () => void }>) => {
  const [LocAr_nome, setNome] = useState<string>('');
  const [Setor_id, setSetor] = useState<number>(-1);
  const [setores, setSetores] = useState<{ label: string; value: number }[]>([]);
  const { currentUser } = useAuth();

  const getSetores = async () => {
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
  }

   // Preenche o formulário com as informações
   useEffect(() => {
    const fetchFornecedor = async () => {
        const result = await localServices.getLocalByID(props.id)
        if (result instanceof ApiException) {
          alert(result.message) 
        } else {
            setNome(result.LocAr_nome)
            setSetor(result.Setor_id)
        }
      };
  
    fetchFornecedor()
    getSetores()
  }, []);



  const eventoFormulario = async () => {
    const localAtualizado = {
      LocAr_nome,
      Setor_id
    };

    // Envia o id como parâmetro e as informações atualizdas
    const response = await localServices.updateLocal(props.id, localAtualizado, currentUser?.Usuario_id!)
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
        <label htmlFor="razaoSocial">Nome</label>
        <input
          type="text"
          value={LocAr_nome}
          onChange={(e) => setNome(e.target.value)}
        />
      </div>
      <div className="input-group">
        <Input
          label="Setor"
          type="select"
          options={setores} // Agora passando as opções no formato { label, value }
          onChange={(e) => setSetor(parseInt(e.target.value))} // Certifique-se de converter para número
        />
      </div>
    </form>
  );
});

export default Local_Editar;
