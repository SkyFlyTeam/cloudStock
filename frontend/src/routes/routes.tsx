import { BrowserRouter, Route, Routes } from "react-router-dom";
import Produtos from "../pages/Produtos/index";
import LocalArmazenamento from "../pages/LocalArmazenamento/index";
import Setores from "../pages/Setores/index";
import Fornecedores from "../pages/Fornecedores/index";
import Login from "../pages/Login";
import Layout from "./Layout";
import ProtectedRoute from "./ProtectedRoute";

import '../style/global.css';
import Entrada from "../pages/Entrada";
import Usuarios from "../pages/Usuarios";

function MainRoutes(){
    return(
        <BrowserRouter>
            <Routes>
                {/* Rota de Login */}
                <Route path="/" element={<Login />} />
                
                {/* Rotas protegidas */}
                <Route element={<Layout />}>

                    {/* Rotas do Funcionário */}
                    <Route path="/Produtos" element={<ProtectedRoute allowedRoles={[1, 2]}><Produtos /></ProtectedRoute>}/>
                    <Route path="/LocalArmazenamento" element={<ProtectedRoute allowedRoles={[1]}><LocalArmazenamento /></ProtectedRoute>}/>
                    <Route path="/Setores" element={<ProtectedRoute allowedRoles={[1]}><Setores /></ProtectedRoute>}/>
                    <Route path="/Fornecedores" element={<ProtectedRoute allowedRoles={[1]}><Setores /></ProtectedRoute>}/>

                    {/* Rotas do Gerente */}
                    <Route path="/Entrada" element={<ProtectedRoute allowedRoles={[2]}><Entrada /></ProtectedRoute>}/>

                    {/* Rotas do Admin */}
                    <Route path="/Usuarios" element={<ProtectedRoute allowedRoles={[3]}><Usuarios /></ProtectedRoute>}/>
                    
                </Route>

                {/* Rota de não autorizado */}
                <Route path="/unauthorized" element={<div>Não autorizado</div>} />
            </Routes>
        </BrowserRouter>
    )
}

export default MainRoutes