import { useState, forwardRef, useImperativeHandle, Ref } from 'react';
import './style.css';
import { ApiException } from '../../../../config/apiException';
import { setoresServices } from '../../../../services/setorServices';
import { useAuth } from '../../../../context/AuthProvider';

interface Props {
    onSuccess: (message: string) => void; // Função para quando dê certo
}

const SetorFormulario = forwardRef((props: Props, ref: Ref<{ submitForm: () => void }>) => {
    const [Setor_nome, setNome] = useState<string>('');
    const [Setor_status, setStatus] = useState<boolean>(true); // Quando é criado, o status é ativado - true
    const { currentUser } = useAuth();

    const eventoFormulario = async () => {
        const novoSetor = {
            Setor_nome,
            Setor_status,
        };

        const response = await setoresServices.createSetor(novoSetor, currentUser?.Usuario_id!);
        if (response instanceof ApiException) {
            console.error(response.message);
        } else {
            console.log('Setor criado com sucesso:', response);
            setNome('');
            props.onSuccess('Setor criado com sucesso!'); // Mensagem que será exibida na tela
        }
    };

    useImperativeHandle(ref, () => ({
        submitForm() {
            eventoFormulario();
        },
    }));

    return (
        <form>
            <div className="input-item">
                <label htmlFor="nome">Nome</label>
                <input
                    type="text"
                    value={Setor_nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                    placeholder="Nome"
                />
            </div>
        </form>
    );
});

export default SetorFormulario;
