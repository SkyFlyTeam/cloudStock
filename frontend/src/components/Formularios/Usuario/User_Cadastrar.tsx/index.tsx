import { useState, forwardRef, useImperativeHandle, Ref } from 'react';
import './style.css'
import { ApiException } from '../../../../config/apiException';
import { fornecedorServices } from '../../../../services/fornecedorServices';
import { cnpjMask } from '../../../../utils/cnpjMask';
import { usuarioServices } from '../../../../services/usuariosServices';

interface Props {
    onSuccess: (message: string) => void // Função pra quando dê certo 
}

const UsuarioFormulario = forwardRef((props: Props, ref: Ref<{ submitForm: () => void }>) => {
    const [Usuario_nome, setNome] = useState<string>('')
    const [Usuario_email, setEmail] = useState<string>('')
    const [Usuario_senha, setSenha] = useState<string>('')
    const [Cargo_id, setCargo] = useState<number>(0) // Quando é criado o status é ativado - true

    const eventoFormulario = async () => {
        const novoUsuario = {
            Usuario_nome,
            Usuario_email,
            Usuario_senha,
            Cargo_id
        }
    
        console.log(novoUsuario)
        const response = await usuarioServices.createUsuario(novoUsuario);
        if (response instanceof ApiException) {
          console.error(response.message);
        } else {
          console.log("Fornecedor criado com sucesso:", response)
          setEmail('')
          setNome('')
          setSenha('')
          setCargo(0)
          props.onSuccess('Fornecedor criado com sucesso!') // Mensagem que será exibida na tela
        }
    }

    // Função necessária para realizar o submit utilizando a referência
    useImperativeHandle(ref, () => ({
        submitForm() {
          eventoFormulario()
        }
    }))
     
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCargo(Number(e.target.value));
    };

    return (
        <form>
            <div className="input-item">
                <label htmlFor="razaoSocial">Nome</label>
                <input type="text" value={Usuario_nome} onChange={(e) => setNome(e.target.value)} required placeholder='Nome' />
            </div>
            <div className="input-group-forn">
                <div className="input-item">
                    <label htmlFor="nome">Email</label>
                    <input type="text" value={Usuario_email} onChange={(e) => setEmail(e.target.value)} required placeholder='Email' />
                </div>
                <div className="input-item">
                    <label htmlFor="cnpj">Senha</label>
                    <input type="text" value={Usuario_senha} onChange={(e) => setSenha(e.target.value)} required placeholder='Senha'/>
                </div>
            </div>
            <div className="input-item">
            <div className="input-item">
                    <label htmlFor="funcionario">
                    <input 
                        type="radio" 
                        id="funcionario" 
                        name="cargo" 
                        value="1" 
                        checked={Cargo_id === 1}
                        onChange={handleChange}
                    />
                    Funcionário
                    </label>
                </div>

                <div className="input-item">
                    <label htmlFor="gerente">
                    <input 
                        type="radio" 
                        id="gerente" 
                        name="cargo" 
                        value="2" 
                        checked={Cargo_id === 2}
                        onChange={handleChange}
                    />
                    Gerente
                    </label>
                </div>

                <div className="input-item">
                    <label htmlFor="administrador">
                    <input 
                        type="radio" 
                        id="administrador" 
                        name="cargo" 
                        value = "3" 
                        checked={Cargo_id === 3}
                        onChange={handleChange}
                    />
                    Administrador
                    </label>
                </div>
            </div>
        </form>
    )
})

export default UsuarioFormulario