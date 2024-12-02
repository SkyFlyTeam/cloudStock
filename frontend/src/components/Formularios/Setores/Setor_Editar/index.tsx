import { useState, useEffect, forwardRef, useImperativeHandle, Ref } from 'react';
import './style.css';
import { ApiException } from '../../../../config/apiException';
import { setoresServices } from '../../../../services/setorServices';
import { useAuth } from '../../../../context/AuthProvider';

interface Props {
    id: number;
    onSuccess: (message: string) => void;
}

const Setor_editar = forwardRef((props: Props, ref: Ref<{ submitForm: () => void }>) => {
    const [Setor_nome, setNome] = useState<string>('');
    const [Setor_status, setStatus] = useState<boolean>(true);
    const { currentUser } = useAuth();

    useEffect(() => {
        const fetchSetor = async () => {
            const result = await setoresServices.getSetorByID(props.id);
            if (result instanceof ApiException) {
                alert(result.message);
            } else {
                setNome(result.Setor_nome);
                setStatus(result.Setor_status);
            }
        };

        fetchSetor();
    }, [props.id]);

    const eventoFormulario = async () => {
        const setorAtualizado = {
            Setor_nome,
            Setor_status,
        };

        const response = await setoresServices.updateSetor(props.id, setorAtualizado, currentUser?.Usuario_id!);
        if (response instanceof ApiException) {
            console.error(response.message);
        } else {
            console.log('Setor atualizado com sucesso:', response);
            props.onSuccess('Setor atualizado com sucesso!');
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
                />
            </div>
        </form>
    );
});

export default Setor_editar;
