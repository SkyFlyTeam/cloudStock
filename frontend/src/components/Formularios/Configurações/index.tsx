import { useState, useEffect, forwardRef, useImperativeHandle, Ref } from 'react';
import './style.css';
import { ApiException } from '../../../config/apiException';
import { configServices } from '../../../services/configServices';
import { useAuth } from '../../../context/AuthProvider';


interface Props {
  onSuccess: (message: string) => void; // Função para quando dê certo
}

const ConfigForm = forwardRef((props: Props, ref: Ref<{ submitForm: () => void }>) => {
  const [Config_avisoValidade, setAvisoValidade] = useState<number>(0);
  const {currentUser} = useAuth();

  const getConfig = async () => {
    const response = await configServices.getAvisoValidade()
    if (response instanceof ApiException) {
      console.error(response.message);
    } else {
        console.log('response', response)
        setAvisoValidade(response)
    }
  };

  useEffect(() => {
    getConfig();
  }, []); 

  const eventoFormulario = async () => {
    const novaConfig = {
      Config_avisoValidade,
    };
  
    const response = await configServices.updateConfig(novaConfig, currentUser?.Usuario_id!);
    if (response instanceof ApiException) {
      console.error(response.message);
    } else {
      props.onSuccess('Configurações salvas com sucesso!');
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
        <label htmlFor="validadeDias">Aviso de data validade próxima: </label>
        <input
          type="number"
          value={Config_avisoValidade}
          onChange={(e) => setAvisoValidade(parseInt(e.target.value))}
          required
          placeholder="Nº dias"
        />
      </div>
    </form>
  );
});

export default ConfigForm;
