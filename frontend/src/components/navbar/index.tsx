import React from "react";
import './Navbar.css';
import { IoMdPricetags } from "react-icons/io";
import { BsBoxSeamFill } from "react-icons/bs";
import { FaUserGroup } from "react-icons/fa6";
import { FaWarehouse } from "react-icons/fa";
import { FaSquareArrowUpRight } from "react-icons/fa6";
import { PiSignOutBold } from "react-icons/pi";
import { Link, useLocation} from "react-router-dom";
import { MdAllInbox } from "react-icons/md";
import { useAuth } from "../../context/AuthProvider";

const Navbar: React.FC = () => {
  const location = useLocation() // Hook para pegar a rota atual
  const { handleLogout } = useAuth()
  
    return (
        <div className="sidebar">
          <div className="logo">
            <div className="textlogo"> <span>CLOUD STOCK</span> </div>
          </div>
  
          <img src="https://i.ibb.co/LJFHWys/imagem-2024-09-17-201505544.png" alt=''></img>

          <div className="sidebar-menu">
            <div className="itens_menu">
              <Link to="/" className="link">
                <div className={location.pathname === '/' ? 'menu-item active' : 'menu-item'}>
                    <BsBoxSeamFill />
                    <div className="navbartext"><span>Produtos</span></div>
                </div>
              </Link>
              <div className={location.pathname === '/Categorias' ? 'menu-item active' : 'menu-item'}>
                  <IoMdPricetags />
                <div className="navbartext"><span>Categorias</span></div>
              </div>
              <Link to="/Fornecedores" className="link" >
                <div className={location.pathname === '/Fornecedores' ? 'menu-item active' : 'menu-item'}>
                    <FaUserGroup />
                    <div className="navbartext"><span>Fornecedores</span></div>
                </div>
              </Link>
              <Link to="/LocalArmazenamento" className="link">
                <div className={location.pathname === '/LocalArmazenamento' ? 'menu-item active' : 'menu-item'}>
                    <FaWarehouse />
                    <div className="navbartext"><span>Locais Armazenamento</span></div>
                </div>
              </Link>
              <Link to="/Setores" className="link">
                <div className={location.pathname === '/Setores' ? 'menu-item active' : 'menu-item'}>
                    <MdAllInbox />
                    <div className="navbartext"><span>Setores</span></div>
                </div>
              </Link>
              <div className="menu-item">
                  <FaSquareArrowUpRight />
                  <div className="navbartext"><span>Saída</span></div>
              </div>
            </div>
          </div>
    
          <div className="logout" onClick={handleLogout}>
            <span>Logout</span> 
            <PiSignOutBold />
          </div>
        </div>
      );
}
    
    

export default Navbar;