import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react"
import { Usuario, usuarioServices } from "../services/usuariosService"
import { ApiException } from "../config/apiException"

type AuthContext = {
    authToken?: string | null
    currentUser?: Usuario | null
    handleLogin: (email: string, senha: string) => Promise<void>
    handleLogout: () => Promise<void>
    isLoading: boolean 
}

const AuthContext = createContext<AuthContext | undefined>(undefined)

type AuthProviderProps = PropsWithChildren

export default function AuthProvider({children}: AuthProviderProps) {
    const [authToken, setAuthToken] = useState<string | null>()
    const [currentUser, setCurrentUser] = useState<Usuario | null>(null)
    const [isLoading, setIsLoading] = useState(true) 

    async function handleLogin(email: string, senha: string) {
        setIsLoading(true);
        const credenciais = {
            email, 
            senha
        }

        const response = await usuarioServices.checkLogin(credenciais);
        
        if (response instanceof ApiException) {
            setAuthToken(null)
            setCurrentUser(null)
            setIsLoading(false);
            throw new Error(response.message)
        } else {
            const { usuarioLogin, authToken } = response
            setAuthToken(authToken)
            setCurrentUser(usuarioLogin)
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(usuarioLogin))
            setIsLoading(false); 
        }
    }

    async function handleLogout() {
        setAuthToken(null)
        setCurrentUser(null)
        setIsLoading(false);
        localStorage.removeItem('authToken')
        localStorage.removeItem('currentUser')
    }

    useEffect(() => {
        const savedAuthToken = localStorage.getItem('authToken');
        const savedUser = localStorage.getItem('currentUser');
    
        if (savedAuthToken && savedUser) {
            setAuthToken(savedAuthToken);
            setCurrentUser(JSON.parse(savedUser));
        }
        setIsLoading(false); 
    }, [])
    
    return(
        <AuthContext.Provider value={{authToken, currentUser, handleLogin, handleLogout, isLoading}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth(){
    const context = useContext(AuthContext)

    if (context === undefined){
        throw new Error('useAuth deve estar dentro de um AuthProvider')
    }

    return context
}