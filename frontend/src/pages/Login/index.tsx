import { useRef, useState, useContext, useEffect } from 'react';
import { useAuth } from '../../context/AuthProvider';
import './style.css';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import { IoCloseCircleOutline } from 'react-icons/io5';
import PasswordInput from '../../components/PasswordInput';

function Login() {
    const { handleLogin, currentUser } = useAuth()
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ message, setMessage ] = useState('')

    const navigate = useNavigate()

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        try {
            await handleLogin(email, password)
        } catch (err) {
            setMessage('Falha ao fazer login. Verifique suas credenciais.')
        }
    }

    useEffect(() => {
        if (currentUser?.Cargo_id) {
            if (currentUser.Cargo_id === 1 || currentUser.Cargo_id === 2 ) {
                navigate('/Produtos');
            } else if (currentUser.Cargo_id === 3) {
                navigate('/Usuarios');
            }
        }
    }, [currentUser, navigate])

    return (
        <main className="main-login">
            <Card className='card'>
                <div className="card-logo">
                    <img src="https://i.ibb.co/LJFHWys/imagem-2024-09-17-201505544.png" alt=''></img>
                    <div className="logo-text"> <span>CLOUD STOCK</span> </div>
                </div>

                <div className="card-title">
                    <h6>ENTRAR</h6>
                    <span>Preenche suas informações para realizar o login</span>
                </div>

                {message && (<div className='msg-error'><IoCloseCircleOutline color='#DB1111' size={22}/><span>{message}</span></div>)}

                <form className="login" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <div className="input-item">
                            <label htmlFor="email">Email</label>
                            <input type="email" name="email" id="email" onChange={(e) => setEmail(e.target.value)} value={email} required />
                        </div>
                        <div className="input-item">
                            <label htmlFor="password">Senha</label>
                            <PasswordInput password={password} onPasswordChange={setPassword}/>
                        </div>
                    </div>
                    <button>ENVIAR</button>
                </form>
            </Card>
        </main>
    )
}


export default Login