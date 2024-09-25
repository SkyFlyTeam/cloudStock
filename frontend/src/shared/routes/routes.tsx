import { BrowserRouter, Route, Routes } from "react-router-dom";
import Produtos from "../pages/Produtos";
import LocalArmazenamento from "../pages/LocalArmazenamento";
import Setores from "../pages/Setores";
import Fornecedores from "../pages/Fornecedores";
import Navbar from "../components/navbar";

import '../global.css';

function MainRoutes(){
    return(
        <BrowserRouter>
            <Navbar />
            <div className="content">
                <Routes>
                    <Route path="/" element={<Produtos />} />
                    <Route path="/LocalArmazenamento" element={<LocalArmazenamento />} />
                    <Route path="/Setores" element={<Setores />} />
                    <Route path="/Fornecedores" element={<Fornecedores />} />
                </Routes>
            </div>
        </BrowserRouter>
    )
}

export default MainRoutes