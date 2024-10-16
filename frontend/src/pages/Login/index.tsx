import { useRef, useState, useContext, useEffect } from 'react';
import { useAuth } from '../../context/AuthProvider';
import './style.css';
import { useNavigate } from 'react-router-dom';

function Login() {
    const { handleLogin, currentUser } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate()

    const handleSubmit = async (e: any ) => {
        e.preventDefault()
        
        try {
            await handleLogin(email, password)
            if (currentUser?.Cargo_id) {
                if (currentUser.Cargo_id === 1) {
                    navigate('/Produto');
                } else if (currentUser.Cargo_id === 2) {
                    navigate('/Entrada');
                } else if (currentUser.Cargo_id === 3) {
                    navigate('/Usuarios');
                }
            }
        } catch (err) {
            alert('Falha ao fazer login. Verifique suas credenciais.');
        }
    }


    return (
        <main>
            <div className="card">
                <div className="logo">
                    <img src="https://i.ibb.co/LJFHWys/imagem-2024-09-17-201505544.png" alt=''></img>
                    <div className="textlogo"> <span>CLOUD STOCK</span> </div>
                </div>

                <div className="card-title">
                    <h6>ENTRAR</h6>
                    <span>Preenche suas informações para realizar o login</span>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <div className="input-item">
                            <label htmlFor="email">Email</label>
                            <input type="email" name="email" id="email" onChange={(e) => setEmail(e.target.value)} value={email} required />
                        </div>
                        <div className="input-item">
                            <label htmlFor="password">Senha</label>
                            <input type="password" name="password" id="password" onChange={(e) => setPassword(e.target.value)} value={password} required />
                        </div>
                    </div>
                    <button>enviar</button>
                </form>
            </div>
        </main>
    )
}

export default Login