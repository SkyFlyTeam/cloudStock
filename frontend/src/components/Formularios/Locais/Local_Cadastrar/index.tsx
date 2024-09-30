import { useState, useEffect, forwardRef, useImperativeHandle, Ref } from 'react';
import './style.css';
import { ApiException } from '../../../../config/apiException';
import { localServices } from '../../../../services/localServices';
import { setoresServices } from '../../../../services/setorServices';
import { Setor } from '../../../../services/setorServices';
import Input from '../../../Input';

interface Props {
  onSuccess: (message: string) => void; // Função para quando dê certo
}

const LocalFormulario = forwardRef((props: Props, ref: Ref<{ submitForm: () => void }>) => {
  const [LocAr_nome, setNome] = useState<string>('');
  const [Setor_id, setSetor] = useState<number>(-1);
  const [LocAr_status, setStatus] = useState<boolean>(true); // Quando é criado, o status é ativado - true
  const [setores, setSetores] = useState<{ label: string; value: number }[]>([]);

  const getSetores = async () => {
    const response = await setoresServices.getAllSetores();
    if (response instanceof ApiException) {
      console.error(response.message);
    } else {
      // Mapeando os setores para o formato correto { label: string, value: any }
      const setorOptions = response.map((setor: Setor) => ({
        label: setor.Setor_nome, // Ajuste de acordo com a propriedade correta do Setor
        value: setor.Setor_id
      }));
      setSetores(setorOptions);
    }
  };

  useEffect(() => {
    getSetores();
  }, []); // Carrega os setores quando o componente é montado

  const eventoFormulario = async () => {
    const novoLocal = {
      LocAr_nome,
      Setor_id,
      LocAr_status
    };

    const response = await localServices.createLocal(novoLocal);
    if (response instanceof ApiException) {
      console.error(response.message);
    } else {
      console.log('Local criado com sucesso:', response);
      setNome('');
      setSetor(-1);
      props.onSuccess('Local criado com sucesso!'); // Mensagem que será exibida na tela
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
          required
          placeholder="Nome"
        />
      </div>
      <div className="input-item">
        <Input
          label="Setor"
          type="select"
          value={Setor_id}
          placeholder="Selecione..."
          options={setores} // Agora passando as opções no formato { label, value }
          onChange={(e) => setSetor(parseInt(e.target.value))} // Certifique-se de converter para número
        />
      </div>
    </form>
  );
});

export default LocalFormulario;
