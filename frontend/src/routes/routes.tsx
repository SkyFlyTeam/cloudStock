import { BrowserRouter, Route, Routes } from "react-router-dom";

import Produtos from "../pages/Produtos/index";
import LocalArmazenamento from "../pages/LocalArmazenamento/index";
import Setores from "../pages/Setores/index";
import Fornecedores from "../pages/Fornecedores/index";

import EntradasRegistro from "../pages/EntradasRegistro/index";
import Navbar from "../components/navbar";
//import Products from "../pages/produto"
import Login from "../pages/Login";

import Saidas from "../pages/Saidas/index";
import Saidas_cadastro from "../pages/Saidas_cadastro/index";
import Entrada from "../pages/Entrada";
import Usuarios from "../pages/Usuarios";
import Registros from "../pages/Registros";

import '../style/global.css';

import Layout from "./Layout";
import ProtectedRoute from "./ProtectedRoute";
import LocalProduto from "../pages/LocalProduto";


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
                    <Route path="/Saidas" element={<ProtectedRoute allowedRoles={[1]}><Saidas /></ProtectedRoute>}/>
                    <Route path="/Saidas-cadastro" element={<ProtectedRoute allowedRoles={[1]}><Saidas_cadastro/></ProtectedRoute>}/>
                    <Route path="/Entrada" element={<ProtectedRoute allowedRoles={[1]}><Entrada /></ProtectedRoute>}/>
                    <Route path="/RegistrosEntrada" element={<ProtectedRoute allowedRoles={[1]}><EntradasRegistro /></ProtectedRoute>}/>

                    {/* Rotas do Gerente */}
                    <Route path="/Setores" element={<ProtectedRoute allowedRoles={[1, 2]}><Setores /></ProtectedRoute>}/>
                    <Route path="/LocalProduto/:id" element={<ProtectedRoute allowedRoles={[1, 2]}><LocalProduto /></ProtectedRoute>}/>
                    <Route path="/LocalArmazenamento/:id" element={<ProtectedRoute allowedRoles={[1, 2]}><LocalArmazenamento /></ProtectedRoute>}/>
                    <Route path="/Fornecedores" element={<ProtectedRoute allowedRoles={[2]}><Fornecedores /></ProtectedRoute>}/>
                    <Route path="/Registros" element={<ProtectedRoute allowedRoles={[2]}><Registros /></ProtectedRoute>}/>
                    
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
