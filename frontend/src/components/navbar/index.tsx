import React from "react";
import './Navbar.css';
import { IoMdPricetags } from "react-icons/io";
import { BsBoxSeamFill } from "react-icons/bs";
import { FaUserGroup } from "react-icons/fa6";
import { FaWarehouse } from "react-icons/fa";
import { FaUsersBetweenLines } from "react-icons/fa6";
import { FaSquareArrowUpRight } from "react-icons/fa6";
import { PiRowsPlusTopFill, PiSignOutBold } from "react-icons/pi";
import { Link, useLocation} from "react-router-dom";
import { MdAllInbox, MdOutlineAppRegistration } from "react-icons/md";
import { HiDocumentReport } from "react-icons/hi";
import { HiMiniUsers } from "react-icons/hi2";
import { useAuth } from "../../context/AuthProvider";
import { RxHamburgerMenu } from "react-icons/rx"
import { IoCloseOutline } from "react-icons/io5";

const Navbar: React.FC = () => {
  const location = useLocation() // Hook para pegar a rota atual
  const { handleLogout, currentUser } = useAuth()

  const abrirNavbar = () => {
		const sidebar = document.querySelector('.sidebar')
    const navtoggle = document.querySelector('.nav-toggle')

    if (sidebar && navtoggle) { 
      sidebar.classList.toggle('is-active')
      navtoggle.classList.toggle('is-active')
    }
  }
  
    return (
        <>
        <div className="nav-toggle" onClick={()=> abrirNavbar()}>
          <RxHamburgerMenu size={25} color="#61BDE0" className="nav-hamburguer"/>
          <IoCloseOutline size={26} color="#61BDE0" className="nav-close"/>
        </div>
        
        <div className="sidebar">
          <div className="logo">
            <div className="textlogo"> <span>CLOUD STOCK</span> </div>
          </div>

          <img src="https://i.ibb.co/LJFHWys/imagem-2024-09-17-201505544.png" alt=''></img>

          <div className="sidebar-menu">
            <div className="itens_menu">

              {/* Rotas do Funcionário */}
              {currentUser?.Cargo_id === 1 &&
                <>
                  <Link to="/Produtos" className="link">
                    <div className={location.pathname === '/Produtos' ? 'menu-item active' : 'menu-item'}>
                      <BsBoxSeamFill />
                      <div className="navbartext"><span>Produtos</span></div>
                    </div>
                  </Link>

                  <Link to="/Fornecedores" className="link">
                  <div className={location.pathname === '/Fornecedores' ? 'menu-item active' : 'menu-item'}>
                    <FaUserGroup />
                    <div className="navbartext"><span>Fornecedores</span></div>
                  </div>
                </Link>

                  <Link to="/Setores" className="link">
                  <div className={location.pathname === '/Setores' ? 'menu-item active' : 'menu-item'}>
                    <MdAllInbox />
                    <div className="navbartext"><span>Setores</span></div>
                  </div>
                </Link>

                  <div className={location.pathname === '/Categorias' ? 'menu-item active' : 'menu-item'}>
                    <IoMdPricetags />
                    <div className="navbartext"><span>Categorias</span></div>
                  </div>
                
                  <Link to="/Saidas" className="link">
                    <div className={location.pathname === '/Saidas' ? 'menu-item active' : 'menu-item'}>
                        <FaSquareArrowUpRight />
                        <div className="navbartext"><span>Saídas</span></div>
                    </div>
                  </Link>

                  <Link to="/RegistrosEntrada" className="link">
                    <div className={location.pathname === '/RegistrosEntrada' ? 'menu-item active' : 'menu-item'}>
                      <PiRowsPlusTopFill />
                      <div className="navbartext"><span>Entrada</span></div>
                    </div>
                  </Link>
              </>
              }

              {/* Rotas do Gerente */}
              {currentUser?.Cargo_id === 2 &&
                <>

                <Link to="/Produtos" className="link">
                  <div className={location.pathname === '/Produtos' ? 'menu-item active' : 'menu-item'}>
                    <BsBoxSeamFill />
                    <div className="navbartext"><span>Produtos</span></div>
                  </div>
                </Link>

                <Link to="/Usuarios" className="link">
                  <div className={location.pathname === '/Usuarios' ? 'menu-item active' : 'menu-item'}>
                    <FaUsersBetweenLines />
                    <div className="navbartext"><span>Usuarios</span></div>
                  </div>
                </Link>
                
                <Link to="/Fornecedores" className="link">
                  <div className={location.pathname === '/Fornecedores' ? 'menu-item active' : 'menu-item'}>
                    <FaUserGroup />
                    <div className="navbartext"><span>Fornecedores</span></div>
                  </div>
                </Link>
                
                <Link to="/Setores" className="link">
                  <div className={location.pathname === '/Setores' ? 'menu-item active' : 'menu-item'}>
                    <MdAllInbox />
                    <div className="navbartext"><span>Setores</span></div>
                  </div>
                </Link>

                  <div className={location.pathname === '/Relatorio' ? 'menu-item active' : 'menu-item'}>
                    <HiDocumentReport />
                    <div className="navbartext"><span>Relatório</span></div>
                  </div>

                  <Link to="/Registros" className="link">
                    <div className={location.pathname === '/Registros' ? 'menu-item active' : 'menu-item'}>
                      <MdOutlineAppRegistration />
                      <div className="navbartext"><span>Registros</span></div>
                    </div>
                  </Link>
                </>}

              {/* Rotas do Usuário */}
              {currentUser?.Cargo_id === 3 &&
                <>
                  <Link to="/Usuarios" className="link">
                    <div className={location.pathname === '/Usuarios' ? 'menu-item active' : 'menu-item'}>
                      <HiMiniUsers />
                      <div className="navbartext"><span>Usuários</span></div>
                    </div>
                  </Link>
                </>}
            </div>
          </div>

          <div className="logout" onClick={handleLogout}>
            <span>Logout</span>
            <PiSignOutBold />
          </div>
        </div></>
        
  );
}
    
    

export default Navbar;
