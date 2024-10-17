import { PropsWithChildren } from "react"
import { Usuario } from "../services/usuariosService"
import { useAuth } from "../context/AuthProvider"
import { Navigate } from "react-router-dom"

type ProtectedRouteProps = PropsWithChildren & {
    allowedRoles?: Usuario['Cargo_id'][]
}

export default function ProtectedRoute({allowedRoles, children}: ProtectedRouteProps){
    const { currentUser, isLoading } = useAuth()

    console.log(currentUser)

    if (isLoading) {
        return <div>Carregando...</div>
    }

    if(currentUser === null || currentUser === undefined){
        console.log('nao logado')
        return <Navigate to="/" />
    }

    if(!(allowedRoles && allowedRoles.includes(currentUser.Cargo_id))){
        console.log('nao autorizado')
        return <Navigate to="/unauthorized" />
    }
    console.log('ok')
    return <>{children}</>
}