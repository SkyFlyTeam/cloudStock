import { BrowserRouter, Route, Routes } from "react-router-dom";
import Produtos from "../pages/Produtos/index";
import LocalArmazenamento from "../pages/LocalArmazenamento/index";
import Setores from "../pages/Setores/index";
import Fornecedores from "../pages/Fornecedores/index";
import EntradasRegistro from "../pages/EntradasRegistro/index";
import Navbar from "../components/navbar";
//import Products from "../pages/produto"


import '../style/global.css';
import BarraSuperior from "../components/Barra Superior";


function MainRoutes(){
    return(
        <BrowserRouter>
            <div className="content">
                <Navbar />
                <BarraSuperior />
                <div className="main-content">
                    <Routes>
                        <Route path="/" element={<Produtos />}/>
                        <Route path="/LocalArmazenamento" element={<LocalArmazenamento />} />
                        <Route path="/Setores" element={<Setores />} />
                        <Route path="/Fornecedores" element={<Fornecedores />} />
                        <Route path="/EntradasRegistros" element={<EntradasRegistro />} />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    )
}

export default MainRoutes