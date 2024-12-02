import { useState, useEffect, forwardRef, useImperativeHandle, Ref } from 'react';
import { ApiException } from '../../../../config/apiException';
import { usuarioServices } from '../../../../services/usuariosServices';
import './style.css';
import { useAuth } from '../../../../context/AuthProvider';

interface Props {
  id: number;
  onSuccess: (message: string) => void;
}

const Usuario_Edicao = forwardRef((props: Props, ref: Ref<{ submitForm: () => void }>) => {
  const { currentUser } = useAuth();
  const [Usuario_nome, setNome] = useState<string>('');
  const [Usuario_email, setEmail] = useState<string>('');
  const [Cargo_id, setCargo] = useState<number | null>(null);

  const eventoFormulario = async () => {
    const usuarioAtualizado = {
      Usuario_nome,
      Usuario_email,
      Cargo_id,
    };

    const response = await usuarioServices.updateUsuario(props.id, usuarioAtualizado, currentUser?.Usuario_id);
    if (response instanceof ApiException) {
      console.error(response.message);
    } else {
      props.onSuccess('Fornecedor atualizado com sucesso!');
    }
  };

  useImperativeHandle(ref, () => ({
    submitForm() {
      eventoFormulario();
    },
  }));

  useEffect(() => {
    const fetchUsuarios = async () => {
      const result = await usuarioServices.getUsuarioById(props.id);
      if (result instanceof ApiException) {
        alert(result.message);
      } else {
        setNome(result.Usuario_nome);
        setEmail(result.Usuario_email);
        setCargo(result.Cargo_id);
      }
    };

    fetchUsuarios();
  }, [props.id]);

  return (
    <form>
      <div className="input-group-forn">
        <div className="input-item">
          <label htmlFor="nome">Nome</label>
          <input type="text" value={Usuario_nome} onChange={(e) => setNome(e.target.value)} />
        </div>
        <div className="input-item">
          <label htmlFor="email">Email</label>
          <input type="text" value={Usuario_email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="input-item">
          <div className="radio-group">
            <label htmlFor="funcionario" className="radio-label">
              <input
                type="radio"
                id="funcionario"
                name="cargo"
                value="1"
                checked={Cargo_id === 1}
                onChange={() => setCargo(1)}
              />
              Funcionário
            </label>
            <label htmlFor="gerente" className="radio-label">
              <input
                type="radio"
                id="gerente"
                name="cargo"
                value="2"
                checked={Cargo_id === 2}
                onChange={() => setCargo(2)}
              />
              Gerente
            </label>
            <label htmlFor="administrador" className="radio-label">
              <input
                type="radio"
                id="administrador"
                name="cargo"
                value="3"
                checked={Cargo_id === 3}
                onChange={() => setCargo(3)}
              />
              Administrador
            </label>
          </div>
        </div>
      </div>
    </form>
  );
});

export default Usuario_Edicao;
